import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToastController, IonModal, IonInput, IonButton, IonLabel, IonItem, IonContent, IonButtons, IonTitle, IonToolbar, IonHeader, IonList, IonActionSheet, IonIcon, IonItemOption, IonItemOptions, IonItemSliding, IonRefresherContent, IonRefresher } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { SupabaseChatroomsService } from '../services/supabase-chatrooms.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ActionSheetButton } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { ellipsisVertical, create, trash, close, exit, chatbubblesOutline, addOutline, chatboxEllipsesOutline, createOutline, trashOutline } from 'ionicons/icons';
import { supabase } from '../services/supabase.service';
import { SupabaseMembersService } from '../services/supabase-members.service';
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonRefresher, IonRefresherContent, IonItemSliding, IonItemOptions, IonItemOption, CommonModule, ExploreContainerComponent, IonModal, IonInput, IonButton, IonLabel, IonItem, IonContent, IonButtons, IonTitle, IonToolbar, IonActionSheet, IonHeader, IonList, IonIcon],
})
export class Tab2Page implements OnInit, OnDestroy {
  private subscription: any;
  chatrooms: any[] = [];
  isActionSheetOpen = false;
  selectedRoom: any = null;
  currentUserId: string | null = null;

  get actionSheetButtons(): ActionSheetButton[] {
    const isOwner = this.selectedRoom && this.selectedRoom.creator_user_id === this.currentUserId;

    const buttons: ActionSheetButton[] = [
      {
        text: 'Cancel',
        role: 'cancel',
        icon: 'close'
      }
    ];

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
    private toastController: ToastController,

  ) {
    addIcons({
      chatbubblesOutline,
      addOutline,
      chatboxEllipsesOutline,
      ellipsisVertical,
      createOutline,
      trashOutline,
      create,
      trash,
      close,
      exit,
    });
  }

  async ngOnInit() {
    const { data: authUser, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Error getting current user:', error);
    } else {
      this.currentUserId = authUser?.user.id;
    }

    this.chatroomsService.initializeChatrooms();

    this.subscription = this.chatroomsService.chatrooms$.subscribe((chatrooms) => {
      this.chatrooms = chatrooms;
      console.log(chatrooms)
    });
  }

  // Refresh chatrooms data whenever the page is about to enter
  async ionViewWillEnter() {
    console.log("wfasdasd")
    await this.loadChatrooms();
  }

  async loadChatrooms() {
    try {
      this.chatrooms = await this.chatroomsService.getChatrooms();
    } catch (error) {
      console.error('Failed to load chatrooms:', error);
    }
  }

  async createChatroom() {
    this.router.navigate(['/create-chatroom']);
    await this.loadChatrooms();
  }

  openChatroom(id: string) {
    this.router.navigate(['/chat', id]);
  }

  editChatroom(room: any) {
    this.router.navigate(['/edit-chatroom', room.id]);
  }

  async deleteChatroom(room: any) {
    try {
      await this.chatroomsService.deleteChatroom(room.id);
      await this.loadChatrooms();
    } catch (error) {
      console.error('Failed to delete chatroom:', error);
    }
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
      await this.loadChatrooms();
      this.presentToast('You have left the chatroom', 'success');
    } catch (error) {
      console.error('Error leaving chatroom:', error);
      this.presentToast('Failed to leave chatroom, please try again later.', 'danger');
    }
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

  ngOnDestroy() {
    // Clean up the subscription
    this.subscription.unsubscribe();
    this.chatroomsService.unsubscribe();
  }
}
