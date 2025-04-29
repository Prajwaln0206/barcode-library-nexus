
import { supabase } from '@/integrations/supabase/client';

export interface CirculationData {
  month: string;
  checkouts: number;
  returns: number;
}

export interface OverdueBook {
  id: string;
  title: string;
  patron: string;
  dueDate: string;
  daysOverdue: number;
}

export interface PopularBook {
  id: string;
  title: string;
  author: string;
  checkouts: number;
}

export interface ActivePatron {
  id: string;
  name: string;
  checkouts: number;
  returns: number;
}

// Get circulation data for the last 6 months
export const getCirculationData = async (): Promise<CirculationData[]> => {
  try {
    const monthsToQuery = 7; // Include current month
    const result: CirculationData[] = [];
    
    // Generate the last 6 months in format 'Jun', 'Jul', etc.
    const today = new Date();
    
    for (let i = monthsToQuery - 1; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const month = date.toLocaleString('default', { month: 'short' });
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1).toISOString();
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString();
      
      // Get checkouts for the month
      const { count: checkouts, error: checkoutsError } = await supabase
        .from('loans')
        .select('*', { count: 'exact', head: true })
        .gte('issue_date', startOfMonth)
        .lt('issue_date', endOfMonth);
        
      if (checkoutsError) {
        console.error('Error fetching checkouts:', checkoutsError);
        continue;
      }
      
      // Get returns for the month
      const { count: returns, error: returnsError } = await supabase
        .from('loans')
        .select('*', { count: 'exact', head: true })
        .gte('return_date', startOfMonth)
        .lt('return_date', endOfMonth);
        
      if (returnsError) {
        console.error('Error fetching returns:', returnsError);
        continue;
      }
      
      result.push({
        month,
        checkouts: checkouts || 0,
        returns: returns || 0
      });
    }
    
    return result;
  } catch (error) {
    console.error('Error fetching circulation data:', error);
    return [];
  }
};

// Get overdue books
export const getOverdueBooks = async (): Promise<OverdueBook[]> => {
  try {
    const today = new Date();
    
    // Get all loans where due date is before today and return date is null
    const { data, error } = await supabase
      .from('loans')
      .select(`
        id,
        due_date,
        books (
          id,
          title
        ),
        users (
          id,
          name
        )
      `)
      .lt('due_date', today.toISOString())
      .is('return_date', null)
      .eq('status', 'active');
      
    if (error) throw error;
    
    return data.map(loan => {
      const dueDate = new Date(loan.due_date);
      const diffTime = Math.abs(today.getTime() - dueDate.getTime());
      const daysOverdue = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return {
        id: loan.id,
        title: loan.books.title,
        patron: loan.users.name,
        dueDate: new Date(loan.due_date).toISOString().split('T')[0], // YYYY-MM-DD format
        daysOverdue
      };
    });
  } catch (error) {
    console.error('Error fetching overdue books:', error);
    return [];
  }
};

// Get popular books based on number of checkouts
export const getPopularBooks = async (): Promise<PopularBook[]> => {
  try {
    // This requires a more complex query
    // We need to join loans with books and count the number of loans per book
    const { data, error } = await supabase
      .from('loans')
      .select(`
        books!inner (
          id,
          title,
          author
        )
      `);
      
    if (error) throw error;
    
    // Group loans by book and count them
    const bookCheckoutCount: Record<string, { title: string; author: string; count: number }> = {};
    
    data.forEach(loan => {
      const bookId = loan.books.id;
      if (!bookCheckoutCount[bookId]) {
        bookCheckoutCount[bookId] = {
          title: loan.books.title,
          author: loan.books.author,
          count: 1
        };
      } else {
        bookCheckoutCount[bookId].count += 1;
      }
    });
    
    // Convert to array and sort by count
    const result = Object.entries(bookCheckoutCount).map(([id, data]) => ({
      id,
      title: data.title,
      author: data.author,
      checkouts: data.count
    }));
    
    return result.sort((a, b) => b.checkouts - a.checkouts).slice(0, 5); // Top 5 books
  } catch (error) {
    console.error('Error fetching popular books:', error);
    return [];
  }
};

// Get active patrons based on checkout and return activity
export const getActivePatrons = async (): Promise<ActivePatron[]> => {
  try {
    // Get all loans with their associated users
    const { data, error } = await supabase
      .from('loans')
      .select(`
        users!inner (
          id,
          name
        ),
        return_date
      `);
      
    if (error) throw error;
    
    // Group by user and count checkouts and returns
    const patronActivity: Record<string, { name: string; checkouts: number; returns: number }> = {};
    
    data.forEach(loan => {
      const userId = loan.users.id;
      if (!patronActivity[userId]) {
        patronActivity[userId] = {
          name: loan.users.name,
          checkouts: 1,
          returns: loan.return_date ? 1 : 0
        };
      } else {
        patronActivity[userId].checkouts += 1;
        if (loan.return_date) {
          patronActivity[userId].returns += 1;
        }
      }
    });
    
    // Convert to array and sort by total activity
    const result = Object.entries(patronActivity).map(([id, data]) => ({
      id,
      name: data.name,
      checkouts: data.checkouts,
      returns: data.returns
    }));
    
    return result
      .sort((a, b) => (b.checkouts + b.returns) - (a.checkouts + a.returns))
      .slice(0, 5); // Top 5 most active patrons
  } catch (error) {
    console.error('Error fetching active patrons:', error);
    return [];
  }
};

// Get summary statistics for the reports page
export const getReportSummary = async (): Promise<{ totalCheckouts: number; activePatrons: number; overdueBooks: number }> => {
  try {
    // Get total checkouts
    const { count: totalCheckouts, error: checkoutsError } = await supabase
      .from('loans')
      .select('*', { count: 'exact', head: true });
    
    if (checkoutsError) throw checkoutsError;
    
    // Get active patrons (users with at least one active loan)
    const { count: activePatrons, error: patronsError } = await supabase
      .from('users')
      .select('id', { count: 'exact', head: true })
      .in('id', (query) => {
        query
          .from('loans')
          .select('user_id')
          .is('return_date', null)
          .eq('status', 'active');
      });
    
    if (patronsError) throw patronsError;
    
    // Get overdue books
    const today = new Date();
    const { count: overdueBooks, error: overdueError } = await supabase
      .from('loans')
      .select('*', { count: 'exact', head: true })
      .lt('due_date', today.toISOString())
      .is('return_date', null)
      .eq('status', 'active');
    
    if (overdueError) throw overdueError;
    
    return {
      totalCheckouts: totalCheckouts || 0,
      activePatrons: activePatrons || 0,
      overdueBooks: overdueBooks || 0
    };
  } catch (error) {
    console.error('Error fetching report summary:', error);
    return { totalCheckouts: 0, activePatrons: 0, overdueBooks: 0 };
  }
};
