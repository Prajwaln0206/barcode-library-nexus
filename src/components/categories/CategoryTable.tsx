
import React from 'react';
import { Pencil, Trash, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CategoryItem } from '@/components/categories/types';

interface CategoryTableProps {
  categories: CategoryItem[];
  editMode: string | null;
  editName: string;
  editDescription: string;
  setEditName: (value: string) => void;
  setEditDescription: (value: string) => void;
  handleDeleteCategory: (id: string) => void;
  startEdit: (category: CategoryItem) => void;
  cancelEdit: () => void;
  saveEdit: (id: string) => void;
}

const CategoryTable: React.FC<CategoryTableProps> = ({
  categories,
  editMode,
  editName,
  editDescription,
  setEditName,
  setEditDescription,
  handleDeleteCategory,
  startEdit,
  cancelEdit,
  saveEdit
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead className="text-center">Books</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories.map((category) => (
          <TableRow key={category.id}>
            <TableCell>
              {editMode === category.id ? (
                <Input 
                  value={editName} 
                  onChange={(e) => setEditName(e.target.value)}
                />
              ) : (
                <div className="font-medium">{category.name}</div>
              )}
            </TableCell>
            <TableCell>
              {editMode === category.id ? (
                <Input 
                  value={editDescription} 
                  onChange={(e) => setEditDescription(e.target.value)}
                />
              ) : (
                category.description
              )}
            </TableCell>
            <TableCell className="text-center">
              <div className="flex items-center justify-center gap-1">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span>{category.count}</span>
              </div>
            </TableCell>
            <TableCell className="text-right">
              {editMode === category.id ? (
                <div className="flex justify-end gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={cancelEdit}
                  >
                    Cancel
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => saveEdit(category.id)}
                  >
                    Save
                  </Button>
                </div>
              ) : (
                <div className="flex justify-end gap-2">
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => startEdit(category)}
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="text-destructive hover:text-destructive/90"
                    onClick={() => handleDeleteCategory(category.id)}
                  >
                    <Trash className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default CategoryTable;
