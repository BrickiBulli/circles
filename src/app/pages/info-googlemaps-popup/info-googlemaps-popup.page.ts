import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonItem, IonLabel, IonNote, IonButton, IonButtons, IonImg } from '@ionic/angular/standalone';
import { ModalController } from '@ionic/angular';
import { environment } from 'src/environments/environment'; 
@Component({
  selector: 'app-info-googlemaps-popup',
  templateUrl: './info-googlemaps-popup.page.html',
  styleUrls: ['./info-googlemaps-popup.page.scss'],
  standalone: true,
  imports: [IonImg, IonButtons, IonButton, IonNote, IonLabel, IonItem, IonCardContent, IonCardSubtitle, IonCardTitle, IonCardHeader, IonCard, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class InfoGooglemapsPopupPage {

  @Input() place: any; 

  constructor(
    private modalController: ModalController,
  ) {}

  dismiss() {
    this.modalController.dismiss();
  }

  getPhotoUrl(photoReference: string): string {
    const apiKey = environment.googleApiKey; 
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${apiKey}`;
  }
}
