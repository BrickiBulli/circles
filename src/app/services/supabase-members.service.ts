import { Injectable } from '@angular/core';
import { supabase } from './supabase.service';
import { SupabaseUserService } from './supabase-profile.service';
@Injectable({
  providedIn: 'root'
})
export class SupabaseMembersService {

  constructor(private userService: SupabaseUserService) {}

  // Add a user to a chatroom
  async addMemberToChat(chatroomId: string, userId: string) {
    const { error } = await supabase
      .from('members')
      .insert([{ chatroom_id: chatroomId, user_id: userId }]);

    if (error) {
      console.error('Error adding member:', error);
      throw error;
    }
  }

  // Remove a user from a chatroom
  async removeMemberFromChat(chatroomId: string, userId: string) {
    const { error } = await supabase
      .from('members')
      .delete()
      .eq('chatroom_id', chatroomId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error removing member:', error);
      throw error;
    }
  }

  // Optional: get members of a chatroom
  async getMembers(chatroomId: string) {
    const { data, error } = await supabase
      .from('members')
      .select('user_id')
      .eq('chatroom_id', chatroomId);

    if (error) {
      console.error('Error retrieving members:', error);
      throw error;
    }

    return data;
  }

  async getMembersWithUsernames(chatroomId: string) {

    // First get the bare members (just user_ids)
    const members = await this.getMembers(chatroomId);
    if (members.length === 0) return [];

    // Extract user_ids to fetch profiles
    const userIds = members.map(m => m.user_id);
    // Get profiles for these user_ids
    const profiles = await this.userService.getProfilesForUserIds(userIds);

    // Merge profile info into the members array
    const membersWithNames = members.map(member => {
      const profile = profiles.find(p => p.user_id === member.user_id);
      return {
        ...member,
        user_name: profile?.user_name || 'Unknown'
      };
    });

    return membersWithNames;
  }
}
