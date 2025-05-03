import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  PlusCircle, 
  Trash2, 
  Tag, 
  FileText, 
  CheckSquare,
  XSquare,
  Download
} from 'lucide-react';
import { motion } from 'framer-motion';
import PageTransition from '@/components/layout/PageTransition';
import BookCard, { BookInfo } from '@/components/books/BookCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getAllBooks, deleteBook } from '@/services/BookService';
import { useToast } from '@/hooks/use-toast';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import AddBookForm from '@/components/books/AddBookForm';
import { useAuth } from '@/contexts/AuthContext';

const Books = () => {
  const [books, setBooks] = useState<BookInfo[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [bulkActionOpen, setBulkActionOpen] = useState(false);
  const [quickCategoryValue, setQuickCategoryValue] = useState('');
  
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
    // In a real implementation, this would call a service to delete books from the database
    setBooks(prev => prev.filter(book => !selectedBooks.includes(book.id)));
    toast({
      title: "Books deleted",
      description: `${selectedBooks.length} books have been removed from the catalog.`
    });
    setSelectedBooks([]);
    setBulkActionOpen(false);
  };
  
  const handleQuickCategorize = () => {
    if (!quickCategoryValue) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a category."
      });
      return;
    }
    
    // In a real implementation, this would update the category in the database
    toast({
      title: "Books categorized",
      description: `${selectedBooks.length} books have been categorized as "${quickCategoryValue}".`
    });
    setSelectedBooks([]);
    setBulkActionOpen(false);
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
          
          <div className="flex flex-wrap gap-2">
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
            
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleExportCatalog}
            >
              <Download className="mr-2 h-4 w-4" />
              Export Catalog
            </Button>
          </div>
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
          
          <Select
            value={filterStatus}
            onValueChange={setFilterStatus}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Books</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="checked-out">Checked Out</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Admin Actions Bar - only visible when books are selected */}
        {selectedBooks.length > 0 && (
          <div className="bg-muted p-3 rounded-lg flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Checkbox 
                id="selectAll" 
                checked={selectedBooks.length > 0 && selectedBooks.length === filteredBooks.length}
                onCheckedChange={selectAllBooks}
              />
              <label htmlFor="selectAll" className="text-sm font-medium">
                {selectedBooks.length} books selected
              </label>
            </div>
            
            <div className="flex gap-2">
              <Dialog open={bulkActionOpen} onOpenChange={setBulkActionOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    <Tag className="mr-2 h-4 w-4" />
                    Quick Categorize
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Categorize Selected Books</DialogTitle>
                  </DialogHeader>
                  <div className="py-4">
                    <Select value={quickCategoryValue} onValueChange={setQuickCategoryValue}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Fiction">Fiction</SelectItem>
                        <SelectItem value="Non-Fiction">Non-Fiction</SelectItem>
                        <SelectItem value="Science Fiction">Science Fiction</SelectItem>
                        <SelectItem value="Mystery">Mystery</SelectItem>
                        <SelectItem value="Biography">Biography</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setBulkActionOpen(false)}>Cancel</Button>
                    <Button onClick={handleQuickCategorize}>Apply</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="outline">
                    <CheckSquare className="mr-2 h-4 w-4" />
                    Set Status
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => {
                    toast({
                      title: "Status updated",
                      description: `${selectedBooks.length} books marked as available.`
                    });
                    setSelectedBooks([]);
                  }}>
                    <CheckSquare className="mr-2 h-4 w-4" />
                    Mark as Available
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {
                    toast({
                      title: "Status updated",
                      description: `${selectedBooks.length} books marked as checked out.`
                    });
                    setSelectedBooks([]);
                  }}>
                    <XSquare className="mr-2 h-4 w-4" />
                    Mark as Checked Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Selected
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                  </DialogHeader>
                  <p className="py-4">
                    Are you sure you want to delete {selectedBooks.length} selected books? 
                    This action cannot be undone.
                  </p>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => {}}>Cancel</Button>
                    <Button variant="destructive" onClick={handleBulkDelete}>Delete</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        )}
        
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
                  className="relative"
                >
                  {/* Selection checkbox overlay */}
                  <div className="absolute top-2 left-2 z-10">
                    <Checkbox 
                      checked={selectedBooks.includes(book.id)}
                      onCheckedChange={() => toggleBookSelection(book.id)}
                      className="h-5 w-5 bg-background/80"
                    />
                  </div>
                  
                  <BookCard 
                    book={book} 
                    onClick={handleBookClick}
                    onEdit={(book) => console.log('Edit book:', book)}
                    onDelete={handleDeleteBook}
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
