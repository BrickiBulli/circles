import { Injectable } from '@angular/core';
import { supabase } from './supabase.service';

@Injectable({
  providedIn: 'root',
})
export class SupabaseUserService {
  // Search users by their name
  async searchUsers(query: string) {
    if (!query.trim()) return [];

    const { data, error } = await supabase
      .from('profiles') // Adjust if your user table name is different
      .select('user_name, user_id')
      .ilike('user_name', `%${query}%`); // ilike for case-insensitive partial match

    if (error) {
      console.error('Error searching users:', error);
      throw error;
    }

    return data;
  }

  async getProfilesForUserIds(userIds: string[]) {
    if (userIds.length === 0) return [];

    const { data, error } = await supabase
      .from('profiles')
      .select('user_id, user_name')
      .in('user_id', userIds);

    if (error) {
      console.error('Error fetching profiles:', error);
      throw error;
    }

    return data || [];
  }
}