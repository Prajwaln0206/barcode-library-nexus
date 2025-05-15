
import { supabase } from '@/integrations/supabase/client';
import { BookInfo } from '@/components/books/BookCard';

// Define the BookCreate interface that was missing
export interface BookCreate {
  title: string;
  author: string;
  isbn?: string;
  genre?: string;
  location?: string;
  isAvailable?: boolean;
  coverImage?: string;
}

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
        coverImage: null // Changed from book.cover_image to fix the error
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
      coverImage: null // Changed from book.cover_image to fix the error
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

/**
 * Get book by barcode
 * @param barcode Book barcode
 * @returns Book information or null if not found
 */
export const getBookByBarcode = async (barcode: string): Promise<BookInfo | null> => {
  try {
    const { data: book, error } = await supabase
      .from('books')
      .select(`
        id, title, author, isbn, genre, location, barcode, status,
        categories (id, name)
      `)
      .eq('barcode', barcode)
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
      coverImage: null // Changed from book.cover_image to fix the error
    };
  } catch (error) {
    console.error(`Error fetching book with barcode ${barcode}:`, error);
    throw error;
  }
};

/**
 * Add a new book to the database
 * @param bookData Book data
 * @returns The newly created book
 */
export const addBook = async (bookData: BookCreate): Promise<BookInfo> => {
  try {
    // Generate a unique barcode for the book (LIB prefix + random number + checksum)
    const randomId = Math.floor(100000 + Math.random() * 900000); // 6 digit number
    const checksum = (randomId % 97); // Simple checksum
    const barcode = `LIB-${randomId}-${checksum}`;
    
    const { data, error } = await supabase
      .from('books')
      .insert([{
        title: bookData.title,
        author: bookData.author,
        isbn: bookData.isbn || null,
        genre: bookData.genre || null,
        location: bookData.location || null,
        barcode: barcode,
        status: bookData.isAvailable ? 'available' : 'checked_out'
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error adding book:', error);
      throw new Error(`Failed to add book: ${error.message}`);
    }
    
    return {
      id: data.id,
      title: data.title,
      author: data.author,
      isbn: data.isbn || '',
      genre: data.genre || 'Uncategorized',
      location: data.location || '',
      barcode: data.barcode,
      isAvailable: data.status !== 'checked_out',
      coverImage: null
    };
  } catch (error) {
    console.error('Error in addBook:', error);
    throw error;
  }
};
