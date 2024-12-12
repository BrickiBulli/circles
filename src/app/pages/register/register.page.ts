import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonButton,
  IonInput, IonIcon, IonList, IonRefresherContent, IonRefresher, IonButtons, IonText, ToastController } from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { lockClosedOutline, mailOutline, personAddOutline, personCircleOutline, logInOutline } from 'ionicons/icons';
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonText, IonButtons, IonRefresher, IonRefresherContent, IonList, IonIcon, 
    IonButton,
    IonLabel,
    IonItem,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonInput,
    
  ],
})
export class RegisterPage {
  email: string = '';
  password: string = '';
  username: string = '';

  constructor(private authService: AuthService, private router: Router, private toastController: ToastController) {
    addIcons({personAddOutline,logInOutline,personCircleOutline,mailOutline,lockClosedOutline});
  }

  async register() {
    console.log("start register")
    if (
      this.email.length <= 5 ||
      this.username.length <= 3 ||
      this.password.length < 6
    ) {
      // display toast
      return;
    }
    try {
      console.log('Attempting registration with:', this.email, this.password);
      await this.authService.register(this.username, this.email, this.password);
      this.presentToast('Registration successful!', 'success');
      this.email = '';
      this.password = '';
      await this.router.navigate(['/tabs/tab2']);
    } catch (error) {
      console.error('Registration error:', (error as Error)?.message || error);
      this.presentToast('Registration failed. Please try again.', 'danger');
    }
  }
  async goToLogin(){
    await this.router.navigate(['/login']);
  }

  private async presentToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastController.create({
      message,
      duration: 3000, // Toast will auto-dismiss after 3 seconds
      color,
      position: 'top', // Position of the toast (top, middle, bottom)
    });
    await toast.present();
  }
}
