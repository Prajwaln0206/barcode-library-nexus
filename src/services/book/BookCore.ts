
import { supabase } from '@/integrations/supabase/client';
import { BookInfo } from '@/components/books/BookCard';

/**
 * Fetch all books from the database
 * @returns Array of books
 */
export const getAllBooks = async (): Promise<BookInfo[]> => {
  try {
    const { data: books, error } = await supabase
      .from('books')
      .select(`
        id, title, author, isbn, genre, location, barcode, status,
        categories (id, name)
      `)
      .order('title', { ascending: true });
    
    if (error) throw error;

    return books.map(book => {
      // Transform the database structure to match the BookInfo interface
      return {
        id: book.id,
        title: book.title,
        author: book.author,
        isbn: book.isbn || '',
        genre: book.genre || 'Uncategorized',
        location: book.location || '',
        barcode: book.barcode,
        isAvailable: book.status !== 'checked_out',
        coverImage: book.cover_image || null
      };
    });
  } catch (error) {
    console.error('Error fetching books:', error);
    throw error;
  }
};

/**
 * Get a book by ID
 * @param id Book ID
 * @returns Book information or null if not found
 */
export const getBookById = async (id: string): Promise<BookInfo | null> => {
  try {
    const { data: book, error } = await supabase
      .from('books')
      .select(`
        id, title, author, isbn, genre, location, barcode, status,
        categories (id, name)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Book not found
      }
      throw error;
    }

    return {
      id: book.id,
      title: book.title,
      author: book.author,
      isbn: book.isbn || '',
      genre: book.genre || 'Uncategorized',
      location: book.location || '',
      barcode: book.barcode,
      isAvailable: book.status !== 'checked_out',
      coverImage: book.cover_image || null
    };
  } catch (error) {
    console.error(`Error fetching book with ID ${id}:`, error);
    throw error;
  }
};

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
