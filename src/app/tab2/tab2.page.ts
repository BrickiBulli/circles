import { Component } from '@angular/core';
import {IonModal, IonInput, IonButton, IonLabel, IonItem, IonContent, IonButtons, IonTitle, IonToolbar, IonHeader, IonList, IonActionSheet, IonIcon} from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { SupabaseChatroomsService } from '../services/supabase-chatrooms.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ActionSheetButton } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { ellipsisVertical, create, trash, close, exit } from 'ionicons/icons';
import { supabase } from '../services/supabase.service';
import { SupabaseMembersService } from '../services/supabase-members.service';
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [CommonModule, ExploreContainerComponent, IonModal, IonInput, IonButton, IonLabel, IonItem, IonContent, IonButtons, IonTitle, IonToolbar, IonActionSheet, IonHeader, IonList, IonIcon],
})
export class Tab2Page {
  chatrooms: any[] = [];
  isActionSheetOpen = false;
  selectedRoom: any = null;
  currentUserId: string | null = null;

  get actionSheetButtons(): ActionSheetButton[] {
    const isOwner = this.selectedRoom && this.selectedRoom.creator_user_id === this.currentUserId;

    // Base buttons that everyone gets (e.g., Cancel)
    const buttons: ActionSheetButton[] = [
      {
        text: 'Cancel',
        role: 'cancel',
        icon: 'close'
      }
    ];

    // If user is owner, add Edit and Delete buttons
    if (isOwner) {
      buttons.unshift(
        {
          text: 'Edit',
          icon: 'create',
          handler: () => {
            this.editChatroom(this.selectedRoom);
          }
        },
        {
          text: 'Delete',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            this.deleteChatroom(this.selectedRoom);
          }
        }
      );
    }else {
      // Non-owners see Leave
      buttons.unshift({
        text: 'Leave',
        icon: 'exit',
        handler: () => {
          this.leaveChatroom(this.selectedRoom);
        }
      });
    }

    return buttons;
  }
  constructor(
    private chatroomsService: SupabaseChatroomsService,
    private router: Router,
    private memberService: SupabaseMembersService,
  ) {
    addIcons({
      ellipsisVertical,
      create,
      trash,
      close,
      exit
    });
  }

  async ngOnInit() {
    const { data: authUser, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Error getting current user:', error);
    } else {
      this.currentUserId = authUser?.user.id;
    }

    this.loadChatrooms();
  }

  async loadChatrooms() {
    try {
      this.chatrooms = await this.chatroomsService.getChatrooms();
    } catch (error) {
      console.error('Failed to load chatrooms:', error);
    }
  }
  createChatroom(){
    this.router.navigate(['/create-chatroom']);
  }
  openChatroom(id: string) {
    this.router.navigate(['/chat', id]);
  }

  editChatroom(room: any) {
    this.router.navigate(['/edit-chatroom', room.id]);
  }

  deleteChatroom(room: any) {
    this.chatroomsService.deleteChatroom(room.id)
  }

  presentActionSheet(event: Event, room: any) {
    event.preventDefault();
    this.selectedRoom = room;
    this.isActionSheetOpen = true;
  }

  async leaveChatroom(room: any) {
    if (!this.currentUserId) {
      console.error('No current user ID found, cannot leave chatroom.');
      return;
    }
  
    try {
      await this.memberService.removeMemberFromChat(room.id, this.currentUserId);
      // Optionally reload chatrooms or update UI after leaving
      await this.loadChatrooms();
      alert('You have left the chatroom');
    } catch (error) {
      console.error('Error leaving chatroom:', error);
      alert('Failed to leave chatroom, please try again later.');
    }
  }
}
