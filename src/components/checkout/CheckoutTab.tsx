
import React, { useState, useEffect } from 'react';
import { recordBookScan } from '@/services/BookService';
import { BookInfo } from '@/components/books/BookCard';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import BookScanner from './BookScanner';
import BookDetails from './BookDetails';
import UserSelector from './UserSelector';

type UserInfo = {
  id: string;
  name: string;
  email: string;
  membershipStartDate: Date;
  booksCheckedOut: number;
  status: string;
  avatar?: string;
};

const CheckoutTab: React.FC = () => {
  const [selectedBook, setSelectedBook] = useState<BookInfo | null>(null);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*');
        
        if (error) throw error;
        
        const formattedUsers: UserInfo[] = data.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          membershipStartDate: new Date(user.membership_start),
          booksCheckedOut: 0,
          status: 'active',
        }));
        
        for (const user of formattedUsers) {
          const { count, error } = await supabase
            .from('loans')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .eq('status', 'active');
          
          if (!error && count !== null) {
            user.booksCheckedOut = count;
          }
        }
        
        setUsers(formattedUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast({
          variant: "destructive",
          title: "Failed to load users",
          description: "There was an error loading the user list."
        });
      }
    };
    
    fetchUsers();
  }, [toast]);
  
  const handleBookScanned = async (book: BookInfo) => {
    setSelectedBook(book);
    
    try {
      await recordBookScan(book.id, 'inventory');
    } catch (error) {
      console.error('Error recording scan:', error);
    }
  };
  
  const handleProcessCheckout = async () => {
    if (!selectedBook || !selectedUserId) return;
    
    try {
      setLoading(true);
      
      if (!selectedBook.isAvailable) {
        toast({
          variant: "destructive",
          title: "Book unavailable",
          description: "This book is already checked out."
        });
        return;
      }
      
      const selectedUser = users.find(user => user.id === selectedUserId);
      
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 14);
      
      const { error: loanError } = await supabase
        .from('loans')
        .insert([
          {
            book_id: selectedBook.id,
            user_id: selectedUserId,
            due_date: dueDate.toISOString(),
            status: 'active'
          }
        ]);
      
      if (loanError) throw loanError;
      
      const { error: bookError } = await supabase
        .from('books')
        .update({ status: 'checked_out' })
        .eq('id', selectedBook.id);
      
      if (bookError) throw bookError;
      
      await recordBookScan(selectedBook.id, 'checkout');
      
      toast({
        title: "Checkout successful",
        description: `"${selectedBook.title}" has been checked out to ${selectedUser?.name}.`,
      });
      
      setSelectedBook(null);
      setSelectedUserId('');
    } catch (error) {
      console.error('Error processing checkout:', error);
      toast({
        variant: "destructive",
        title: "Checkout failed",
        description: "An error occurred while processing the checkout."
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <BookScanner 
          onBookScanned={handleBookScanned}
          loading={loading}
          setLoading={setLoading}
        />
        <BookDetails selectedBook={selectedBook} />
      </div>
      
      <UserSelector 
        users={users}
        selectedUserId={selectedUserId}
        setSelectedUserId={setSelectedUserId}
        onProcessCheckout={handleProcessCheckout}
        disabled={!selectedBook?.isAvailable || !selectedUserId}
        loading={loading}
      />
    </div>
  );
};

export default CheckoutTab;
