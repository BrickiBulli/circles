import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonFooter, IonButton, IonInput, IonButtons, IonModal } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from 'src/app/services/chat.service';
import { supabase } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  standalone: true,
  imports: [IonModal, IonButtons, IonButton, IonFooter, IonLabel, IonItem, IonList, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, IonInput, FormsModule]
})
export class ChatPage implements OnInit {
  chatroomId!: string;
  messages: any[] = [];
  newMessage: string = '';
  userId!: string;
  chatroomName: string = '';
  private sub: any;

  constructor(
    private route: ActivatedRoute,
    private chatService: ChatService
  ) {}

  async ngOnInit() {
    this.chatroomId = this.route.snapshot.paramMap.get('id')!;

    const { data: authUser, error } = await supabase.auth.getUser();
    if (authUser?.user?.id) {
      this.userId = authUser.user.id;
    }

    await this.chatService.initChatroom(this.chatroomId);

    // Subscribe to the messages observable from the service
    this.sub = this.chatService.messages$.subscribe((messages) => {
      this.messages = messages;
    });
  }

  async loadChatroomDetails() {
    // Example query to fetch chatroom name
    const data = await this.chatService.getChatroomById(this.chatroomId)
      
    this.chatroomName = data.name; 
  }

  async sendMessage() {
    if (!this.newMessage.trim()) return;
    await this.chatService.sendMessage(this.chatroomId, this.userId, this.newMessage.trim());
    this.newMessage = '';
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
    this.chatService.cleanup();
  }
}
