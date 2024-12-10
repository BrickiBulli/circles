import { supabase } from '../services/supabase.service';
import * as bcrypt from 'bcryptjs';

export class AuthService {
  /**
   * Registers a new user.
   * @param email - The user's email.
   * @param password - The user's password.
   * @returns The newly created user data or throws an error.
   */
  async register(user_email: string, password: string): Promise<any> {
    // Hash the password before saving
    const hashedPassword = await this.hashPassword(password);

    // Insert user into the database
    const { data, error } = await supabase
      .from('user')
      .insert([{ user_email: user_email, user_password: hashedPassword }]);

    if (error) {
      throw new Error(error.message);
    }
    return data;
  }

  /**
   * Logs in a user.
   * @param email - The user's email.
   * @param password - The user's password.
   * @returns The logged-in user data or throws an error.
   */
  async login(email: string, password: string): Promise<any> {
    // Fetch user by email
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !data) {
      throw new Error('User not found');
    }

    // Verify password
    const isValid = await this.verifyPassword(password, data.password);
    if (!isValid) {
      throw new Error('Invalid password');
    }

    return data; // Return user data
  }

  /**
   * Hashes a password.
   * @param password - The plain text password.
   * @returns The hashed password.
   */
  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  /**
   * Verifies a password against its hash.
   * @param password - The plain text password.
   * @param hash - The hashed password.
   * @returns True if the password is valid, otherwise false.
   */
  private async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}