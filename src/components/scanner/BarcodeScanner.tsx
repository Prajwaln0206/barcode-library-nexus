
import React from 'react';
import { useBarcodeScanner } from '@/hooks/useBarcodeScanner';
import { Scan, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
  enabled?: boolean;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ 
  onScan,
  enabled = true
}) => {
  const { isScanning, barcode } = useBarcodeScanner({
    onScan,
    enabled
  });
  
  return (
    <div className="space-y-2">
      {isScanning && (
        <Alert className="bg-amber-50 text-amber-800 border-amber-200">
          <Scan className="h-4 w-4 mr-2" />
          <AlertDescription className="flex items-center">
            Scanning: {barcode}
          </AlertDescription>
        </Alert>
      )}
      
      <div className="text-sm text-muted-foreground">
        {enabled ? (
          <p className="flex items-center">
            <Scan className="h-4 w-4 mr-1 text-green-500" />
            Barcode scanner ready. Scan a barcode to begin.
          </p>
        ) : (
          <p className="flex items-center">
            <AlertCircle className="h-4 w-4 mr-1 text-amber-500" />
            Barcode scanner disabled.
          </p>
        )}
      </div>
    </div>
  );
};

export default BarcodeScanner;
