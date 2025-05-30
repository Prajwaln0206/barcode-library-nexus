
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
    
    if (booksError) {
      console.error('Error fetching total books:', booksError);
      throw booksError;
    }

    // Get number of books currently checked out
    const { count: booksCheckedOut, error: checkedOutError } = await supabase
      .from('books')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'checked_out');
    
    if (checkedOutError) {
      console.error('Error fetching checked out books:', checkedOutError);
      throw checkedOutError;
    }

    // Get total number of members/users
    const { count: totalMembers, error: membersError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });
    
    if (membersError) {
      console.error('Error fetching total members:', membersError);
      throw membersError;
    }

    // Get number of active members (users with at least one active loan)
    const { data: activeLoans, error: activeLoansError } = await supabase
      .from('loans')
      .select('user_id')
      .is('return_date', null)
      .eq('status', 'active');
    
    if (activeLoansError) {
      console.error('Error fetching active loans:', activeLoansError);
      throw activeLoansError;
    }
    
    // Get unique user IDs from active loans
    const activeUserIds = activeLoans && activeLoans.length > 0 
      ? [...new Set(activeLoans.map(loan => loan.user_id))] 
      : [];
    
    // Count active members
    let activeMembers = 0;
    if (activeUserIds.length > 0) {
      const { count, error: activeMembersError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .in('id', activeUserIds);
      
      if (activeMembersError) {
        console.error('Error fetching active members:', activeMembersError);
        throw activeMembersError;
      }
      activeMembers = count || 0;
    }

    return {
      totalBooks: totalBooks || 0,
      booksCheckedOut: booksCheckedOut || 0,
      totalMembers: totalMembers || 0,
      activeMembers: activeMembers,
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
