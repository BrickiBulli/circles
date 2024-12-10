import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonButton } from '@ionic/angular/standalone';
import { AuthService } from 'src/app/services/auth-utils.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonButton, IonLabel, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class RegisterPage {
  email: string = '';
  password: string = '';

  private authService = new AuthService();

  async register(event: Event) {
    console.log("registered")
    event.preventDefault(); // Prevent page reload on form submission
    try {
      await this.authService.register(this.email, this.password);
      alert('Registration successful!');
      this.email = '';
      this.password = '';
    } catch (error) {
      const err = error as Error;
      console.error('Registration error:', err?.message || error);
      alert('Registration failed. Please try again.');
    }
  }
}