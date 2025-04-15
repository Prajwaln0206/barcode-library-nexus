
import React, { useState } from 'react';
import { Scan, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import BarcodeGenerator from '@/components/books/BarcodeGenerator';
import BarcodeScanner from '@/components/scanner/BarcodeScanner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { validateBarcode } from '@/lib/barcodeUtils';
import { supabase } from '@/integrations/supabase/client';
import { getBookByBarcode } from '@/services/BookService';
import { useToast } from '@/hooks/use-toast';
import { BookInfo } from '@/components/books/BookCard';

interface BookScannerProps {
  onBookScanned: (book: BookInfo) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const BookScanner: React.FC<BookScannerProps> = ({
  onBookScanned,
  loading,
  setLoading
}) => {
  const [barcode, setBarcode] = useState('');
  const [scanResult, setScanResult] = useState<'success' | 'error' | null>(null);
  const { toast } = useToast();
  
  const handleBarcodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    
    try {
      if (validateBarcode(barcode)) {
        const book = await getBookByBarcode(barcode);
        
        if (book) {
          onBookScanned(book);
          setScanResult('success');
          
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
          onBookScanned(book);
          setScanResult('success');
          
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
            onBookScanned(book);
            setScanResult('success');
            
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
  
  return (
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
  );
};

export default BookScanner;
