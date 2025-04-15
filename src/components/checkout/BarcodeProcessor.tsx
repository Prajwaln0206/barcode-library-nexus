
import { BookInfo } from '@/components/books/BookCard';
import { validateBarcode } from '@/lib/barcodeUtils';
import { getBookByBarcode } from '@/services/BookService';
import { useToast } from '@/hooks/use-toast';

interface UseBarcodeProcessorProps {
  onBookScanned: (book: BookInfo) => void;
  setLoading: (loading: boolean) => void;
  setScanResult: (result: 'success' | 'error' | null) => void;
}

export const useBarcodeProcessor = ({
  onBookScanned,
  setLoading,
  setScanResult
}: UseBarcodeProcessorProps) => {
  const { toast } = useToast();

  const processBarcode = async (barcode: string) => {
    if (!barcode) return;
    
    setLoading(true);
    
    try {
      if (validateBarcode(barcode)) {
        const book = await getBookByBarcode(barcode);
        
        if (book) {
          onBookScanned(book);
          setScanResult('success');
          
          toast({
            title: "Book found",
            description: `Successfully scanned "${book.title}"`,
          });
        } else {
          setScanResult('error');
          toast({
            variant: "destructive",
            title: "Book not found",
            description: "No book with this barcode exists in the system."
          });
        }
      } else {
        setScanResult('error');
        toast({
          variant: "destructive",
          title: "Invalid barcode",
          description: "The barcode format is not valid."
        });
      }
    } catch (error) {
      console.error('Error scanning barcode:', error);
      setScanResult('error');
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
