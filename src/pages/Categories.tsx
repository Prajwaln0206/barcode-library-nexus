
import React, { useState } from 'react';
import { Bookmark, Plus, Pencil, Trash, BookOpen } from 'lucide-react';
import PageTransition from '@/components/layout/PageTransition';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const Categories = () => {
  const [categories, setCategories] = useState([
    { id: 1, name: 'Fiction', description: 'Novels, short stories, and narrative literature', count: 42 },
    { id: 2, name: 'Non-Fiction', description: 'Factual works including biography, history, and academic texts', count: 38 },
    { id: 3, name: 'Science Fiction', description: 'Literature with futuristic technology and settings', count: 25 },
    { id: 4, name: 'Mystery', description: 'Works centered around solving a crime or unveiling secrets', count: 19 },
    { id: 5, name: 'Biography', description: 'Books about real people\'s lives', count: 15 },
  ]);
  const [newCategory, setNewCategory] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [editMode, setEditMode] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  
  const { toast } = useToast();

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      toast({
        title: "Error",
        description: "Category name cannot be empty",
        variant: "destructive"
      });
      return;
    }
    
    // Check if the category name already exists (case insensitive)
    const categoryExists = categories.some(
      category => category.name.toLowerCase() === newCategory.trim().toLowerCase()
    );
    
    if (categoryExists) {
      toast({
        title: "Error",
        description: "Category with this name already exists",
        variant: "destructive"
      });
      return;
    }
    
    const newId = Math.max(0, ...categories.map(c => c.id)) + 1;
    setCategories([
      ...categories,
      { 
        id: newId, 
        name: newCategory, 
        description: newDescription || 'No description provided',
        count: 0
      }
    ]);
    
    setNewCategory('');
    setNewDescription('');
    
    toast({
      title: "Success",
      description: "New category has been added",
    });
  };

  const handleDeleteCategory = (id: number) => {
    setCategories(categories.filter(category => category.id !== id));
    toast({
      title: "Success",
      description: "Category has been deleted",
    });
  };

  const startEdit = (category: any) => {
    setEditMode(category.id);
    setEditName(category.name);
    setEditDescription(category.description);
  };

  const cancelEdit = () => {
    setEditMode(null);
    setEditName('');
    setEditDescription('');
  };

  const saveEdit = (id: number) => {
    if (!editName.trim()) {
      toast({
        title: "Error",
        description: "Category name cannot be empty",
        variant: "destructive"
      });
      return;
    }
    
    // Check if the edited name would create a duplicate (excluding the current category)
    const duplicateName = categories.some(
      category => category.id !== id && 
      category.name.toLowerCase() === editName.trim().toLowerCase()
    );
    
    if (duplicateName) {
      toast({
        title: "Error",
        description: "Another category with this name already exists",
        variant: "destructive"
      });
      return;
    }
    
    setCategories(categories.map(category => 
      category.id === id 
        ? { ...category, name: editName, description: editDescription } 
        : category
    ));
    
    setEditMode(null);
    toast({
      title: "Success",
      description: "Category has been updated",
    });
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-3 rounded-full">
              <Bookmark className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Book Categories</CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
          
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
        </div>
      </div>
    </PageTransition>
  );
};

export default Categories;
