
import { supabase } from '@/integrations/supabase/client';

export interface DashboardStats {
  totalBooks: number;
  booksCheckedOut: number;
  totalMembers: number;
  activeMembers: number;
}

/**
 * Fetch dashboard statistics from the database
 * @returns Dashboard statistics
 */
export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    // Get total number of books
    const { count: totalBooks, error: booksError } = await supabase
      .from('books')
      .select('*', { count: 'exact', head: true });
    
    if (booksError) throw booksError;

    // Get number of books currently checked out
    const { count: booksCheckedOut, error: checkedOutError } = await supabase
      .from('books')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'checked_out');
    
    if (checkedOutError) throw checkedOutError;

    // Get total number of members/users
    const { count: totalMembers, error: membersError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });
    
    if (membersError) throw membersError;

    // Get number of active members (users with at least one active loan)
    const { count: activeMembers, error: activeMembersError } = await supabase
      .from('users')
      .select('id', { count: 'exact', head: true })
      .in('id', (query) => {
        query
          .from('loans')
          .select('user_id')
          .is('return_date', null)
          .eq('status', 'active');
      });
    
    if (activeMembersError) throw activeMembersError;

    return {
      totalBooks: totalBooks || 0,
      booksCheckedOut: booksCheckedOut || 0,
      totalMembers: totalMembers || 0,
      activeMembers: activeMembers || 0,
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    // Return default values if there's an error
    return {
      totalBooks: 0,
      booksCheckedOut: 0,
      totalMembers: 0,
      activeMembers: 0,
    };
  }
};
