
import { supabase } from '@/integrations/supabase/client';
import { UserInfo } from '@/components/users/UserCard';
import { v4 as uuidv4 } from 'uuid';

// Type for creating a new user
export type UserCreate = {
  name: string;
  email: string;
  phone?: string | null;
};

export const getAllUsers = async (): Promise<UserInfo[]> => {
  try {
    // Get all users from the database
    const { data: users, error } = await supabase
      .from('users')
      .select('*');
    
    if (error) throw error;

    // For each user, count the number of active loans (books checked out)
    const usersWithLoans = await Promise.all(users.map(async (user) => {
      const { count, error: loanError } = await supabase
        .from('loans')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .is('return_date', null)
        .eq('status', 'active');
      
      if (loanError) {
        console.error('Error fetching loans for user:', loanError);
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          membershipStartDate: user.membership_start ? new Date(user.membership_start) : new Date(),
          booksCheckedOut: 0,
          status: 'active' as const
        };
      }

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        membershipStartDate: user.membership_start ? new Date(user.membership_start) : new Date(),
        booksCheckedOut: count || 0,
        status: count && count > 0 ? 'active' as const : 'inactive' as const
      };
    }));

    return usersWithLoans;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const addUser = async (user: UserCreate): Promise<UserInfo> => {
  try {
    console.log('UserService: Adding user with data:', user);
    
    // First, check if user with this email already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('*')
      .eq('email', user.email)
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = not found, which is fine
      console.error('Error checking for existing user:', checkError);
      throw new Error(`Database error when checking user: ${checkError.message}`);
    }
    
    if (existingUser) {
      console.log('User already exists:', existingUser);
      throw new Error(`A user with email ${user.email} already exists`);
    }
    
    // Generate UUID in the format Supabase expects/requires
    // We're using a string UUID that matches the format expected by Supabase auth.users table
    const userId = uuidv4();
    console.log('Generated user ID format:', userId);
    
    // Create a new user entry - make sure the format exactly matches what Supabase expects
    const userData = {
      id: userId,
      name: user.name,
      email: user.email,
      phone: user.phone || null,
      membership_start: new Date().toISOString()
    };
    
    console.log('Prepared user data for insertion:', userData);
    
    // First create an auth user if needed (this might be required by the schema constraints)
    // Note: In a real application you might want to use Supabase Auth here instead
    // For now we're just adding the user directly to the public.users table
    
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();
    
    if (error) {
      console.error('Supabase detailed error:', error);
      throw new Error(`Database error: ${error.message}`);
    }
    
    if (!data) {
      throw new Error('No data returned from insert operation');
    }
    
    console.log('User successfully added, response:', data);
    
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      membershipStartDate: new Date(data.membership_start),
      booksCheckedOut: 0,
      status: 'active' as const
    };
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  }
};

export const deleteUser = async (userId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};
