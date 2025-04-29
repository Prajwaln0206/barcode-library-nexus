
import { supabase } from '@/integrations/supabase/client';
import { UserInfo } from '@/components/users/UserCard';

// Type for creating a new user
export type UserCreate = {
  name: string;
  email: string;
  phone?: string;
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
    // Using array syntax for insert with type assertion
    // Supabase will automatically generate the UUID for id
    const { data, error } = await supabase
      .from('users')
      .insert([{
        name: user.name,
        email: user.email,
        phone: user.phone || null,
        membership_start: new Date().toISOString()
      }] as any)
      .select()
      .single();
    
    if (error) {
      console.error('Supabase error details:', error);
      throw error;
    }
    
    if (!data) {
      throw new Error('No data returned from insert operation');
    }
    
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
