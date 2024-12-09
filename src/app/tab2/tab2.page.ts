import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon, IonList, IonItem, IonLabel } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { supabase } from '../services/supabase.service'; 
import { IonicModule } from '@ionic/angular'; // Import IonicModule

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonLabel, IonItem, IonList, IonIcon, IonButton, IonButtons, IonHeader, IonToolbar, IonTitle, IonContent, IonicModule, ExploreContainerComponent]
})
export class Tab2Page {

  chatrooms: any[] = [];

  constructor() {}

  ngOnInit() {
    this.loadChatrooms();
  }

  // Function to load chatrooms from Supabase
  async loadChatrooms() {
    const { data, error } = await supabase
      .from('chatroom') // Your chatrooms table
      .select('*');

    if (error) {
      console.error('Error loading chatrooms:', error);
    } else {
      this.chatrooms = data;
    }
  }

  // Function to create a new chatroom
  async createChatroom(name: string) {
    const { data, error } = await supabase
      .from('chatrooms') // Your chatrooms table
      .insert([{ name }]);

    if (error) {
      console.error('Error creating chatroom:', error);
    } else {
      this.chatrooms.push(data![0]);
    }
  }

}
