import { Injectable } from '@angular/core';
import { supabase } from './supabase.service';
import { SupabaseMembersService } from './supabase-members.service';

@Injectable({
  providedIn: 'root',
})
export class SupabaseChatroomsService {

  constructor(
    private memberService: SupabaseMembersService
  ) {}

  async getChatrooms() {

    // Get the current user
    const { data: user, error: userError } = await supabase.auth.getUser();

    if (userError) {
      console.error('Error retrieving user:', userError);
      throw userError;
    }

    const userId = user?.user.id; // Extract the user ID

    if (!userId) {
      throw new Error('User is not logged in');
    }
      // Fetch chatrooms where the user is a member
      const { data: chatrooms, error: chatroomsError } = await supabase
      .from('members')
      .select('chatroom:chatroom_id(name, id, creator_user_id)')
      .eq('user_id', userId);

      if (chatroomsError) {
      console.error('Error fetching chatrooms:', chatroomsError);
      throw chatroomsError;
    }

    // Extract and return the chatroom details
    return chatrooms.map((member) => member.chatroom);
  }

async createChatroom(name: string) {
  // Get the current user
  const { data: user, error: userError } = await supabase.auth.getUser();

  if (userError) {
    console.error('Error retrieving user:', userError);
    throw userError;
  }

  const creatorUserId = user?.user.id; // Extract the user ID

  if (!creatorUserId) {
    throw new Error('User is not logged in');
  }

  // Insert the chatroom with the creator_user_id
  const { data: chatroom, error } = await supabase
    .from('chatroom')
    .insert([{ name, creator_user_id: creatorUserId }])
    .select('id')
    .single();

  if (error) {
    console.error('Error creating chatroom:', error);
    throw error;
  }

  await this.memberService.addMemberToChat(chatroom.id, creatorUserId)

  return chatroom;
}

async deleteChatroom(chatroomId: string) {
  const { error } = await supabase
    .from('chatroom')
    .delete()
    .eq('id', chatroomId);

  if (error) {
    console.error('Error deleting chatroom:', error);
    throw error;
  }
}

async getChatroomDetails(chatroomId: string) {
  const { data, error } = await supabase
    .from('chatroom')
    .select('name')
    .eq('id', chatroomId)
    .single();

  if (error) {
    console.error('Error loading chatroom:', error);
    throw error;
  }

  return data; // { name: string }
}

async updateChatroomName(chatroomId: string, newName: string) {
  const { error } = await supabase
    .from('chatroom')
    .update({ name: newName })
    .eq('id', chatroomId);

  if (error) {
    console.error('Error updating chatroom:', error);
    throw error;
  }
}
}
