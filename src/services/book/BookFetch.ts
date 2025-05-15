
import { supabase } from '@/integrations/supabase/client';
import { BookInfo } from '@/components/books/BookCard';
import { transformDatabaseBook } from './BookTypes';

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

    return books.map(book => transformDatabaseBook(book));
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

    return transformDatabaseBook(book);
  } catch (error) {
    console.error(`Error fetching book with ID ${id}:`, error);
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

    return transformDatabaseBook(book);
  } catch (error) {
    console.error(`Error fetching book with barcode ${barcode}:`, error);
    throw error;
  }
};
