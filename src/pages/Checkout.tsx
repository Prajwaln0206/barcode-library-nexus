
import React, { useState } from 'react';
import { Scan, BookOpen, User, ArrowRight, Search } from 'lucide-react';
import PageTransition from '@/components/layout/PageTransition';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import BarcodeGenerator from '@/components/books/BarcodeGenerator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { validateBarcode } from '@/lib/barcodeUtils';
import { mockBooks, mockUsers } from '@/lib/data';

const Checkout = () => {
  const [barcode, setBarcode] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedBookId, setSelectedBookId] = useState('');
  const [scanResult, setScanResult] = useState<'success' | 'error' | null>(null);
  
  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if the barcode is valid
    if (validateBarcode(barcode)) {
      // Look up the book with this barcode
      const book = mockBooks.find(book => book.barcode === barcode);
      if (book) {
        setSelectedBookId(book.id);
        setScanResult('success');
      } else {
        setScanResult('error');
      }
    } else {
      setScanResult('error');
    }
  };
  
  const handleScanSimulation = () => {
    // In a real app, this would use a barcode scanner
    // For demo, we'll just pick a random book's barcode
    const randomIndex = Math.floor(Math.random() * mockBooks.length);
    const randomBook = mockBooks[randomIndex];
    setBarcode(randomBook.barcode);
    
    // Simulate scanning
    setTimeout(() => {
      setSelectedBookId(randomBook.id);
      setScanResult('success');
    }, 800);
  };
  
  const selectedBook = mockBooks.find(book => book.id === selectedBookId);
  const selectedUser = mockUsers.find(user => user.id === selectedUserId);
  
  const handleProcessCheckout = () => {
    console.log('Processing checkout:', { selectedBook, selectedUser });
    // In a real app, this would update the database
    setBarcode('');
    setSelectedBookId('');
    setSelectedUserId('');
    setScanResult(null);
  };
  
  return (
    <PageTransition>
      <div className="space-y-8">
        <div>
          <h1 className="font-bold tracking-tight">Checkout & Return</h1>
          <p className="text-muted-foreground">Process book checkouts and returns.</p>
        </div>
        
        <Tabs defaultValue="checkout">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="checkout">Checkout</TabsTrigger>
            <TabsTrigger value="return">Return</TabsTrigger>
          </TabsList>
          
          <TabsContent value="checkout" className="space-y-6 mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Left column - Barcode scanner */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Scan className="mr-2 h-5 w-5" />
                    Scan Book
                  </CardTitle>
                  <CardDescription>
                    Scan a book's barcode or enter it manually
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleBarcodeSubmit} className="space-y-4">
                    <div>
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Enter barcode..."
                          value={barcode}
                          onChange={(e) => setBarcode(e.target.value)}
                          className="flex-1"
                        />
                        <Button type="submit">Lookup</Button>
                      </div>
                      
                      <div className="mt-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleScanSimulation}
                          className="w-full"
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
                </CardContent>
              </Card>
              
              {/* Right column - Book details */}
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
                          <p>{selectedBook.isbn}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Genre:</span>
                          <p>{selectedBook.genre}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Location:</span>
                          <p>{selectedBook.location}</p>
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
            
            {/* User selection and checkout */}
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
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {mockUsers.map(user => (
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
                  
                  <div className="flex justify-end pt-4">
                    <Button
                      disabled={!selectedBook?.isAvailable || !selectedUserId}
                      onClick={handleProcessCheckout}
                    >
                      Process Checkout
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="return" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Scan className="mr-2 h-5 w-5" />
                  Scan Book for Return
                </CardTitle>
                <CardDescription>
                  Scan a book's barcode to process its return
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Enter barcode..."
                      value={barcode}
                      onChange={(e) => setBarcode(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit">Lookup</Button>
                  </div>
                  
                  <div className="pt-4 text-center text-muted-foreground">
                    <p>Return functionality would be implemented similarly to checkout.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  );
};

export default Checkout;
