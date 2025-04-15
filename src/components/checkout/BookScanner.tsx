
import React, { useState } from 'react';
import { Scan } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import BarcodeScanner from '@/components/scanner/BarcodeScanner';
import { BookInfo } from '@/components/books/BookCard';
import BarcodeForm from './BarcodeForm';
import { useBarcodeProcessor } from './BarcodeProcessor';
import { useScanSimulator } from './ScanSimulator';

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
  
  const { processBarcode } = useBarcodeProcessor({
    onBookScanned,
    setLoading,
    setScanResult
  });
  
  const { simulateScan } = useScanSimulator({
    setBarcode,
    setLoading,
    onBookScanned,
    setScanResult
  });
  
  const handleBarcodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await processBarcode(barcode);
  };
  
  const handleBarcodeScan = async (scannedBarcode: string) => {
    if (loading) return;
    
    setBarcode(scannedBarcode);
    await processBarcode(scannedBarcode);
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
          
          <BarcodeForm
            barcode={barcode}
            setBarcode={setBarcode}
            onSubmit={handleBarcodeSubmit}
            onSimulateScan={simulateScan}
            loading={loading}
            scanResult={scanResult}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default BookScanner;
