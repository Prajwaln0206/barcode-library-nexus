
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AddCategoryFormProps {
  newCategory: string;
  newDescription: string;
  setNewCategory: (value: string) => void;
  setNewDescription: (value: string) => void;
  handleAddCategory: () => void;
}

const AddCategoryForm: React.FC<AddCategoryFormProps> = ({
  newCategory,
  newDescription,
  setNewCategory,
  setNewDescription,
  handleAddCategory
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Category Name
            </label>
            <Input
              id="name"
              placeholder="Enter category name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Input
              id="description"
              placeholder="Enter description (optional)"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
            />
          </div>
          <Button 
            className="w-full" 
            onClick={handleAddCategory}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AddCategoryForm;
