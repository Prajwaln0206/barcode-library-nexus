
import React from 'react';
import { Plus, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AddBookForm from '@/components/books/AddBookForm';

interface BooksHeaderProps {
  onAddBookSuccess: () => void;
  onExportCatalog: () => void;
}

const BooksHeader: React.FC<BooksHeaderProps> = ({ 
  onAddBookSuccess,
  onExportCatalog
}) => {
  return (
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
            <AddBookForm onSuccess={onAddBookSuccess} />
          </DialogContent>
        </Dialog>
        
        <Button 
          size="sm" 
          variant="outline" 
          onClick={onExportCatalog}
        >
          <Download className="mr-2 h-4 w-4" />
          Export Catalog
        </Button>
      </div>
    </div>
  );
};

export default BooksHeader;
