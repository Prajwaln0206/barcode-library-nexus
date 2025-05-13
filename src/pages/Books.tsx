
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock } from 'lucide-react';
import PageTransition from '@/components/layout/PageTransition';
import { BookInfo } from '@/components/books/BookCard';
import { getAllBooks, deleteBook } from '@/services/BookService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

// Import refactored components
import BooksHeader from '@/components/books/BooksHeader';
import BookSearchAndFilter from '@/components/books/BookSearchAndFilter';
import BulkActionsBar from '@/components/books/BulkActionsBar';
import BookGrid from '@/components/books/BookGrid';

const Books = () => {
  const [books, setBooks] = useState<BookInfo[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
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
  
  // Filter books based on search query and status filter
  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (book.isbn && book.isbn.includes(searchQuery)) ||
      book.barcode.includes(searchQuery);
    
    // Apply status filter
    if (filterStatus === 'all') return matchesSearch;
    if (filterStatus === 'available') return matchesSearch && book.isAvailable;
    if (filterStatus === 'checked-out') return matchesSearch && !book.isAvailable;
    
    return matchesSearch;
  });
  
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
  
  const toggleBookSelection = (bookId: string) => {
    setSelectedBooks(prev => {
      if (prev.includes(bookId)) {
        return prev.filter(id => id !== bookId);
      } else {
        return [...prev, bookId];
      }
    });
  };
  
  const selectAllBooks = () => {
    if (selectedBooks.length === filteredBooks.length) {
      setSelectedBooks([]);
    } else {
      setSelectedBooks(filteredBooks.map(book => book.id));
    }
  };
  
  const handleBulkDelete = () => {
    // Delete all selected books
    const deletionPromises = selectedBooks.map(id => deleteBook(id));
    
    Promise.all(deletionPromises)
      .then(() => {
        setBooks(prev => prev.filter(book => !selectedBooks.includes(book.id)));
        toast({
          title: "Books deleted",
          description: `${selectedBooks.length} books have been removed from the catalog.`
        });
        setSelectedBooks([]);
      })
      .catch(error => {
        console.error('Error deleting books:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Some books could not be deleted. Please try again."
        });
      });
  };
  
  const handleStatusChange = (status: string) => {
    // In a real implementation, this would update statuses in the database
    toast({
      title: "Status updated",
      description: `${selectedBooks.length} books marked as ${status === 'available' ? 'available' : 'checked out'}.`
    });
    setSelectedBooks([]);
  };
  
  const handleQuickCategorize = (category: string) => {
    // In a real implementation, this would update the category in the database
    toast({
      title: "Books categorized",
      description: `${selectedBooks.length} books have been categorized as "${category}".`
    });
    setSelectedBooks([]);
  };
  
  const handleExportCatalog = () => {
    // In a real implementation, this would generate a CSV/Excel file
    const timestamp = new Date().toISOString().split('T')[0];
    toast({
      title: "Export started",
      description: `Exporting book catalog as "library-catalog-${timestamp}.csv"`
    });
  };
  
  const handleDeleteBook = async (book: BookInfo) => {
    try {
      // Check if the book can be deleted (not checked out)
      if (!book.isAvailable) {
        toast({
          variant: "destructive",
          title: "Cannot delete book",
          description: "Book is currently checked out and cannot be deleted."
        });
        return;
      }
      
      // Call the deleteBook service
      await deleteBook(book.id);
      
      // Update the books list
      setBooks(prevBooks => prevBooks.filter(b => b.id !== book.id));
      
      toast({
        title: "Book deleted",
        description: `"${book.title}" has been removed from the catalog.`
      });
    } catch (error) {
      console.error('Error deleting book:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete the book."
      });
    }
  };
  
  const handleEditBook = (book: BookInfo) => {
    console.log('Edit book:', book);
    // In a real app, this would open an edit form
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
        <BooksHeader 
          onAddBookSuccess={handleAddBookSuccess}
          onExportCatalog={handleExportCatalog}
        />
        
        <BookSearchAndFilter
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          filterStatus={filterStatus}
          onFilterStatusChange={setFilterStatus}
        />
        
        <BulkActionsBar
          selectedBooks={selectedBooks}
          totalBooks={filteredBooks.length}
          onSelectAllChange={selectAllBooks}
          onDeleteSelected={handleBulkDelete}
          onStatusChange={handleStatusChange}
          onCategorize={handleQuickCategorize}
        />
        
        <BookGrid
          books={books}
          filteredBooks={filteredBooks}
          searchQuery={searchQuery}
          selectedBooks={selectedBooks}
          onBookClick={handleBookClick}
          onToggleSelection={toggleBookSelection}
          onAddBookSuccess={handleAddBookSuccess}
          onDeleteBook={handleDeleteBook}
          onEditBook={handleEditBook}
          loading={loading}
        />
      </div>
    </PageTransition>
  );
};

export default Books;
