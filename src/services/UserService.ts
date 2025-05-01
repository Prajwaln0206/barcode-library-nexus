
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
    console.log('UserService: Adding user:', user);
    
    // First, try to register the user in auth system (this is a simplified example)
    // In a real application, you would use Supabase Auth API to register the user
    
    // For now, we'll just add the user to the users table directly
    // Instead of generating our own UUID, we'll let Supabase handle ID generation
    const userData = {
      name: user.name,
      email: user.email,
      phone: user.phone || null,
      membership_start: new Date().toISOString()
    };
    
    console.log('UserService: Formatted user data:', userData);
    
    // Using upsert instead of insert - this may help with the constraint issue
    // We're using the email as a unique identifier to prevent duplicates
    const { data, error } = await supabase
      .from('users')
      .upsert(userData, {
        onConflict: 'email',
        ignoreDuplicates: false
      })
      .select()
      .single();
    
    if (error) {
      console.error('Supabase error details:', error);
      throw new Error(`Database error: ${error.message}`);
    }
    
    if (!data) {
      throw new Error('No data returned from insert operation');
    }
    
    console.log('UserService: Successfully added user, response:', data);
    
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
