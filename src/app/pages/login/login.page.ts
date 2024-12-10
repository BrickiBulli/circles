import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonGrid, IonRow, IonCol, IonItem, IonLabel, IonButton } from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth-utils.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonButton, IonLabel, IonItem, IonCol, IonRow, IonGrid, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class LoginPage {
  email: string = '';
  password: string = '';

  private authService = new AuthService();

  async login() {
    try {
      const user = await this.authService.login(this.email, this.password);
      alert('Login successful!');
      console.log('User:', user);
    } catch (error) {
      const err = error as Error;
      console.error('Login error:', err.message);
      alert('Login failed. Please check your credentials.');
    }
  }
}