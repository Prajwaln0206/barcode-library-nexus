
// Export all functionality from the smaller, more focused files
// Use named exports to avoid ambiguity
export {
  getAllBooks,
  getBookById,
  getBookByBarcode,
} from './book/BookFetch';

export { addBook } from './book/BookCreate';
export { deleteBook } from './book/BookDelete';

// Export the BookCreate interface as a type
export type { BookCreate } from './book/BookTypes';

export * from './book/BookUpdate';
export * from './book/BookScan';
