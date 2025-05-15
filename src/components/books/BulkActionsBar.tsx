
import React from 'react';
import { Check, Trash2, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface BulkActionsBarProps {
  selectedBooks: string[];
  totalBooks: number;
  onSelectAllChange: () => void;
  onDeleteSelected: () => void;
  onStatusChange: (status: string) => void;
  onCategorize: (category: string) => void;
}

const BulkActionsBar: React.FC<BulkActionsBarProps> = ({
  selectedBooks,
  totalBooks,
  onSelectAllChange,
  onDeleteSelected,
  onStatusChange,
  onCategorize
}) => {
  // Don't display if no books are available
  if (totalBooks === 0) return null;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 p-2 border rounded-md bg-muted/30">
      <div className="flex items-center gap-2">
        <Checkbox 
          checked={selectedBooks.length > 0 && selectedBooks.length === totalBooks}
          indeterminate={selectedBooks.length > 0 && selectedBooks.length < totalBooks}
          onCheckedChange={onSelectAllChange}
          id="selectAll"
        />
        <label htmlFor="selectAll" className="text-sm font-medium">
          {selectedBooks.length === 0 
            ? `${totalBooks} book${totalBooks !== 1 ? 's' : ''}` 
            : `${selectedBooks.length} of ${totalBooks} selected`}
        </label>
      </div>
      
      {selectedBooks.length > 0 && (
        <div className="flex flex-wrap gap-2 sm:ml-auto">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Check className="mr-2 h-4 w-4" />
                Status
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48">
              <div className="flex flex-col gap-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="justify-start"
                  onClick={() => onStatusChange('available')}
                >
                  Mark as Available
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="justify-start"
                  onClick={() => onStatusChange('checked-out')}
                >
                  Mark as Checked Out
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Tag className="mr-2 h-4 w-4" />
                Categorize
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48">
              <div className="flex flex-col gap-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="justify-start"
                  onClick={() => onCategorize('Fiction')}
                >
                  Fiction
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="justify-start"
                  onClick={() => onCategorize('Non-Fiction')}
                >
                  Non-Fiction
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="justify-start"
                  onClick={() => onCategorize('Reference')}
                >
                  Reference
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={onDeleteSelected}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Selected
          </Button>
        </div>
      )}
    </div>
  );
};

export default BulkActionsBar;
