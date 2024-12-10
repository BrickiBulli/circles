import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonItem, IonLabel, IonNote, IonButton, IonButtons, IonImg, IonIcon } from '@ionic/angular/standalone';
import { ModalController } from '@ionic/angular';
import { environment } from 'src/environments/environment'; 
import { addIcons } from 'ionicons';
import { star, starHalf, starOutline } from 'ionicons/icons';

@Component({
  selector: 'app-info-googlemaps-popup',
  templateUrl: './info-googlemaps-popup.page.html',
  styleUrls: ['./info-googlemaps-popup.page.scss'],
  standalone: true,
  imports: [IonImg, IonButtons, IonButton, IonNote, IonLabel, IonItem, IonCardContent, IonCardSubtitle, IonCardTitle, IonCardHeader, IonCard, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonIcon]
})
export class InfoGooglemapsPopupPage {

  @Input() place: any; 

  fullStars: number[] = [];
  emptyStars: number[] = [];
  hasHalfStar: boolean = false;

  constructor(
    private modalController: ModalController,
  ) {
    addIcons({
      star,
      starHalf,
      starOutline
    });
  }

  ngOnInit() {
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
}
