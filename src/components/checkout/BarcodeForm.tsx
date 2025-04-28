
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import BarcodeGenerator from '@/components/books/BarcodeGenerator';
import { AlertCircle } from 'lucide-react';

interface BarcodeFormProps {
  barcode: string;
  setBarcode: (barcode: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  loading: boolean;
  scanResult: 'success' | 'error' | null;
  errorMessage?: string;
}

const BarcodeForm: React.FC<BarcodeFormProps> = ({
  barcode,
  setBarcode,
  onSubmit,
  loading,
  scanResult,
  errorMessage = 'Invalid barcode or book not found.'
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <div className="flex space-x-2">
          <Input
            placeholder="Enter barcode... (e.g. LIB-123456-42)"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            className="flex-1"
            disabled={loading}
          />
          <Button type="submit" disabled={loading || !barcode.trim()}>Lookup</Button>
        </div>
        
        {scanResult === 'error' && (
          <div className="flex items-center text-sm text-destructive mt-2">
            <AlertCircle className="h-4 w-4 mr-1" />
            <p>{errorMessage}</p>
          </div>
        )}
        
        <div className="text-xs text-muted-foreground mt-1">
          Format: PREFIX-ID-CHECKSUM (e.g. LIB-123456-42)
        </div>
      </div>
      
      {barcode && (
        <div className="pt-2">
          <BarcodeGenerator value={barcode} />
        </div>
      )}
    </form>
  );
};

export default BarcodeForm;
