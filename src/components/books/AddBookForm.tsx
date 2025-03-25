
import React, { useState } from 'react';
import { BookOpen, Tag, Bookmark, MapPin, QrCode, Image, Save } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { BookCreate, addBook } from '@/services/BookService';
import BarcodeGenerator from './BarcodeGenerator';

interface AddBookFormProps {
  onSuccess?: (barcode: string) => void;
}

const AddBookForm: React.FC<AddBookFormProps> = ({ onSuccess }) => {
  const [book, setBook] = useState<BookCreate>({
    title: '',
    author: '',
    isbn: '',
    genre: '',
    location: '',
    isAvailable: true,
  });
  const [loading, setLoading] = useState(false);
  const [generatedBook, setGeneratedBook] = useState<{ barcode: string } | null>(null);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBook(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Validate required fields
      if (!book.title || !book.author) {
        throw new Error("Title and author are required");
      }
      
      const newBook = await addBook(book);
      
      toast({
        title: "Book added successfully",
        description: `The book "${newBook.title}" has been added with barcode ${newBook.barcode}`,
      });
      
      setGeneratedBook({ barcode: newBook.barcode });
      
      if (onSuccess) {
        onSuccess(newBook.barcode);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to add book",
        description: error.message || "An unexpected error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Book</CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title (required)</Label>
            <div className="relative">
              <BookOpen className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="title"
                name="title"
                placeholder="Book title"
                value={book.title}
                onChange={handleChange}
                className="pl-10"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="author">Author (required)</Label>
            <div className="relative">
              <Tag className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="author"
                name="author"
                placeholder="Author name"
                value={book.author}
                onChange={handleChange}
                className="pl-10"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="isbn">ISBN</Label>
              <div className="relative">
                <QrCode className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="isbn"
                  name="isbn"
                  placeholder="ISBN number"
                  value={book.isbn}
                  onChange={handleChange}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="genre">Genre</Label>
              <div className="relative">
                <Bookmark className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="genre"
                  name="genre"
                  placeholder="Book genre"
                  value={book.genre}
                  onChange={handleChange}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Shelf Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="location"
                name="location"
                placeholder="Shelf location (e.g., A1-S2)"
                value={book.location}
                onChange={handleChange}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="coverImage">Cover Image URL (optional)</Label>
            <div className="relative">
              <Image className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="coverImage"
                name="coverImage"
                placeholder="URL to book cover image"
                value={book.coverImage || ''}
                onChange={handleChange}
                className="pl-10"
              />
            </div>
          </div>
          
          <Button type="submit" className="w-full" disabled={loading}>
            <Save className="mr-2 h-4 w-4" />
            {loading ? "Adding Book..." : "Add Book & Generate Barcode"}
          </Button>
        </form>
      </CardContent>
      
      {generatedBook && (
        <CardFooter className="flex-col">
          <div className="border-t w-full pt-4 mt-2">
            <h3 className="font-medium mb-2">Generated Barcode</h3>
            <BarcodeGenerator 
              value={generatedBook.barcode} 
              title={book.title}
            />
            <p className="text-sm text-muted-foreground mt-2 text-center">
              Print this barcode and attach it to the book.
            </p>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default AddBookForm;
