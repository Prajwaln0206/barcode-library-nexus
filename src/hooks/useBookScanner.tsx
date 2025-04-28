
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
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  const { processBarcode } = useBarcodeProcessor({
    onBookScanned,
    setLoading,
    setScanResult,
    setErrorMessage
  });
  
  const { simulateScan } = useScanSimulator({
    setBarcode,
    setLoading,
    onBookScanned,
    setScanResult
  });
  
  const handleBarcodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (barcode.trim()) {
      await processBarcode(barcode);
    }
  };
  
  const handleBarcodeScan = async (scannedBarcode: string) => {
    if (loading) return;
    
    setBarcode(scannedBarcode);
    await processBarcode(scannedBarcode);
  };
  
  const clearResults = () => {
    setBarcode('');
    setScanResult(null);
    setErrorMessage('');
  };
  
  return {
    barcode,
    setBarcode,
    scanResult,
    errorMessage,
    handleBarcodeSubmit,
    handleBarcodeScan,
    simulateScan,
    clearResults
  };
};
