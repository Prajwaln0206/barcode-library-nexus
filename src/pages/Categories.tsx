
import React, { useState } from 'react';
import { Bookmark } from 'lucide-react';
import PageTransition from '@/components/layout/PageTransition';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { CategoryItem } from '@/components/categories/types';
import CategoryTable from '@/components/categories/CategoryTable';
import AddCategoryForm from '@/components/categories/AddCategoryForm';

const Categories = () => {
  const [categories, setCategories] = useState<CategoryItem[]>([
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

  const startEdit = (category: CategoryItem) => {
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
              <CategoryTable
                categories={categories}
                editMode={editMode}
                editName={editName}
                editDescription={editDescription}
                setEditName={setEditName}
                setEditDescription={setEditDescription}
                handleDeleteCategory={handleDeleteCategory}
                startEdit={startEdit}
                cancelEdit={cancelEdit}
                saveEdit={saveEdit}
              />
            </CardContent>
          </Card>
          
          <AddCategoryForm
            newCategory={newCategory}
            newDescription={newDescription}
            setNewCategory={setNewCategory}
            setNewDescription={setNewDescription}
            handleAddCategory={handleAddCategory}
          />
        </div>
      </div>
    </PageTransition>
  );
};

export default Categories;
