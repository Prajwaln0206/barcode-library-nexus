
import React, { useState, useEffect } from 'react';
import { Bookmark, Loader } from 'lucide-react';
import PageTransition from '@/components/layout/PageTransition';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { CategoryItem } from '@/components/categories/types';
import CategoryTable from '@/components/categories/CategoryTable';
import AddCategoryForm from '@/components/categories/AddCategoryForm';
import { 
  getAllCategories, 
  addCategory as addCategoryService, 
  updateCategory as updateCategoryService,
  deleteCategory as deleteCategoryService 
} from '@/services/CategoryService';

const Categories = () => {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [editMode, setEditMode] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [loading, setLoading] = useState(true);
  
  const { toast } = useToast();
  
  // Fetch categories from database
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const categoriesData = await getAllCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: "Error",
        description: "Failed to load categories",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      toast({
        title: "Error",
        description: "Category name cannot be empty",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await addCategoryService(newCategory, newDescription);
      
      setNewCategory('');
      setNewDescription('');
      
      toast({
        title: "Success",
        description: "New category has been added",
      });
      
      // Refresh the categories list
      fetchCategories();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add category",
        variant: "destructive"
      });
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await deleteCategoryService(id);
      
      toast({
        title: "Success",
        description: "Category has been deleted",
      });
      
      // Refresh the categories list
      fetchCategories();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete category",
        variant: "destructive"
      });
    }
  };

  const startEdit = (category: CategoryItem) => {
    setEditMode(category.id.toString());
    setEditName(category.name);
    setEditDescription(category.description);
  };

  const cancelEdit = () => {
    setEditMode(null);
    setEditName('');
    setEditDescription('');
  };

  const saveEdit = async (id: string) => {
    if (!editName.trim()) {
      toast({
        title: "Error",
        description: "Category name cannot be empty",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await updateCategoryService(id, editName, editDescription);
      
      setEditMode(null);
      toast({
        title: "Success",
        description: "Category has been updated",
      });
      
      // Refresh the categories list
      fetchCategories();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update category",
        variant: "destructive"
      });
    }
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
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
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
        )}
      </div>
    </PageTransition>
  );
};

export default Categories;
