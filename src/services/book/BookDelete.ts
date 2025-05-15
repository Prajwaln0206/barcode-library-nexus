
import { supabase } from '@/integrations/supabase/client';

/**
 * Delete a book from the database
 * @param bookId Book ID to delete
 */
export const deleteBook = async (bookId: string): Promise<void> => {
  try {
    console.log('Deleting book with ID:', bookId);

    // First, check if the book is currently checked out
    const { data: book, error: fetchError } = await supabase
      .from('books')
      .select('status')
      .eq('id', bookId)
      .single();
      
    if (fetchError) {
      console.error('Error fetching book status:', fetchError);
      throw new Error(`Could not check book status: ${fetchError.message}`);
    }
    
    if (book.status === 'checked_out') {
      throw new Error('Cannot delete a book that is currently checked out');
    }

    // Delete the book directly - let the database handle cascading deletions if needed
    const { error } = await supabase
      .from('books')
      .delete()
      .eq('id', bookId);
    
    if (error) {
      console.error('Error deleting book:', error);
      throw new Error(`Database error: ${error.message}`);
    }
    
    console.log('Book successfully deleted');
  } catch (error) {
    console.error('Error in deleteBook:', error);
    throw error;
  }
};
