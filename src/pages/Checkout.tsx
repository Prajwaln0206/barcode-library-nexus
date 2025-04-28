
import React, { useEffect } from 'react';
import PageTransition from '@/components/layout/PageTransition';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import CheckoutTab from '@/components/checkout/CheckoutTab';
import ReturnTab from '@/components/checkout/ReturnTab';
import LoadingState from '@/components/checkout/LoadingState';

const Checkout = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  // Redirect to auth page if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);
  
  // Show loading state while authentication is being checked
  if (authLoading) {
    return (
      <PageTransition>
        <LoadingState />
      </PageTransition>
    );
  }
  
  // Don't render anything if not logged in (will redirect)
  if (!user) {
    return null;
  }
  
  return (
    <PageTransition>
      <div className="space-y-8">
        <div>
          <h1 className="font-bold tracking-tight">Checkout & Return</h1>
          <p className="text-muted-foreground">Process book checkouts and returns.</p>
        </div>
        
        <Tabs defaultValue="checkout">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="checkout">Checkout</TabsTrigger>
            <TabsTrigger value="return">Return</TabsTrigger>
          </TabsList>
          
          <TabsContent value="checkout" className="space-y-6 mt-6">
            <CheckoutTab />
          </TabsContent>
          
          <TabsContent value="return" className="space-y-6 mt-6">
            <ReturnTab />
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  );
};

export default Checkout;
