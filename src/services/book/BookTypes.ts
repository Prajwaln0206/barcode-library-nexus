
/**
 * Interface for creating a new book
 */
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
 * Common book transformation utility function
 */
export const transformDatabaseBook = (book: any) => {
  return {
    id: book.id,
    title: book.title,
    author: book.author,
    isbn: book.isbn || '',
    genre: book.genre || 'Uncategorized',
    location: book.location || '',
    barcode: book.barcode,
    isAvailable: book.status !== 'checked_out',
    coverImage: null // This property doesn't exist in the database
  };
};
