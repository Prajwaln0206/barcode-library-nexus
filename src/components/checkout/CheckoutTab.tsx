
import React, { useState } from 'react';
import { Scan, BookOpen, User, ArrowRight, Search, Info, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import BarcodeGenerator from '@/components/books/BarcodeGenerator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { validateBarcode } from '@/lib/barcodeUtils';
import { BookInfo } from '@/components/books/BookCard';
import { supabase } from '@/integrations/supabase/client';
import { getBookByBarcode, recordBookScan } from '@/services/BookService';
import { useToast } from '@/hooks/use-toast';
import BarcodeScanner from '@/components/scanner/BarcodeScanner';

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
  const [barcode, setBarcode] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [scanResult, setScanResult] = useState<'success' | 'error' | null>(null);
  const [selectedBook, setSelectedBook] = useState<BookInfo | null>(null);
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  React.useEffect(() => {
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
  
  const handleBarcodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    
    try {
      if (validateBarcode(barcode)) {
        const book = await getBookByBarcode(barcode);
        
        if (book) {
          setSelectedBook(book);
          setScanResult('success');
          
          await recordBookScan(book.id, 'inventory');
          
          toast({
            title: "Book found",
            description: `Successfully scanned "${book.title}"`,
          });
        } else {
          setScanResult('error');
          toast({
            variant: "destructive",
            title: "Book not found",
            description: "No book with this barcode exists in the system."
          });
        }
      } else {
        setScanResult('error');
        toast({
          variant: "destructive",
          title: "Invalid barcode",
          description: "The barcode format is not valid."
        });
      }
    } catch (error) {
      console.error('Error scanning barcode:', error);
      setScanResult('error');
      toast({
        variant: "destructive",
        title: "Scan error",
        description: "An error occurred while scanning the barcode."
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleBarcodeScan = async (scannedBarcode: string) => {
    if (loading) return;
    
    setBarcode(scannedBarcode);
    
    setLoading(true);
    
    try {
      if (validateBarcode(scannedBarcode)) {
        const book = await getBookByBarcode(scannedBarcode);
        
        if (book) {
          setSelectedBook(book);
          setScanResult('success');
          
          await recordBookScan(book.id, 'inventory');
          
          toast({
            title: "Book found",
            description: `Successfully scanned "${book.title}"`,
          });
        } else {
          setScanResult('error');
          toast({
            variant: "destructive",
            title: "Book not found",
            description: "No book with this barcode exists in the system."
          });
        }
      } else {
        setScanResult('error');
        toast({
          variant: "destructive",
          title: "Invalid barcode",
          description: "The barcode format is not valid."
        });
      }
    } catch (error) {
      console.error('Error scanning barcode:', error);
      setScanResult('error');
      toast({
        variant: "destructive",
        title: "Scan error",
        description: "An error occurred while scanning the barcode."
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleScanSimulation = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('books')
        .select('barcode')
        .limit(10);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.length);
        const randomBarcode = data[randomIndex].barcode;
        setBarcode(randomBarcode);
        
        setTimeout(async () => {
          const book = await getBookByBarcode(randomBarcode);
          if (book) {
            setSelectedBook(book);
            setScanResult('success');
            
            await recordBookScan(book.id, 'inventory');
            
            toast({
              title: "Book found",
              description: `Successfully scanned "${book.title}"`,
            });
          }
          setLoading(false);
        }, 800);
      } else {
        toast({
          variant: "destructive",
          title: "No books found",
          description: "There are no books in the database to simulate scanning."
        });
        setLoading(false);
      }
    } catch (error) {
      console.error('Error in scan simulation:', error);
      toast({
        variant: "destructive",
        title: "Simulation error",
        description: "An error occurred during scan simulation."
      });
      setLoading(false);
    }
  };
  
  const selectedUser = users.find(user => user.id === selectedUserId);
  
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
      
      setBarcode('');
      setSelectedBook(null);
      setSelectedUserId('');
      setScanResult(null);
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Scan className="mr-2 h-5 w-5" />
              Scan Book
            </CardTitle>
            <CardDescription>
              Use a barcode scanner or enter barcode manually
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <BarcodeScanner 
                onScan={handleBarcodeScan}
                enabled={!loading}
              />
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    or enter manually
                  </span>
                </div>
              </div>
              
              <form onSubmit={handleBarcodeSubmit} className="space-y-4">
                <div>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Enter barcode..."
                      value={barcode}
                      onChange={(e) => setBarcode(e.target.value)}
                      className="flex-1"
                      disabled={loading}
                    />
                    <Button type="submit" disabled={loading}>Lookup</Button>
                  </div>
                  
                  <div className="mt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleScanSimulation}
                      className="w-full"
                      disabled={loading}
                    >
                      <Scan className="mr-2 h-4 w-4" />
                      Simulate Scan
                    </Button>
                  </div>
                  
                  {scanResult === 'error' && (
                    <p className="text-sm text-destructive mt-2">
                      Invalid barcode or book not found.
                    </p>
                  )}
                </div>
                
                {barcode && (
                  <div className="pt-2">
                    <BarcodeGenerator value={barcode} />
                  </div>
                )}
              </form>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="mr-2 h-5 w-5" />
              Book Details
            </CardTitle>
            <CardDescription>
              {selectedBook 
                ? `Information about "${selectedBook.title}"`
                : "Scan a book to see its details"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedBook ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-lg">{selectedBook.title}</h3>
                  <p className="text-muted-foreground">by {selectedBook.author}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">ISBN:</span>
                    <p>{selectedBook.isbn || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Genre:</span>
                    <p>{selectedBook.genre || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Location:</span>
                    <p>{selectedBook.location || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Status:</span>
                    <p className={selectedBook.isAvailable ? "text-emerald-600" : "text-rose-600"}>
                      {selectedBook.isAvailable ? "Available" : "Checked Out"}
                    </p>
                  </div>
                </div>
                
                {!selectedBook.isAvailable && (
                  <div className="rounded-md bg-amber-50 p-3 text-sm text-amber-800">
                    This book is currently checked out and not available for checkout.
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-40 text-muted-foreground text-center">
                <div>
                  <Search className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  <p>Scan a book or enter a barcode to view details</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="mr-2 h-5 w-5" />
            Select User
          </CardTitle>
          <CardDescription>
            Choose the user who is checking out the book
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {users.map(user => (
                  <div
                    key={user.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all hover:border-primary ${
                      selectedUserId === user.id ? 'border-primary bg-primary/5' : ''
                    }`}
                    onClick={() => setSelectedUserId(user.id)}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center mb-2">
                        {user.avatar ? (
                          <img 
                            src={user.avatar} 
                            alt={user.name}
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          user.name.charAt(0)
                        )}
                      </div>
                      <span className="font-medium text-sm">{user.name}</span>
                      <span className="text-xs text-muted-foreground mt-1">
                        {user.booksCheckedOut} book{user.booksCheckedOut !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-4">
                <Info className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground">No users found in the system.</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Add users to enable checkout functionality.
                </p>
              </div>
            )}
            
            <div className="flex justify-end pt-4">
              <Button
                disabled={!selectedBook?.isAvailable || !selectedUserId || loading}
                onClick={handleProcessCheckout}
              >
                {loading ? (
                  <>
                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Process Checkout
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CheckoutTab;
