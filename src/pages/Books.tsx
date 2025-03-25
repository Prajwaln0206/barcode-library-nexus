
import React, { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import PageTransition from '@/components/layout/PageTransition';
import BookCard, { BookInfo } from '@/components/books/BookCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockBooks } from '@/lib/data';

const Books = () => {
  const [books] = useState<BookInfo[]>(mockBooks);
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.isbn.includes(searchQuery) ||
    book.barcode.includes(searchQuery)
  );
  
  const handleBookClick = (book: BookInfo) => {
    console.log('Book clicked:', book);
    // In a real app, this would open a detailed view or a modal
  };
  
  return (
    <PageTransition>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
          <div>
            <h1 className="font-bold tracking-tight">Books</h1>
            <p className="text-muted-foreground">Manage your library collection.</p>
          </div>
          
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add New Book
          </Button>
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
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted w-12 h-12 flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No books found</h3>
              <p className="text-muted-foreground mt-1">
                {searchQuery ? `No books match "${searchQuery}"` : "Try adding some books to your library"}
              </p>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default Books;
