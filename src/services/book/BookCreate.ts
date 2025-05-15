
import { supabase } from '@/integrations/supabase/client';
import { BookInfo } from '@/components/books/BookCard';
import { BookCreate, transformDatabaseBook } from './BookTypes';

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
    
    return transformDatabaseBook(data);
  } catch (error) {
    console.error('Error in addBook:', error);
    throw error;
  }
};
