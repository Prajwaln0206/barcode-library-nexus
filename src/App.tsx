
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Pages
import Index from "./pages/Index";
import Books from "./pages/Books";
import Users from "./pages/Users";
import Checkout from "./pages/Checkout";
import Categories from "./pages/Categories";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";

// Layout
import Shell from "./components/layout/Shell";

// Auth Context
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, isAuthorized } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (!user || !isAuthorized) {
    return <Navigate to="/auth" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route element={
          <ProtectedRoute>
            <Shell />
          </ProtectedRoute>
        }>
          <Route path="/" element={<Index />} />
          <Route path="/books" element={<Books />} />
          <Route path="/users" element={<Users />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <Toaster />
      <Sonner />
    </BrowserRouter>
  );
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
