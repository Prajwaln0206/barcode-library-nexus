
import React, { useState } from 'react';
import { Scan, Info, Clock, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { validateBarcode } from '@/lib/barcodeUtils';
import { BookInfo } from '@/components/books/BookCard';
import { supabase } from '@/integrations/supabase/client';
import { getBookByBarcode, recordBookScan } from '@/services/BookService';
import { useToast } from '@/hooks/use-toast';
import BarcodeScanner from '@/components/scanner/BarcodeScanner';

const ReturnTab: React.FC = () => {
  const [barcode, setBarcode] = useState('');
  const [scanResult, setScanResult] = useState<'success' | 'error' | null>(null);
  const [selectedBook, setSelectedBook] = useState<BookInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const handleBarcodeSubmit = async () => {
    if (loading) return;
    
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
  
  const handleProcessReturn = async () => {
    if (!selectedBook) return;
    
    try {
      setLoading(true);
      
      if (selectedBook.isAvailable) {
        toast({
          variant: "destructive",
          title: "Book not checked out",
          description: "This book is not currently checked out."
        });
        return;
      }
      
      const { data: loans, error: loanFetchError } = await supabase
        .from('loans')
        .select('*')
        .eq('book_id', selectedBook.id)
        .eq('status', 'active')
        .limit(1);
      
      if (loanFetchError) throw loanFetchError;
      
      if (!loans || loans.length === 0) {
        toast({
          variant: "destructive",
          title: "No active loan found",
          description: "No active loan record was found for this book."
        });
        return;
      }
      
      const { error: loanUpdateError } = await supabase
        .from('loans')
        .update({ 
          status: 'returned',
          return_date: new Date().toISOString()
        })
        .eq('id', loans[0].id);
      
      if (loanUpdateError) throw loanUpdateError;
      
      const { error: bookError } = await supabase
        .from('books')
        .update({ status: 'available' })
        .eq('id', selectedBook.id);
      
      if (bookError) throw bookError;
      
      await recordBookScan(selectedBook.id, 'return');
      
      toast({
        title: "Return successful",
        description: `"${selectedBook.title}" has been returned.`,
      });
      
      setBarcode('');
      setSelectedBook(null);
      setScanResult(null);
    } catch (error) {
      console.error('Error processing return:', error);
      toast({
        variant: "destructive",
        title: "Return failed",
        description: "An error occurred while processing the return."
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
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
          
          <div className="flex space-x-2">
            <Input
              placeholder="Enter barcode..."
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              className="flex-1"
              disabled={loading}
            />
            <Button type="button" onClick={handleBarcodeSubmit} disabled={loading}>Lookup</Button>
          </div>
          
          {selectedBook && (
            <div className="mt-4 border rounded-lg p-4">
              <h3 className="font-medium">{selectedBook.title}</h3>
              <p className="text-sm text-muted-foreground">by {selectedBook.author}</p>
              
              <div className="mt-3 flex items-center">
                <div className={`px-2 py-1 text-xs rounded-full ${
                  selectedBook.isAvailable 
                    ? "bg-emerald-100 text-emerald-800" 
                    : "bg-rose-100 text-rose-800"
                }`}>
                  {selectedBook.isAvailable ? "Available" : "Checked Out"}
                </div>
              </div>
              
              {selectedBook.isAvailable ? (
                <div className="mt-3 flex items-center text-sm text-amber-600 bg-amber-50 p-2 rounded">
                  <Info className="h-4 w-4 mr-2" />
                  This book is not checked out and doesn't need to be returned.
                </div>
              ) : (
                <Button 
                  className="mt-4 w-full" 
                  onClick={handleProcessReturn}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Clock className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Process Return
                    </>
                  )}
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReturnTab;
