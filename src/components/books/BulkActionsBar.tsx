
import React from 'react';
import { Tag, Trash2, CheckSquare, XSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  const [bulkActionOpen, setBulkActionOpen] = React.useState(false);
  const [quickCategoryValue, setQuickCategoryValue] = React.useState('');
  
  const handleQuickCategorize = () => {
    if (!quickCategoryValue) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a category."
      });
      return;
    }
    
    onCategorize(quickCategoryValue);
    setBulkActionOpen(false);
  };
  
  if (selectedBooks.length === 0) {
    return null;
  }
  
  return (
    <div className="bg-muted p-3 rounded-lg flex flex-wrap items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <Checkbox 
          id="selectAll" 
          checked={selectedBooks.length > 0 && selectedBooks.length === totalBooks}
          onCheckedChange={onSelectAllChange}
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
            <DropdownMenuItem onClick={() => onStatusChange('available')}>
              <CheckSquare className="mr-2 h-4 w-4" />
              Mark as Available
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusChange('checked-out')}>
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
              <Button variant="outline">Cancel</Button>
              <Button variant="destructive" onClick={onDeleteSelected}>Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default BulkActionsBar;
