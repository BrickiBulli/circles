import { Injectable } from '@angular/core';
import { supabase } from './supabase.service';
import { BehaviorSubject, Subscription } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private messagesSubject = new BehaviorSubject<any[]>([]);
  messages$ = this.messagesSubject.asObservable();

  private subscription: any;

  constructor() {}

  // Fetch chatroom details by ID
  async getChatroomById(chatroomId: string) {
    const { data, error } = await supabase
      .from('chatroom')
      .select('name')
      .eq('id', chatroomId)
      .single();

    if (error) {
      console.error('Error fetching chatroom:', error);
      throw error;
    }
    return data;
  }

  // Fetch messages for a chatroom
  async getMessages(chatroomId: string) {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('chatroom_id', chatroomId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
    return data;
  }

  async initChatroom(chatroomId: string) {
    // Load initial messages
    const { data: initialMessages, error } = await supabase
      .from('messages')
      .select('*')
      .eq('chatroom_id', chatroomId)
      .order('created_at', { ascending: true });

    if (!error && initialMessages) {
      this.messagesSubject.next(initialMessages);
    } else if (error) {
      console.error('Error fetching initial messages:', error);
    }

    // Set up realtime subscription
    this.subscription = supabase
      .channel(`public:messages:chatroom_id=eq.${chatroomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `chatroom_id=eq.${chatroomId}`
        },
        (payload) => {
          const newMessage = payload.new;
          // Append the new message to the current list
          const currentMessages = this.messagesSubject.getValue();
          this.messagesSubject.next([...currentMessages, newMessage]);
        }
      )
      .subscribe();
  }

  async sendMessage(chatroomId: string, userId: string, text: string, imageUrl?: string) {
    const { error } = await supabase
      .from('messages')
      .insert([{
        chatroom_id: chatroomId,
        user_id: userId,
        text: text || null,
        image_url: imageUrl || null
      }]);
  
    if (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  cleanup() {
    if (this.subscription) {
      supabase.removeChannel(this.subscription);
      this.subscription = null;
    }
  }
}
