
import { useState, useEffect, useCallback } from 'react';

type UseBarcodeOptions = {
  // Time in ms to determine if input is from scanner (scanners are fast)
  scanSpeed?: number;
  // Function to call when a barcode is detected
  onScan?: (barcode: string) => void;
  // Minimum barcode length
  minLength?: number;
  // Enable/disable the scanner
  enabled?: boolean;
}

/**
 * Hook to listen for barcode scanner input
 * Barcode scanners typically send input very quickly and end with Enter key
 */
export const useBarcodeScanner = ({
  scanSpeed = 50, // Default scan speed threshold (ms between keypresses)
  onScan,
  minLength = 5,
  enabled = true
}: UseBarcodeOptions = {}) => {
  const [barcode, setBarcode] = useState<string>('');
  const [lastCharTime, setLastCharTime] = useState<number>(0);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  
  // Handle keydown events for barcode input
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;
    
    const currentTime = new Date().getTime();
    
    // If we've waited too long since the last character, start a new barcode
    if (currentTime - lastCharTime > scanSpeed * 3) {
      setBarcode('');
    }
    
    // Update the last character time
    setLastCharTime(currentTime);
    
    // If this is the first character, indicate scanning has started
    if (!isScanning) {
      setIsScanning(true);
    }
    
    // Handle Enter key as the end of barcode input
    if (event.key === 'Enter') {
      if (barcode.length >= minLength) {
        console.log('Scanned barcode:', barcode);
        onScan?.(barcode);
      }
      setBarcode('');
      setIsScanning(false);
      // Prevent form submission if within a form
      event.preventDefault();
      return;
    }
    
    // Only accept printable characters
    if (event.key.length === 1) {
      setBarcode(prev => prev + event.key);
    }
  }, [barcode, lastCharTime, isScanning, scanSpeed, onScan, minLength, enabled]);
  
  useEffect(() => {
    // Add and remove event listeners
    if (enabled) {
      window.addEventListener('keydown', handleKeyDown);
    }
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, enabled]);
  
  return {
    barcode,
    isScanning,
    setBarcode
  };
};
