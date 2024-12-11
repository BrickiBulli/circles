import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseChatroomsService } from 'src/app/services/supabase-chatrooms.service';
import { Router } from '@angular/router';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonLabel, IonItem, IonList, IonButtons, IonButton, IonBackButton, IonInput } from '@ionic/angular/standalone';

@Component({
  selector: 'app-create-chatroom',
  templateUrl: './create-chatroom.page.html',
  styleUrls: ['./create-chatroom.page.scss'],
  standalone: true,
  imports: [IonBackButton, IonButton, IonButtons, IonList, IonItem, IonLabel, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonInput]
})
export class CreateChatroomPage{
  chatroomName: string = '';

  constructor(
    private chatroomsService: SupabaseChatroomsService,
    private router: Router
  ) {}

  async createChatroom() {
    if (!this.chatroomName.trim()) {
      alert('Chatroom name cannot be empty');
      return;
    }

    try {
      const chatroom = await this.chatroomsService.createChatroom(this.chatroomName);
      alert('Chatroom created successfully!');
      this.router.navigate(['/add-users', chatroom.id]); // Navigate back to the chatrooms page
    } catch (error) {
      console.error('Error creating chatroom:', error);
      alert('Failed to create chatroom. Please try again.');
    }
  }
}
