import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastController, IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonLabel, IonItem, IonList, IonInput, IonCard, IonCardHeader, IonCardTitle, IonCheckbox, IonButton, IonCardSubtitle, IonCardContent, IonIcon, IonItemSliding, IonItemOptions, IonItemOption, IonText } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { SupabaseUserService } from 'src/app/services/supabase-profile.service';
import { SupabaseMembersService } from 'src/app/services/supabase-members.service';
import { supabase } from 'src/app/services/supabase.service';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { addCircleOutline, peopleOutline, personAddOutline, removeCircle, removeCircleOutline, searchOutline, trashOutline, chatbubbleOutline } from 'ionicons/icons';
@Component({
  selector: 'app-add-users',
  templateUrl: './add-users.page.html',
  styleUrls: ['./add-users.page.scss'],
  standalone: true,
  imports: [IonText, IonItemOption, IonItemOptions, IonItemSliding, IonIcon, IonCardContent, IonCardSubtitle, IonButton, IonCheckbox, IonCardTitle, IonCardHeader, IonCard, IonList, IonItem, IonLabel, IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonInput]
})
export class AddUsersPage {
  chatroomId!: string;
  searchQuery: string = '';
  searchResults: any[] = [];
  existingMembers: any[] = []; // Will hold current members (excluding owner)
  selectedUsers: string[] = []; // Track selected user IDs for adding
  selectedMembersToRemove: string[] = []; // Track selected member IDs for removal

  currentUserId?: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: SupabaseUserService,
    private membersService: SupabaseMembersService,
    private toastController: ToastController,
  ) {
    addIcons({peopleOutline,trashOutline,removeCircleOutline,searchOutline,personAddOutline,addCircleOutline,chatbubbleOutline});

  }

  async ngOnInit() {

    this.chatroomId = this.route.snapshot.paramMap.get('id')!;

    // Get current user
    const { data: authUser, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Error getting current user:', error);
    } else {
      this.currentUserId = authUser?.user.id;
    }

    await this.loadExistingMembers();
  }

  async loadExistingMembers() {
    try {
      const allMembers = await this.membersService.getMembersWithUsernames(this.chatroomId);
  
      // Filter out current user
      this.existingMembers = allMembers.filter(m => m.user_id !== this.currentUserId);
    } catch (err) {
      console.error('Error loading existing members:', err);
    }
  }

  async searchUsers() {
    try {
      // If query is empty, clear results
      if (!this.searchQuery.trim()) {
        this.searchResults = [];
        return;
      }

      // Search for users by query
      const results = await this.userService.searchUsers(this.searchQuery);

      // Filter out users already in the chat (including owner)
      const filteredResults = results.filter(u => 
        u.user_id !== this.currentUserId && 
        !this.existingMembers.some(member => member.user_id === u.user_id)
      );

      this.searchResults = filteredResults;
    } catch (error) {
      console.error('Error searching users:', error);
    }
  }

  toggleUserSelection(userId: string, event: any) {
    if (event.detail.checked) {
      // Add user to selected array if not already present
      if (!this.selectedUsers.includes(userId)) {
        this.selectedUsers.push(userId);
      }
    } else {
      // Remove user from selected array if unchecked
      this.selectedUsers = this.selectedUsers.filter(id => id !== userId);
    }
  }

  async addSelectedUsersToChat() {
    try {
      // Add each selected user to the chat
      for (const userId of this.selectedUsers) {
        await this.membersService.addMemberToChat(this.chatroomId, userId);
      }

      this.presentToast('Users added successfully!', 'success');

      // After adding, reload members and clear search
      await this.loadExistingMembers();
      this.searchResults = [];
      this.selectedUsers = [];
      this.searchQuery = '';
    } catch (error) {
      console.error('Error adding selected users:', error);
      this.presentToast('Failed to add selected users. Please try again.','danger');
    }
  }

  toggleMemberRemovalSelection(userId: string, event: any) {
    if (event.detail.checked) {
      // Add member to the removal list if not already present
      if (!this.selectedMembersToRemove.includes(userId)) {
        this.selectedMembersToRemove.push(userId);
      }
    } else {
      // Remove member from the removal list if unchecked
      this.selectedMembersToRemove = this.selectedMembersToRemove.filter(id => id !== userId);
    }
  }

  async removeSelectedMembers() {
    try {
      // Remove each selected member from the chat
      for (const userId of this.selectedMembersToRemove) {
        await this.membersService.removeMemberFromChat(this.chatroomId, userId);
      }

      this.presentToast('Selected members removed successfully!', 'danger');

      // After removal, reload members and clear the removal list
      await this.loadExistingMembers();
      this.selectedMembersToRemove = [];
    } catch (error) {
      console.error('Error removing selected members:', error);
      this.presentToast('Failed to remove selected members. Please try again.', 'danger');
    }
  }

  goToChatroom() {
    this.router.navigate(['/chat', this.chatroomId]);
  }

  goToChatrooms() {
    this.router.navigate(['/tabs/tab2']);
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
