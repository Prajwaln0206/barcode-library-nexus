
// Re-export from the UI components
import { useToast as useShadcnToast, toast as shadcnToast } from "@/components/ui/toast";

// Export the hooks with the same names
export const useToast = useShadcnToast;
export const toast = shadcnToast;
