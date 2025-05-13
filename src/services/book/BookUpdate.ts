
import { supabase } from '@/integrations/supabase/client';

/**
 * Update a book in the database
 */
export const updateBook = async (bookId: string, bookData: any) => {
  try {
    console.log('Updating book with ID:', bookId, 'and data:', bookData);
    
    const { data, error } = await supabase
      .from('books')
      .update(bookData)
      .eq('id', bookId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating book:', error);
      throw new Error(`Failed to update book: ${error.message}`);
    }
    
    return data;
  } catch (error) {
    console.error('Error in updateBook:', error);
    throw error;
  }
};

/**
 * Delete a book from the database
 */
export const deleteBook = async (bookId: string) => {
  try {
    console.log('Deleting book with ID:', bookId);
    
    // First, check if the book is currently checked out
    const { data: bookData, error: bookError } = await supabase
      .from('books')
      .select('status')
      .eq('id', bookId)
      .single();
    
    if (bookError) {
      console.error('Error checking book status:', bookError);
      throw new Error(`Failed to check book status: ${bookError.message}`);
    }
    
    if (bookData.status === 'checked_out') {
      throw new Error('Cannot delete book that is currently checked out');
    }
    
    // Check if book has active loans
    const { count, error: loanError } = await supabase
      .from('loans')
      .select('*', { count: 'exact', head: true })
      .eq('book_id', bookId)
      .is('return_date', null);
    
    if (loanError) {
      console.error('Error checking book loans:', loanError);
      throw new Error(`Failed to check book loans: ${loanError.message}`);
    }
    
    if (count && count > 0) {
      throw new Error('Cannot delete book with active loans');
    }
    
    // Delete any historical loans for this book - 
    // Use "await" to ensure this completes before proceeding
    const { error: loansDeleteError } = await supabase
      .from('loans')
      .delete()
      .eq('book_id', bookId);
    
    if (loansDeleteError) {
      console.error('Error deleting book loans:', loansDeleteError);
      throw new Error(`Failed to delete book loans: ${loansDeleteError.message}`);
    }
    
    // Delete any scan logs for this book -
    // Use "await" to ensure this completes before proceeding
    const { error: scanLogsDeleteError } = await supabase
      .from('scan_logs')
      .delete()
      .eq('book_id', bookId);
    
    if (scanLogsDeleteError) {
      console.error('Error deleting book scan logs:', scanLogsDeleteError);
      throw new Error(`Failed to delete book scan logs: ${scanLogsDeleteError.message}`);
    }
    
    // Now delete the book
    const { error: deleteError } = await supabase
      .from('books')
      .delete()
      .eq('id', bookId);
    
    if (deleteError) {
      console.error('Error deleting book:', deleteError);
      throw new Error(`Failed to delete book: ${deleteError.message}`);
    }
    
    console.log('Book successfully deleted');
    return true;
  } catch (error) {
    console.error('Error in deleteBook:', error);
    throw error;
  }
};
