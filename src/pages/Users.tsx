
import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import PageTransition from '@/components/layout/PageTransition';
import UserCard, { UserInfo } from '@/components/users/UserCard';
import AddUserDialog from '@/components/users/AddUserDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockUsers } from '@/lib/data';

const Users = () => {
  const [users, setUsers] = useState<UserInfo[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleUserClick = (user: UserInfo) => {
    console.log('User clicked:', user);
    // In a real app, this would open a detailed view or a modal
  };
  
  // Add a new user to the list
  const handleUserAdded = (userData: { name: string, email: string }) => {
    const newUser: UserInfo = {
      id: `user_${Math.random().toString(36).substr(2, 9)}`,
      name: userData.name,
      email: userData.email,
      membershipStartDate: new Date(),
      booksCheckedOut: 0,
      status: 'active',
    };
    
    setUsers(prevUsers => [newUser, ...prevUsers]);
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
                  onDelete={(user) => console.log('Delete user:', user)}
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
      </div>
    </PageTransition>
  );
};

export default Users;
