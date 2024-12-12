import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonThumbnail, IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonFooter, IonButton, IonInput, IonButtons, IonModal, IonImg, IonIcon } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from 'src/app/services/chat.service';
import { supabase } from 'src/app/services/supabase.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  standalone: true,
  imports: [IonCard, IonCardHeader, IonCardTitle, IonCardContent , IonThumbnail , IonIcon, IonImg, IonModal, IonButtons, IonButton, IonFooter, IonLabel, IonItem, IonList, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, IonInput, FormsModule]
})
export class ChatPage implements OnInit {
  chatroomId!: string;
  messages: any[] = [];
  newMessage: string = '';
  userId!: string;
  chatroomName: string = '';
  private sub: any;

  constructor(
    private route: ActivatedRoute,
    private chatService: ChatService
  ) {}

  async ngOnInit() {
    this.chatroomId = this.route.snapshot.paramMap.get('id')!;

    const { data: authUser, error } = await supabase.auth.getUser();
    if (authUser?.user?.id) {
      this.userId = authUser.user.id;
    }

    await this.chatService.initChatroom(this.chatroomId);

    // Subscribe to the messages observable from the service
    this.sub = this.chatService.messages$.subscribe((messages) => {
      this.messages = messages;
      console.log(messages)
    });
    this.loadChatroomDetails();
  }

  async loadChatroomDetails() {
    // Example query to fetch chatroom name
    const data = await this.chatService.getChatroomById(this.chatroomId)
      
    this.chatroomName = data.name; 
  }

  async sendMessage() {
    if (!this.newMessage.trim()) return;
    await this.chatService.sendMessage(this.chatroomId, this.userId, this.newMessage.trim());
    this.newMessage = '';
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
    this.chatService.cleanup();
  }

  async takePhoto() {
    const image = await Camera.getPhoto({
      quality: 90,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera
    });
  
    if (image && image.base64String) {
      // Convert the base64 string to a Blob for uploading
      const blob = this.base64ToBlob(image.base64String, `image/${image.format}`);
      
      // Upload the blob to Supabase Storage
      const imageUrl = await this.uploadImage(blob);
      
      // Send the image URL as a message
      await this.chatService.sendMessage(this.chatroomId, this.userId, '', imageUrl);
    }
  }
  
  base64ToBlob(base64: string, type: string) {
    const byteCharacters = atob(base64);
    const byteNumbers = Array.from(byteCharacters, c => c.charCodeAt(0));
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type });
  }
  
  async uploadImage(file: Blob): Promise<string> {
    const fileName = `images/${Date.now()}.jpg`; // or use another unique naming strategy
    const { data, error } = await supabase.storage.from('chat-images').upload(fileName, file, {
      contentType: 'image/jpeg'
    });
  
    if (error) {
      console.error('Error uploading image:', error);
      throw error;
    }


    // Generate a public URL (make sure your bucket is public or use signed URLs)
    const urlData: {data:{
      publicUrl: string
    }} = supabase.storage.from('chat-images').getPublicUrl(fileName);
    console.log(urlData.data.publicUrl)
    return  urlData.data.publicUrl || '';
  }
  
  getPhotoUrl(photoReference: string): string {
    const apiKey = environment.googleApiKey; 
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${apiKey}`;
  }
   
}
