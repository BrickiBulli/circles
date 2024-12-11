import { Component } from '@angular/core';
import {} from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { IonicModule } from '@ionic/angular'; // Import IonicModule
import { SupabaseChatroomsService } from '../services/supabase-chatrooms.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, ExploreContainerComponent],
})
export class Tab2Page {
  chatrooms: any[] = [];

  constructor(
    private chatroomsService: SupabaseChatroomsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadChatrooms();
  }

  async loadChatrooms() {
    try {
      this.chatrooms = await this.chatroomsService.getChatrooms();
    } catch (error) {
      console.error('Failed to load chatrooms:', error);
    }
  }

  openChatroom(id: string) {
    this.router.navigate(['/chatroom', id]);
  }
}
