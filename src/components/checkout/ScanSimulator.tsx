
import { supabase } from '@/integrations/supabase/client';
import { getBookByBarcode } from '@/services/BookService';
import { BookInfo } from '@/components/books/BookCard';
import { useToast } from '@/hooks/use-toast';

interface UseScanSimulatorProps {
  setBarcode: (barcode: string) => void;
  setLoading: (loading: boolean) => void;
  onBookScanned: (book: BookInfo) => void;
  setScanResult: (result: 'success' | 'error' | null) => void;
}

export const useScanSimulator = ({
  setBarcode,
  setLoading,
  onBookScanned,
  setScanResult
}: UseScanSimulatorProps) => {
  const { toast } = useToast();

  const simulateScan = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('books')
        .select('barcode')
        .limit(10);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.length);
        const randomBarcode = data[randomIndex].barcode;
        setBarcode(randomBarcode);
        
        setTimeout(async () => {
          const book = await getBookByBarcode(randomBarcode);
          if (book) {
            onBookScanned(book);
            setScanResult('success');
            
            toast({
              title: "Book found",
              description: `Successfully scanned "${book.title}"`,
            });
          }
          setLoading(false);
        }, 800);
      } else {
        toast({
          variant: "destructive",
          title: "No books found",
          description: "There are no books in the database to simulate scanning."
        });
        setLoading(false);
      }
    } catch (error) {
      console.error('Error in scan simulation:', error);
      toast({
        variant: "destructive",
        title: "Simulation error",
        description: "An error occurred during scan simulation."
      });
      setLoading(false);
    }
  };

  return { simulateScan };
};
