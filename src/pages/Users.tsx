
import React, { useState, useEffect } from 'react';
import { Search, Filter, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import PageTransition from '@/components/layout/PageTransition';
import UserCard, { UserInfo } from '@/components/users/UserCard';
import AddUserDialog from '@/components/users/AddUserDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { getAllUsers, addUser, deleteUser } from '@/services/UserService';

const Users = () => {
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
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

    fetchUsers();
  }, [toast]);
  
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleUserClick = (user: UserInfo) => {
    console.log('User clicked:', user);
    // In a real app, this would open a detailed view or a modal
  };
  
  // Add a new user to the database
  const handleUserAdded = async (userData: { name: string, email: string, phone?: string }) => {
    try {
      const newUser = await addUser(userData);
      setUsers(prevUsers => [newUser, ...prevUsers]);
      
      toast({
        title: 'User added',
        description: `${userData.name} has been added successfully`,
      });
    } catch (error) {
      console.error('Error adding user:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to add new user',
      });
    }
  };
  
  // Delete a user from the database
  const handleDeleteUser = async (user: UserInfo) => {
    try {
      await deleteUser(user.id);
      setUsers(prevUsers => prevUsers.filter(u => u.id !== user.id));
      
      toast({
        title: 'User deleted',
        description: `${user.name} has been removed from the system`,
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete user',
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
                    onDelete={handleDeleteUser}
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
