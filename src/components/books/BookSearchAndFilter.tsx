
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

interface BookSearchAndFilterProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  filterStatus: string;
  onFilterStatusChange: (status: string) => void;
}

const BookSearchAndFilter: React.FC<BookSearchAndFilterProps> = ({
  searchQuery,
  onSearchQueryChange,
  filterStatus,
  onFilterStatusChange
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by title, author, ISBN, or barcode..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
        />
      </div>
      
      <Select
        value={filterStatus}
        onValueChange={onFilterStatusChange}
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
  );
};

export default BookSearchAndFilter;
