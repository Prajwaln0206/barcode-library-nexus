
import { supabase } from '@/integrations/supabase/client';
import { UserInfo } from '@/components/users/UserCard';

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
    console.log('UserService: Adding library member with data:', user);
    
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
    
    // Generate a UUID for the user that doesn't rely on the auth system
    const id = crypto.randomUUID();
    console.log('Generated UUID for new user:', id);
    
    // Use a type assertion to work around the TypeScript limitation
    // This tells TypeScript to trust us that this function exists
    const { data, error } = await (supabase.rpc as any)('create_library_user', { 
      user_id: id,
      user_name: user.name,
      user_email: user.email,
      user_phone: user.phone || null,
      membership_date: new Date().toISOString()
    });
      
    if (error) {
      console.error('Database function error:', error);
      throw new Error(`Database error: ${error.message}`);
    }
    
    console.log('User successfully added, response:', data);
    
    // Fetch the newly created user to return with the expected format
    const { data: newUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
      
    if (fetchError || !newUser) {
      console.error('Error fetching new user:', fetchError);
      throw new Error('User was created but could not be retrieved');
    }
    
    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      membershipStartDate: new Date(newUser.membership_start),
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
    console.log('UserService: Deleting user with ID:', userId);
    
    // First check if user has any active loans
    const { count, error: loanCheckError } = await supabase
      .from('loans')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .is('return_date', null);
    
    if (loanCheckError) {
      console.error('Error checking for active loans:', loanCheckError);
      throw new Error(`Unable to check for active loans: ${loanCheckError.message}`);
    }
    
    if (count && count > 0) {
      throw new Error(`Cannot delete user with ${count} active loans. Please return all books first.`);
    }
    
    // Instead of trying to nullify user_id, we should delete the loan records 
    // associated with this user, since the user_id column is not nullable
    const { error: deleteLoanError } = await supabase
      .from('loans')
      .delete()
      .eq('user_id', userId);
      
    if (deleteLoanError) {
      console.error('Error deleting loan records:', deleteLoanError);
      throw new Error(`Failed to delete loan records: ${deleteLoanError.message}`);
    }
    
    // Now delete the user
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);
    
    if (error) {
      console.error('Database error when deleting user:', error);
      throw new Error(`Database error: ${error.message}`);
    }
    
    console.log('User successfully deleted');
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};
