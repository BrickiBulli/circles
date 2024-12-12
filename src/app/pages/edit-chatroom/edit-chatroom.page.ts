import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SupabaseMembersService } from 'src/app/services/supabase-members.service';
import { 
  IonInput, 
  IonButton, 
  IonLabel, 
  IonItem, 
  IonContent, 
  IonButtons, 
  IonTitle, 
  IonToolbar, 
  IonHeader, 
  IonList, 
  IonIcon, 
  IonCardTitle, 
  IonCardHeader, 
  IonCard, 
  IonCardContent, 
  IonBackButton,
  ToastController, IonText } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseChatroomsService } from 'src/app/services/supabase-chatrooms.service';
import { addIcons } from 'ionicons';
import { chatbubbleOutline, peopleOutline, personOutline, saveOutline } from 'ionicons/icons';

@Component({
  selector: 'app-edit-chatroom',
  templateUrl: './edit-chatroom.page.html',
  styleUrls: ['./edit-chatroom.page.scss'],
  standalone: true,
  imports: [IonText, 
    IonBackButton, 
    IonCardContent, 
    IonCard, 
    IonCardHeader, 
    IonCardTitle, 
    IonIcon,
    CommonModule, 
    IonInput, 
    IonButton, 
    IonLabel, 
    IonItem, 
    IonContent, 
    IonButtons, 
    IonTitle, 
    IonToolbar, 
    IonHeader, 
    IonList, 
    FormsModule
  ],
})
export class EditChatroomPage implements OnInit {
  chatroomId!: string;
  chatroomName: string = '';
  members: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private chatroomsService: SupabaseChatroomsService,
    private memberService: SupabaseMembersService,
    private toastController: ToastController
  ) {
    addIcons({chatbubbleOutline, saveOutline, personOutline, peopleOutline});  
  }

  async ngOnInit() {
    this.chatroomId = this.route.snapshot.paramMap.get('id')!;
    await this.loadChatroomDetails();
    await this.loadMembers();
  }

  async loadChatroomDetails() {
    try {
      const data = await this.chatroomsService.getChatroomDetails(this.chatroomId);
      this.chatroomName = data.name;
    } catch (error) {
      this.presentToast('Failed to load chatroom details.', 'danger');
    }
  }

  async loadMembers() {
    try {
      this.members = await this.memberService.getMembersWithUsernames(this.chatroomId);
    } catch (error) {
      console.error('Error loading members:', error);
      this.presentToast('Failed to load members.', 'danger');
    }
  }

  async updateChatroom() {
    console.log(this.chatroomName)
    if (!this.chatroomName.trim()) {
      this.presentToast('Chatroom name cannot be empty', 'danger');
      return;
    }

    try {
      await this.chatroomsService.updateChatroomName(this.chatroomId, this.chatroomName);
      this.presentToast('Chatroom updated!', 'success');
    } catch (error) {
      this.presentToast('Failed to update chatroom', 'danger');
    }
  }

  async removeMember(userId: string) {
    try {
      await this.memberService.removeMemberFromChat(this.chatroomId, userId);
      await this.loadMembers();
    } catch (error) {
      console.error('Error removing member:', error);
      this.presentToast('Failed to remove member.', 'danger');
    }
  }

  goToAddUsers() {
    this.router.navigate(['/add-users', this.chatroomId]);
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