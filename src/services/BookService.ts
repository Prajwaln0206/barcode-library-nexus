
import { supabase } from '@/integrations/supabase/client';
import { BookInfo } from '@/components/books/BookCard';
import { generateUniqueBarcode } from '@/lib/barcodeUtils';

// Type for creating a new book
export type BookCreate = Omit<BookInfo, 'id' | 'barcode'>;

// Get all books from the database
export const getAllBooks = async (): Promise<BookInfo[]> => {
  const { data, error } = await supabase
    .from('books')
    .select('*');
  
  if (error) {
    console.error('Error fetching books:', error);
    throw error;
  }
  
  // Map the database records to BookInfo objects
  return data.map((book: any) => ({
    id: book.id,
    title: book.title,
    author: book.author,
    isbn: book.isbn || '',
    genre: book.genre || '',
    location: book.location || '',
    barcode: book.barcode,
    isAvailable: book.status === 'available',
    coverImage: undefined // Set default as undefined since cover_image doesn't exist in DB
  }));
};

// Get a book by its barcode
export const getBookByBarcode = async (barcode: string): Promise<BookInfo | null> => {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('barcode', barcode)
    .maybeSingle();
  
  if (error) {
    console.error('Error fetching book by barcode:', error);
    throw error;
  }
  
  if (!data) return null;
  
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

// Add a new book to the database
export const addBook = async (book: BookCreate): Promise<BookInfo> => {
  // Generate a new UUID for the book (will be handled by the database)
  // Generate a unique barcode
  const tempId = crypto.randomUUID();
  const barcode = generateUniqueBarcode(tempId);
  
  const { data, error } = await supabase
    .from('books')
    .insert([
      {
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        genre: book.genre,
        location: book.location,
        barcode: barcode,
        status: 'available'
      }
    ])
    .select()
    .single();
  
  if (error) {
    console.error('Error adding book:', error);
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

// Record a book scan in the scan_logs table
export const recordBookScan = async (
  bookId: string, 
  scanType: 'checkout' | 'return' | 'inventory'
): Promise<void> => {
  try {
    const { data: session } = await supabase.auth.getSession();
    
    // If user isn't authenticated, just log scan without user ID
    const { error } = await supabase
      .from('scan_logs')
      .insert([
        {
          book_id: bookId,
          scan_type: scanType,
          // Only add user ID if authenticated
          ...(session.session?.user ? { scanned_by: session.session.user.id } : {})
        }
      ]);
    
    if (error) {
      // If foreign key constraint error, try without the user ID
      if (error.code === '23503' && error.message.includes('scan_logs_scanned_by_fkey')) {
        const { error: retryError } = await supabase
          .from('scan_logs')
          .insert([{
            book_id: bookId,
            scan_type: scanType
          }]);
        
        if (retryError) {
          console.error('Error recording scan (retry):', retryError);
          // Just log the error but don't throw it to prevent blocking UI
        }
      } else {
        console.error('Error recording scan:', error);
        // Just log the error but don't throw it to prevent blocking UI
      }
    }
  } catch (error) {
    console.error('Exception in recordBookScan:', error);
    // Just log the error but don't throw it to prevent blocking UI
  }
};
