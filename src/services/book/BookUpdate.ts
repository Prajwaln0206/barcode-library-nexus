
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
    
    // Delete the book directly without trying to delete related loans first
    // This avoids the permission denied error for table users
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
