
import React from 'react';
import { Scan } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import BarcodeGenerator from '@/components/books/BarcodeGenerator';

interface BarcodeFormProps {
  barcode: string;
  setBarcode: (barcode: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onSimulateScan: () => Promise<void>;
  loading: boolean;
  scanResult: 'success' | 'error' | null;
}

const BarcodeForm: React.FC<BarcodeFormProps> = ({
  barcode,
  setBarcode,
  onSubmit,
  onSimulateScan,
  loading,
  scanResult
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
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
            onClick={onSimulateScan}
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
  );
};

export default BarcodeForm;
