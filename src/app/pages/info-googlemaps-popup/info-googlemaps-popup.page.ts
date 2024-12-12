import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastController, IonContent, IonSelect, IonSelectOption, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonItem, IonLabel, IonNote, IonButton, IonButtons, IonImg, IonIcon } from '@ionic/angular/standalone';
import { ModalController } from '@ionic/angular';
import { environment } from 'src/environments/environment'; 
import { addIcons } from 'ionicons';
import { star, starHalf, starOutline } from 'ionicons/icons';
import { supabase } from 'src/app/services/supabase.service';
import { SupabaseChatroomsService } from 'src/app/services/supabase-chatrooms.service';
import { ChatService } from 'src/app/services/chat.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-info-googlemaps-popup',
  templateUrl: './info-googlemaps-popup.page.html',
  styleUrls: ['./info-googlemaps-popup.page.scss'],
  standalone: true,
  imports: [IonImg, IonButtons, IonButton, IonNote, IonLabel, IonItem, IonCardContent, IonCardSubtitle, IonCardTitle, IonCardHeader, IonCard, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonIcon, IonSelect, IonSelectOption]
})
export class InfoGooglemapsPopupPage {

  @Input() place: any; 

  fullStars: number[] = [];
  emptyStars: number[] = [];
  hasHalfStar: boolean = false;
  chatrooms: any[] = []; 
  selectedChatroomId: string | null = null;
  currentUserId: string | null = null;
  constructor(
    private modalController: ModalController,
    private chatroomsService: SupabaseChatroomsService,
    private chatService: ChatService,
    private toastController: ToastController,
    private router: Router
  ) {
    addIcons({
      star,
      starHalf,
      starOutline
    });
  }

  async ngOnInit() {

    const { data: authUser, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Error getting current user:', error);
    } else {
      this.currentUserId = authUser?.user.id;
    }

    await this.loadUserChatrooms();

    if (this.place?.rating) {
      const rating = this.place.rating;
      const fullStarCount = Math.floor(rating);
      this.hasHalfStar = rating % 1 >= 0.5;
      const emptyStarCount = 5 - fullStarCount - (this.hasHalfStar ? 1 : 0);

      // Create arrays for rendering
      this.fullStars = Array(fullStarCount).fill(0);
      this.emptyStars = Array(emptyStarCount).fill(0);
    }
  }

  dismiss() {
    this.modalController.dismiss();
  }

  getPhotoUrl(photoReference: string): string {
    const apiKey = environment.googleApiKey; 
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${apiKey}`;
  }

  async sendToChat() {
      if (!this.selectedChatroomId) {
        alert('Please select a chatroom');
        return;
      }
  
      try {
        await this.chatService.createProposalMessage(
          this.selectedChatroomId,
          this.place
        );
        this.presentToast('Proposal sent to chat!', 'success');
        this.dismiss();
        this.router.navigate(['/chat', this.selectedChatroomId])
      } catch (error) {
        console.error('Error sending proposal:', error);
        this.presentToast('Failed to send proposal.', 'danger');
      }
    }

  async loadUserChatrooms() {
    try {
      this.chatrooms = await this.chatroomsService.getChatrooms();
    } catch (error) {
      console.error('Error loading chatrooms:', error);
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
