
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
      // First check if the barcode has the expected format
      if (!barcode.includes('-') || barcode.split('-').length !== 3) {
        setScanResult('error');
        const errorMsg = 'Invalid barcode format. Expected format: PREFIX-ID-CHECKSUM';
        setErrorMessage(errorMsg);
        toast({
          variant: "destructive",
          title: "Invalid barcode format",
          description: "The barcode must be in the format: PREFIX-ID-CHECKSUM"
        });
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
        setErrorMessage('The barcode checksum is invalid');
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
