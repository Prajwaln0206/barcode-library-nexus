
import { supabase } from '@/integrations/supabase/client';
import { BookInfo } from '@/components/books/BookCard';

// Update an existing book
export const updateBook = async (book: BookInfo): Promise<BookInfo> => {
  const { data, error } = await supabase
    .from('books')
    .update({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      genre: book.genre,
      location: book.location,
      status: book.isAvailable ? 'available' : 'checked_out'
    })
    .eq('id', book.id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating book:', error);
    throw error;
  }
  
  return {
    id: data.id,
    title: data.title,
    author: data.author,
    isbn: data.isbn || '',
    genre: data.genre || '',
    location: data.location || '',
    barcode: data.barcode,
    isAvailable: data.status === 'available',
    coverImage: undefined // Set default as undefined since cover_image doesn't exist in DB
  };
};

// Delete a book from the database
export const deleteBook = async (bookId: string): Promise<void> => {
  try {
    // First, check if the book has any active loans
    const { count: activeLoans, error: loanCheckError } = await supabase
      .from('loans')
      .select('*', { count: 'exact', head: true })
      .eq('book_id', bookId)
      .is('return_date', null)
      .eq('status', 'active');
    
    if (loanCheckError) {
      console.error('Error checking for active loans:', loanCheckError);
      throw loanCheckError;
    }
    
    if (activeLoans && activeLoans > 0) {
      throw new Error('Cannot delete a book that is currently checked out.');
    }
    
    // If no active loans, proceed with deletion
    const { error } = await supabase
      .from('books')
      .delete()
      .eq('id', bookId);
    
    if (error) {
      console.error('Error deleting book:', error);
      throw error;
    }
    
    console.log(`Book with ID ${bookId} deleted successfully`);
  } catch (error) {
    console.error('Error in deleteBook:', error);
    throw error;
  }
};
