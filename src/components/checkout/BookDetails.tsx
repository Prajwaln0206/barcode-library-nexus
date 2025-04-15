
import React from 'react';
import { BookOpen, Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookInfo } from '@/components/books/BookCard';
import { cn } from '@/lib/utils';

interface BookDetailsProps {
  selectedBook: BookInfo | null;
}

const BookDetails: React.FC<BookDetailsProps> = ({ selectedBook }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BookOpen className="mr-2 h-5 w-5" />
          Book Details
        </CardTitle>
        <CardDescription>
          {selectedBook 
            ? `Information about "${selectedBook.title}"`
            : "Scan a book to see its details"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {selectedBook ? (
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-lg">{selectedBook.title}</h3>
              <p className="text-muted-foreground">by {selectedBook.author}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">ISBN:</span>
                <p>{selectedBook.isbn || 'N/A'}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Genre:</span>
                <p>{selectedBook.genre || 'N/A'}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Location:</span>
                <p>{selectedBook.location || 'N/A'}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Status:</span>
                <p className={selectedBook.isAvailable ? "text-emerald-600" : "text-rose-600"}>
                  {selectedBook.isAvailable ? "Available" : "Checked Out"}
                </p>
              </div>
            </div>
            
            {!selectedBook.isAvailable && (
              <div className="rounded-md bg-amber-50 p-3 text-sm text-amber-800">
                This book is currently checked out and not available for checkout.
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-40 text-muted-foreground text-center">
            <div>
              <Search className="h-8 w-8 mx-auto mb-2 opacity-30" />
              <p>Scan a book or enter a barcode to view details</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BookDetails;
