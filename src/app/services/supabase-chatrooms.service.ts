import { Injectable } from '@angular/core';
import { supabase } from './supabase.service';

@Injectable({
  providedIn: 'root',
})
export class SupabaseChatroomsService {
  async getChatrooms() {
    const { data, error } = await supabase.from('chatroom').select('*');

    if (error) {
      console.error('Error fetching chatrooms:', error);
      throw error;
    }

    return data;
  }
}
