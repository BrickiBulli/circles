import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SupabaseMembersService } from 'src/app/services/supabase-members.service';
import { IonInput, IonButton, IonLabel, IonItem, IonContent, IonButtons, IonTitle, IonToolbar, IonHeader, IonList, IonActionSheet, IonIcon, IonCardTitle, IonCardHeader, IonCard, IonCardContent, IonBackButton } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseChatroomsService } from 'src/app/services/supabase-chatrooms.service';
@Component({
  selector: 'app-edit-chatroom',
  templateUrl: './edit-chatroom.page.html',
  styleUrls: ['./edit-chatroom.page.scss'],
  standalone: true,
  imports: [IonBackButton, IonCardContent, IonCard, IonCardHeader, IonCardTitle, CommonModule, IonInput, IonButton, IonLabel, IonItem, IonContent, IonButtons, IonTitle, IonToolbar, IonHeader, IonList, FormsModule],
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
  ) {}

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
      alert('Failed to load chatroom details.');
    }
  }

  async loadMembers() {
    try {
      this.members = await this.memberService.getMembersWithUsernames(this.chatroomId);
    } catch (error) {
      console.error('Error loading members:', error);
      alert('Failed to load members.');
    }
  }

  async updateChatroom() {
    if (!this.chatroomName.trim()) {
      alert('Chatroom name cannot be empty');
      return;
    }

    try {
      await this.chatroomsService.updateChatroomName(this.chatroomId, this.chatroomName);
      alert('Chatroom updated!');
    } catch (error) {
      alert('Failed to update chatroom');
    }
  }

  async removeMember(userId: string) {
    try {
      await this.memberService.removeMemberFromChat(this.chatroomId, userId);
      await this.loadMembers();
    } catch (error) {
      console.error('Error removing member:', error);
      alert('Failed to remove member.');
    }
  }

  goToAddUsers() {
    this.router.navigate(['/add-users', this.chatroomId]);
  }
}