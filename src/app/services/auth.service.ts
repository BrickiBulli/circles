import { BehaviorSubject, Observable } from 'rxjs';
import { supabase } from './supabase.service';
import { Injectable } from '@angular/core';
import { User } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUser = new BehaviorSubject<User | null>(null);

  private setAuthListener() {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        try {
          await this.loadUser(session.user.id);
        } catch (error: any) {
          console.error('Erro in Auth state change', error);
          this.currentUser.next(null);
        }
      } else if (!session?.user) {
        this.currentUser.next(null);
      } else if (event === 'SIGNED_OUT') {
        this.currentUser.next(null);
      }
    });
  }

  private async loadUser(userId: string): Promise<void> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('user not found');
      this.currentUser.next(user);
    } catch (error) {
      console.error('Error loading user', error);
      this.currentUser.next(null);
    }
  }

  async register(
    username: string,
    email: string,
    password: string
  ): Promise<void> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username } },
    });
    if (error) {
      throw error;
    }

    const user = data.user;
  
    if (!user) {
      throw new Error('User was not returned after signUp');
    }

    console.log('try to create profile data')
    const { error: profileError } = await supabase
    .from('profiles')
    .insert([{ user_id: user.id, user_name: username }]); 

    if (profileError) {
      console.error('Error creating profile:', profileError);
      throw profileError;
    }

  }

  async login(email: string, password: string): Promise<any> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      throw error;
    }
    return data.user;
  }

  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUser.asObservable();
  }

  async getSession() {
    return supabase.auth.getSession();
  }
}
