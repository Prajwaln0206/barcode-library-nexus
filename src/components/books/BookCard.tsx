
import React from 'react';
import { Book, Edit, MoreHorizontal, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export interface BookInfo {
  id: string;
  title: string;
  author: string;
  isbn: string;
  genre: string;
  location: string;
  barcode: string;
  isAvailable: boolean;
  coverImage?: string;
}

interface BookCardProps {
  book: BookInfo;
  onEdit?: (book: BookInfo) => void;
  onDelete?: (book: BookInfo) => void;
  onClick?: (book: BookInfo) => void;
  className?: string;
}

const BookCard: React.FC<BookCardProps> = ({
  book,
  onEdit,
  onDelete,
  onClick,
  className,
}) => {
  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all duration-200 hover:shadow-lg",
        book.isAvailable ? "border-green-200" : "border-red-200",
        className
      )}
      onClick={() => onClick?.(book)}
    >
      <div className="relative aspect-[3/4] bg-muted">
        {book.coverImage ? (
          <img 
            src={book.coverImage} 
            alt={book.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-secondary text-secondary-foreground">
            <Book className="h-12 w-12 opacity-20" />
          </div>
        )}
        
        <div className="absolute top-2 right-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-8 w-8 bg-background/80 backdrop-blur-sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onEdit && (
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation();
                  onEdit(book);
                }}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(book);
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div 
          className={cn(
            "absolute bottom-0 left-0 right-0 py-1 text-xs font-medium text-center text-white",
            book.isAvailable ? "bg-emerald-500" : "bg-rose-500"
          )}
        >
          {book.isAvailable ? "Available" : "Checked Out"}
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-medium line-clamp-1 mb-1">{book.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-1 mb-2">by {book.author}</p>
        
        <div className="text-xs text-muted-foreground space-y-1">
          <div className="flex justify-between">
            <span>Genre:</span>
            <span className="font-medium text-foreground">{book.genre}</span>
          </div>
          <div className="flex justify-between">
            <span>Location:</span>
            <span className="font-medium text-foreground">{book.location}</span>
          </div>
          <div className="flex justify-between">
            <span>ISBN:</span>
            <span className="font-medium text-foreground">{book.isbn}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookCard;
