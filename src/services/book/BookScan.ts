
import { supabase } from '@/integrations/supabase/client';

// Record a book scan in the scan_logs table
export const recordBookScan = async (
  bookId: string, 
  scanType: 'checkout' | 'return' | 'inventory'
): Promise<void> => {
  try {
    const { data: session } = await supabase.auth.getSession();
    const userId = session.session?.user?.id;
    
    // Create a scan log object
    const scanLog = {
      book_id: bookId,
      scan_type: scanType,
      // We need to provide a scanned_by value that's not undefined
      // If no user ID available, use a default placeholder
      scanned_by: userId || '00000000-0000-0000-0000-000000000000'
    };
    
    // First attempt - try with the user ID if available
    const { error } = await supabase
      .from('scan_logs')
      .insert(scanLog);
    
    // If there's an error and it's related to the foreign key constraint on scanned_by
    if (error && error.code === '23503' && error.message?.includes('scan_logs_scanned_by_fkey')) {
      console.log('Foreign key constraint error for scanned_by, trying without user association');
      
      // Try to create a scan log without associating it with a specific user
      // Use the raw function call to bypass TypeScript constraints
      const { error: rpcError } = await supabase.rpc(
        // @ts-ignore - Typescript doesn't know about this RPC function
        'log_scan_without_user',
        {
          p_book_id: bookId,
          p_scan_type: scanType
        }
      );

      if (rpcError) {
        console.error('Error in log_scan_without_user RPC call:', rpcError);
      }
    } else if (error) {
      console.error('Error recording scan:', error);
      // Just log the error but don't throw it to prevent blocking UI
    }
  } catch (error) {
    console.error('Exception in recordBookScan:', error);
    // Just log the error but don't throw it to prevent blocking UI
  }
};
