
import { BookInfo } from '@/components/books/BookCard';
import { validateBarcode } from '@/lib/barcodeUtils';
import { getBookByBarcode } from '@/services/BookService';
import { useToast } from '@/hooks/use-toast';

interface UseBarcodeProcessorProps {
  onBookScanned: (book: BookInfo) => void;
  setLoading: (loading: boolean) => void;
  setScanResult: (result: 'success' | 'error' | null) => void;
  setErrorMessage?: (message: string) => void;
}

export const useBarcodeProcessor = ({
  onBookScanned,
  setLoading,
  setScanResult,
  setErrorMessage = () => {}
}: UseBarcodeProcessorProps) => {
  const { toast } = useToast();

  const processBarcode = async (barcode: string) => {
    if (!barcode) return;
    
    setLoading(true);
    setScanResult(null);
    
    try {
      // First check if the barcode has at least prefix-id-checksum structure
      const parts = barcode.split('-');
      if (parts.length < 3) {
        setScanResult('error');
        const errorMsg = 'Barcode must have at least 3 parts separated by hyphens (PREFIX-ID-CHECKSUM)';
        setErrorMessage(errorMsg);
        toast({
          variant: "destructive",
          title: "Invalid barcode format",
          description: errorMsg
        });
        setLoading(false);
        return;
      }
      
      // Check if the checksum part is a number
      const checksumPart = parts[parts.length - 1];
      if (!/^\d{1,2}$/.test(checksumPart)) {
        setScanResult('error');
        const errorMsg = 'The last part of the barcode must be a 1-2 digit checksum number';
        setErrorMessage(errorMsg);
        toast({
          variant: "destructive",
          title: "Invalid checksum",
          description: errorMsg
        });
        setLoading(false);
        return;
      }
      
      // Check if it's a valid barcode according to our validation logic
      if (validateBarcode(barcode)) {
        const book = await getBookByBarcode(barcode);
        
        if (book) {
          onBookScanned(book);
          setScanResult('success');
          setErrorMessage('');
          
          toast({
            title: "Book found",
            description: `Successfully scanned "${book.title}"`,
          });
        } else {
          setScanResult('error');
          setErrorMessage('No book with this barcode exists in the system');
          toast({
            variant: "destructive",
            title: "Book not found",
            description: "No book with this barcode exists in the system."
          });
        }
      } else {
        setScanResult('error');
        setErrorMessage('The barcode format is correct, but the checksum is invalid');
        toast({
          variant: "destructive",
          title: "Invalid barcode",
          description: "The barcode format appears correct, but the checksum is invalid."
        });
      }
    } catch (error) {
      console.error('Error scanning barcode:', error);
      setScanResult('error');
      setErrorMessage('An error occurred while scanning the barcode');
      toast({
        variant: "destructive",
        title: "Scan error",
        description: "An error occurred while scanning the barcode."
      });
    } finally {
      setLoading(false);
    }
  };

  return { processBarcode };
};
