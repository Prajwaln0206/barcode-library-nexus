
import React from 'react';
import { motion } from 'framer-motion';
import { Search, PlusCircle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BookInfo } from '@/components/books/BookCard';
import BookCard from '@/components/books/BookCard';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AddBookForm from '@/components/books/AddBookForm';
import { useToast } from '@/hooks/use-toast';
import { deleteBook } from '@/services/BookService';

interface BookGridProps {
  books: BookInfo[];
  filteredBooks: BookInfo[];
  searchQuery: string;
  selectedBooks: string[];
  onBookClick: (book: BookInfo) => void;
  onToggleSelection: (bookId: string) => void;
  onAddBookSuccess: () => void;
  onDeleteBook: (book: BookInfo) => void;
  onEditBook: (book: BookInfo) => void;
  loading: boolean;
}

const BookGrid: React.FC<BookGridProps> = ({
  books,
  filteredBooks,
  searchQuery,
  selectedBooks,
  onBookClick,
  onToggleSelection,
  onAddBookSuccess,
  onDeleteBook,
  onEditBook,
  loading
}) => {
  const { toast } = useToast();
  
  // Function to handle book deletion directly from the card
  const handleDeleteBook = async (book: BookInfo) => {
    try {
      console.log('Deleting book:', book);
      await deleteBook(book.id);
      
      toast({
        title: "Book deleted",
        description: `"${book.title}" has been removed from the catalog.`
      });
      
      // Call the parent's onDeleteBook to update the UI
      onDeleteBook(book);
    } catch (error: any) {
      console.error('Error deleting book:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete the book."
      });
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading book catalog...</p>
        </div>
      </div>
    );
  }
  
  if (filteredBooks.length > 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBooks.map((book, index) => (
          <motion.div
            key={book.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="relative"
          >
            {/* Selection checkbox overlay */}
            <div className="absolute top-2 left-2 z-10">
              <Checkbox 
                checked={selectedBooks.includes(book.id)}
                onCheckedChange={() => onToggleSelection(book.id)}
                className="h-5 w-5 bg-background/80"
              />
            </div>
            
            <BookCard 
              book={book} 
              onClick={() => onBookClick(book)}
              onEdit={() => onEditBook(book)}
              onDelete={() => handleDeleteBook(book)}
            />
          </motion.div>
        ))}
      </div>
    );
  }
  
  if (books.length > 0) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted w-12 h-12 flex items-center justify-center mb-4">
          <Search className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium">No books found</h3>
        <p className="text-muted-foreground mt-1">
          {searchQuery ? `No books match "${searchQuery}"` : "Try adding some books to your library"}
        </p>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-muted w-12 h-12 flex items-center justify-center mb-4">
        <PlusCircle className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium">No books in your library</h3>
      <p className="text-muted-foreground mt-1">
        Add your first book to get started
      </p>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="mt-4">
            <Plus className="mr-2 h-4 w-4" />
            Add Your First Book
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Book</DialogTitle>
          </DialogHeader>
          <AddBookForm onSuccess={onAddBookSuccess} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookGrid;
