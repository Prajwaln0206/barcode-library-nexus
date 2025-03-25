
import React, { useRef, useState } from 'react';
import { AlertCircle, ArrowDown, Clipboard, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { generateBarcode } from '@/lib/barcodeUtils';

interface BarcodeGeneratorProps {
  value: string;
  title?: string;
  onDownload?: () => void;
}

const BarcodeGenerator: React.FC<BarcodeGeneratorProps> = ({ 
  value, 
  title,
  onDownload 
}) => {
  const [copied, setCopied] = useState(false);
  const barcodeRef = useRef<HTMLDivElement>(null);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const printBarcode = () => {
    if (barcodeRef.current) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Print Barcode</title>
              <style>
                body { font-family: system-ui, sans-serif; margin: 0; padding: 20px; }
                .barcode-container { text-align: center; }
                .barcode-value { margin-top: 8px; font-family: monospace; }
              </style>
            </head>
            <body>
              <div class="barcode-container">
                ${title ? `<h2>${title}</h2>` : ''}
                ${barcodeRef.current.innerHTML}
                <div class="barcode-value">${value}</div>
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      }
    }
  };
  
  return (
    <div className="space-y-4">
      {!value && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            No value provided for barcode generation.
          </AlertDescription>
        </Alert>
      )}
      
      <div 
        ref={barcodeRef}
        className="p-6 bg-white flex items-center justify-center rounded-lg border"
      >
        {value ? (
          <div dangerouslySetInnerHTML={{ __html: generateBarcode(value) }} />
        ) : (
          <div className="h-16 flex items-center justify-center text-muted-foreground">
            No barcode to display
          </div>
        )}
      </div>
      
      <div className="flex gap-2">
        <Button 
          size="sm" 
          variant="outline" 
          className="flex-1"
          onClick={copyToClipboard}
          disabled={!value}
        >
          <Clipboard className="mr-2 h-4 w-4" />
          {copied ? "Copied!" : "Copy value"}
        </Button>
        
        <Button 
          size="sm" 
          variant="outline" 
          className="flex-1"
          onClick={printBarcode}
          disabled={!value}
        >
          <Printer className="mr-2 h-4 w-4" />
          Print
        </Button>
        
        {onDownload && (
          <Button 
            size="sm" 
            variant="outline" 
            className="flex-1"
            onClick={onDownload}
            disabled={!value}
          >
            <ArrowDown className="mr-2 h-4 w-4" />
            Download
          </Button>
        )}
      </div>
    </div>
  );
};

export default BarcodeGenerator;
