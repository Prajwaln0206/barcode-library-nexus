
// Export all functionality from the smaller, more focused files
// Use named exports to avoid ambiguity
export {
  getAllBooks,
  getBookById,
  deleteBook,
  getBookByBarcode,
  addBook,
  BookCreate
} from './book/BookCore';
export * from './book/BookUpdate';
export * from './book/BookScan';
