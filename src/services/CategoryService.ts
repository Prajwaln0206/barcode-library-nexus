
import { supabase } from '@/integrations/supabase/client';
import { CategoryItem } from '@/components/categories/types';

/**
 * Get all categories with book counts
 */
export const getAllCategories = async (): Promise<CategoryItem[]> => {
  try {
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*');
    
    if (error) throw error;

    // Map the data to our CategoryItem format and get book counts
    const categoriesWithCounts = await Promise.all(categories.map(async (category) => {
      // Call our custom database function to count books
      const { data: countData, error: countError } = await supabase
        .rpc('count_books_in_category', { category_id: category.id });
      
      if (countError) {
        console.error('Error counting books in category:', countError);
        return {
          id: category.id,
          name: category.name,
          description: category.description || 'No description',
          count: 0
        };
      }

      return {
        id: category.id,
        name: category.name,
        description: category.description || 'No description',
        count: countData || 0
      };
    }));

    // Filter out any potential duplicates by using a Set of IDs
    const uniqueIds = new Set();
    const uniqueCategories = categoriesWithCounts.filter(category => {
      if (uniqueIds.has(category.id)) {
        return false;
      }
      uniqueIds.add(category.id);
      return true;
    });

    return uniqueCategories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

/**
 * Add a new category
 */
export const addCategory = async (name: string, description: string): Promise<CategoryItem> => {
  try {
    // First check if category with this name already exists - case insensitive search
    const { data: existing, error: checkError } = await supabase
      .from('categories')
      .select('*')
      .ilike('name', name.trim())
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = not found, which is what we want
      throw checkError;
    }
    
    if (existing) {
      throw new Error(`Category with name "${name}" already exists`);
    }
    
    // Add the new category
    const { data, error } = await supabase
      .from('categories')
      .insert([
        { 
          name: name.trim(), 
          description: description.trim() || 'No description'
        }
      ])
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      description: data.description || 'No description',
      count: 0
    };
  } catch (error) {
    console.error('Error adding category:', error);
    throw error;
  }
};

/**
 * Update an existing category
 */
export const updateCategory = async (id: string, name: string, description: string): Promise<CategoryItem> => {
  try {
    // Check if another category with the new name already exists
    const { data: existing, error: checkError } = await supabase
      .from('categories')
      .select('*')
      .neq('id', id)
      .ilike('name', name.trim())
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = not found, which is what we want
      throw checkError;
    }
    
    if (existing) {
      throw new Error(`Another category with name "${name}" already exists`);
    }
    
    // Update the category
    const { data, error } = await supabase
      .from('categories')
      .update({ 
        name: name.trim(), 
        description: description.trim() || 'No description'
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    // Get the current count of books
    const { data: countData, error: countError } = await supabase
      .rpc('count_books_in_category', { category_id: id });
    
    return {
      id: data.id,
      name: data.name,
      description: data.description || 'No description',
      count: countData || 0
    };
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

/**
 * Delete a category
 */
export const deleteCategory = async (id: string): Promise<void> => {
  try {
    // Check if category has books
    const { data: countData, error: countError } = await supabase
      .rpc('count_books_in_category', { category_id: id });
    
    if (countError) throw countError;
    
    if (countData && countData > 0) {
      throw new Error(`Cannot delete category with ${countData} books. Please remove or reassign the books first.`);
    }
    
    // Delete the category
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};
