import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonLabel, 
  IonItem, 
  IonList, 
  IonButtons, 
  IonButton, 
  IonBackButton, 
  IonInput,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonIcon,
  IonTextarea, IonItemSliding, ToastController } from '@ionic/angular/standalone';
import { SupabaseChatroomsService } from 'src/app/services/supabase-chatrooms.service';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { chatbubbleOutline, informationCircleOutline, addOutline } from 'ionicons/icons';
@Component({
  selector: 'app-create-chatroom',
  templateUrl: './create-chatroom.page.html',
  styleUrls: ['./create-chatroom.page.scss'],
  standalone: true,
  imports: [IonItemSliding, 
    IonBackButton, 
    IonButton, 
    IonButtons, 
    IonList, 
    IonItem, 
    IonLabel, 
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    CommonModule, 
    FormsModule, 
    IonInput,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonIcon,
    IonTextarea
  ]
})
export class CreateChatroomPage {
  chatroomName: string = '';
  chatroomDescription: string = '';

  constructor(
    private chatroomsService: SupabaseChatroomsService,
    private router: Router,
    private toastController: ToastController
  ) {
    addIcons({chatbubbleOutline,informationCircleOutline,addOutline});
  }

  async createChatroom() {
    console.log(this.chatroomName)
    if (!this.chatroomName.trim()) {
      this.presentToast('Chatroom name cannot be empty', 'danger');
      return;
    }

    try {
      const chatroom = await this.chatroomsService.createChatroom(
        this.chatroomName, 
        this.chatroomDescription
      );
      
      this.presentToast('Chatroom created successfully!', 'success');
      
      this.router.navigate(['/add-users', chatroom.id]);
    } catch (error) {
      console.error('Error creating chatroom:', error);
      
      this.presentToast('Failed to create chatroom. Please try again.', 'danger');
    }
  }
  private async presentToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'top', 
    });
    await toast.present();
  }
}