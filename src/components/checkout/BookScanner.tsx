
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Scan, Zap } from 'lucide-react';
import BarcodeScanner from '@/components/scanner/BarcodeScanner';
import { BookInfo } from '@/components/books/BookCard';
import BarcodeForm from './BarcodeForm';
import { useBookScanner } from '@/hooks/useBookScanner';
import { Button } from '@/components/ui/button';

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
  const {
    barcode,
    setBarcode,
    scanResult,
    errorMessage,
    handleBarcodeSubmit,
    handleBarcodeScan,
    simulateScan,
    clearResults
  } = useBookScanner({
    onBookScanned,
    loading,
    setLoading
  });
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center">
              <Scan className="mr-2 h-5 w-5" />
              Scan Book
            </CardTitle>
            <CardDescription>
              Use a barcode scanner or enter barcode manually
            </CardDescription>
          </div>
          <Button 
            size="sm" 
            variant="secondary"
            onClick={simulateScan}
            disabled={loading}
            className="bg-green-100 hover:bg-green-200 text-green-700 border border-green-300"
          >
            <Zap className="h-4 w-4 mr-2" />
            Test Scan
          </Button>
        </div>
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
          
          <BarcodeForm
            barcode={barcode}
            setBarcode={setBarcode}
            onSubmit={handleBarcodeSubmit}
            loading={loading}
            scanResult={scanResult}
            errorMessage={errorMessage}
          />
          
          {scanResult && (
            <div className="flex justify-end">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearResults}
                className="text-xs"
              >
                Clear
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BookScanner;
