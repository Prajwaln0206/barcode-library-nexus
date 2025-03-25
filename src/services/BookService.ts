
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
    coverImage: book.cover_image || undefined
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
    coverImage: data.cover_image || undefined
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
        status: 'available',
        cover_image: book.coverImage
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
    coverImage: data.cover_image || undefined
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
      status: book.isAvailable ? 'available' : 'checked_out',
      cover_image: book.coverImage
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
    coverImage: data.cover_image || undefined
  };
};

// Record a book scan in the scan_logs table
export const recordBookScan = async (
  bookId: string, 
  scanType: 'checkout' | 'return' | 'inventory'
): Promise<void> => {
  const { data: session } = await supabase.auth.getSession();
  
  if (!session.session?.user) {
    throw new Error('User must be authenticated to record scans');
  }
  
  const { error } = await supabase
    .from('scan_logs')
    .insert([
      {
        book_id: bookId,
        scan_type: scanType,
        scanned_by: session.session.user.id
      }
    ]);
  
  if (error) {
    console.error('Error recording scan:', error);
    throw error;
  }
};
