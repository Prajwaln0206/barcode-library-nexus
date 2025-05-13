
import React, { useState, useEffect } from 'react';
import { Search, Filter, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import PageTransition from '@/components/layout/PageTransition';
import UserCard, { UserInfo } from '@/components/users/UserCard';
import AddUserDialog from '@/components/users/AddUserDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { getAllUsers, deleteUser } from '@/services/UserService';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';

const Users = () => {
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState<UserInfo | null>(null);
  const { toast } = useToast();
  
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load users from database',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleUserClick = (user: UserInfo) => {
    console.log('User clicked:', user);
    // In a real app, this would open a detailed view or a modal
  };
  
  // Add a new user to the database
  const handleUserAdded = async () => {
    // Just refresh the users list after adding new user
    console.log('User added, refreshing list');
    fetchUsers();
  };
  
  // Show confirmation dialog before deleting a user
  const showDeleteConfirm = (user: UserInfo) => {
    setConfirmDelete(user);
  };
  
  // Delete a user from the database
  const handleDeleteUser = async () => {
    if (!confirmDelete) return;
    
    try {
      await deleteUser(confirmDelete.id);
      setUsers(prevUsers => prevUsers.filter(u => u.id !== confirmDelete.id));
      
      toast({
        title: 'User deleted',
        description: `${confirmDelete.name} has been removed from the system`,
      });
      
      setConfirmDelete(null);
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to delete user',
      });
    }
  };
  
  return (
    <PageTransition>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
          <div>
            <h1 className="font-bold tracking-tight">Users</h1>
            <p className="text-muted-foreground">Manage library members.</p>
          </div>
          
          <AddUserDialog onUserAdded={handleUserAdded} />
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
            <span className="sr-only">Filter</span>
          </Button>
        </div>
        
        {/* Confirmation Dialog for Delete */}
        <Dialog open={!!confirmDelete} onOpenChange={(open) => !open && setConfirmDelete(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm User Deletion</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              Are you sure you want to delete user "{confirmDelete?.name}"? 
              {confirmDelete?.booksCheckedOut > 0 && 
                " This user has books checked out and cannot be deleted. Please return all books first."}
              This action cannot be undone.
            </DialogDescription>
            <DialogFooter>
              <Button variant="outline" onClick={() => setConfirmDelete(null)}>Cancel</Button>
              <Button 
                variant="destructive" 
                onClick={handleDeleteUser}
                disabled={confirmDelete?.booksCheckedOut > 0}
              >
                Delete User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <UserCard 
                    user={user} 
                    onClick={handleUserClick}
                    onEdit={(user) => console.log('Edit user:', user)}
                    onDelete={showDeleteConfirm}
                  />
                </motion.div>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-muted w-12 h-12 flex items-center justify-center mb-4">
                  <Search className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">No users found</h3>
                <p className="text-muted-foreground mt-1">
                  {searchQuery ? `No users match "${searchQuery}"` : "Try adding some users to your library system"}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default Users;
