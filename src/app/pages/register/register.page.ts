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
  IonInput,
} from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
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

  constructor(private authService: AuthService, private router: Router) {}

  async register() {
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
      alert('Registration successful!');
      this.email = '';
      this.password = '';
      await this.router.navigate(['/tabs/tab1']);
    } catch (error) {
      console.error('Registration error:', (error as Error)?.message || error);
      alert('Registration failed. Please try again.');
    }
  }
}
