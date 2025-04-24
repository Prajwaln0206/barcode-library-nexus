
import { useState } from 'react';
import { BookInfo } from '@/components/books/BookCard';
import { useBarcodeProcessor } from '@/components/checkout/BarcodeProcessor';
import { useScanSimulator } from '@/components/checkout/ScanSimulator';

interface UseBookScannerProps {
  onBookScanned: (book: BookInfo) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useBookScanner = ({
  onBookScanned,
  loading,
  setLoading
}: UseBookScannerProps) => {
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
  
  return {
    barcode,
    setBarcode,
    scanResult,
    handleBarcodeSubmit,
    handleBarcodeScan,
    simulateScan
  };
};

