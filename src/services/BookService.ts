
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
    const userId = session.session?.user?.id;
    
    // Create a scan log object
    const scanLog = {
      book_id: bookId,
      scan_type: scanType,
      // We need to provide a scanned_by value that's not undefined
      // If no user ID available, use a default placeholder
      scanned_by: userId || '00000000-0000-0000-0000-000000000000'
    };
    
    // First attempt - try with the user ID if available
    const { error } = await supabase
      .from('scan_logs')
      .insert(scanLog);
    
    // If there's an error and it's related to the foreign key constraint on scanned_by
    if (error && error.code === '23503' && error.message?.includes('scan_logs_scanned_by_fkey')) {
      console.log('Foreign key constraint error for scanned_by, trying without user association');
      
      // Try to create a scan log without associating it with a specific user
      // Log scan without creating a foreign key constraint issue
      await supabase.rpc('log_scan_without_user', {
        p_book_id: bookId,
        p_scan_type: scanType
      });
    } else if (error) {
      console.error('Error recording scan:', error);
      // Just log the error but don't throw it to prevent blocking UI
    }
  } catch (error) {
    console.error('Exception in recordBookScan:', error);
    // Just log the error but don't throw it to prevent blocking UI
  }
};
