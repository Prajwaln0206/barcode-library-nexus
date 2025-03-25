
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Clock, PlusCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import PageTransition from '@/components/layout/PageTransition';
import BookCard, { BookInfo } from '@/components/books/BookCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getAllBooks } from '@/services/BookService';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import AddBookForm from '@/components/books/AddBookForm';
import { useAuth } from '@/contexts/AuthContext';

const Books = () => {
  const [books, setBooks] = useState<BookInfo[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);
  
  // Fetch books from the database
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const booksData = await getAllBooks();
        setBooks(booksData);
      } catch (error) {
        console.error('Error fetching books:', error);
        toast({
          variant: "destructive",
          title: "Failed to load books",
          description: "There was an error loading the book catalog."
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchBooks();
  }, [toast]);
  
  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (book.isbn && book.isbn.includes(searchQuery)) ||
    book.barcode.includes(searchQuery)
  );
  
  const handleBookClick = (book: BookInfo) => {
    console.log('Book clicked:', book);
    // In a real app, this would open a detailed view or a modal
  };
  
  const handleAddBookSuccess = () => {
    // Refresh the book list after adding a new book
    getAllBooks()
      .then(booksData => {
        setBooks(booksData);
        toast({
          title: "Book catalog updated",
          description: "The book has been added to the catalog."
        });
      })
      .catch(error => {
        console.error('Error refreshing books:', error);
      });
  };
  
  if (authLoading) {
    return (
      <PageTransition>
        <div className="flex justify-center items-center h-[60vh]">
          <div className="text-center">
            <Clock className="animate-spin h-8 w-8 mx-auto mb-4 text-primary" />
            <p>Loading...</p>
          </div>
        </div>
      </PageTransition>
    );
  }
  
  if (!user) {
    return null; // This will redirect to auth page due to the useEffect
  }
  
  return (
    <PageTransition>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
          <div>
            <h1 className="font-bold tracking-tight">Books</h1>
            <p className="text-muted-foreground">Manage your library collection.</p>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add New Book
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Book</DialogTitle>
              </DialogHeader>
              <AddBookForm onSuccess={handleAddBookSuccess} />
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title, author, ISBN, or barcode..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
            <span className="sr-only">Filter</span>
          </Button>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <Clock className="animate-spin h-8 w-8 mx-auto mb-4 text-primary" />
              <p>Loading book catalog...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.length > 0 ? (
              filteredBooks.map((book, index) => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <BookCard 
                    book={book} 
                    onClick={handleBookClick}
                    onEdit={(book) => console.log('Edit book:', book)}
                    onDelete={(book) => console.log('Delete book:', book)}
                  />
                </motion.div>
              ))
            ) : books.length > 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-muted w-12 h-12 flex items-center justify-center mb-4">
                  <Search className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">No books found</h3>
                <p className="text-muted-foreground mt-1">
                  {searchQuery ? `No books match "${searchQuery}"` : "Try adding some books to your library"}
                </p>
              </div>
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
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
                    <AddBookForm onSuccess={handleAddBookSuccess} />
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default Books;
