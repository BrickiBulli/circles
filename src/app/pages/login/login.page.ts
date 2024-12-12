import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol,
  IonItem,
  IonLabel,
  IonButton,
  IonInput, IonList, IonIcon, IonText,
  ToastController } from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router'; // Import Router
import { addIcons } from 'ionicons';
import { lockClosedOutline, logInOutline, mailOutline, personAddOutline } from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonText, IonIcon, IonList, 
    IonButton,
    IonLabel,
    IonItem,
    IonCol,
    IonRow,
    IonGrid,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonInput,
  ],
})
export class LoginPage {
  email: string = '';
  password: string = '';

  private authService = new AuthService();

  constructor(private router: Router,  private toastController: ToastController) {
    addIcons({mailOutline,lockClosedOutline,logInOutline,personAddOutline});
  }

  async login() {
    try {
      const user = await this.authService.login(this.email, this.password);
      this.presentToast('Login successful!', 'success'); // Show success toast
      console.log('User:', user);
      await this.router.navigate(['/tabs/tab2']);
    } catch (error) {
      const err = error as Error;
      console.error('Login error:', err.message);
      this.presentToast('Login failed. Please check your credentials.', 'danger'); // Show error toast
    }
  }

  async goToRegister(){
    await this.router.navigate(['/register']);
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
