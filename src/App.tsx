
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// Pages
import Index from "./pages/Index";
import Books from "./pages/Books";
import Users from "./pages/Users";
import Checkout from "./pages/Checkout";
import NotFound from "./pages/NotFound";

// Layout
import Shell from "./components/layout/Shell";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AnimatePresence>
          <Routes>
            <Route element={<Shell />}>
              <Route path="/" element={<Index />} />
              <Route path="/books" element={<Books />} />
              <Route path="/users" element={<Users />} />
              <Route path="/checkout" element={<Checkout />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
