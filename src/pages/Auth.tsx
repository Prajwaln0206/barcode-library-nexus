
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AuthCard } from '@/components/auth/AuthCard';

// Define the list of authorized users - same as in AuthContext
const AUTHORIZED_USERS = [
  "admin@ngo-library.com",
  "librarian@ngo-library.com"
];

const Auth = () => {
  const navigate = useNavigate();
  const { user, isAuthorized } = useAuth();
  
  useEffect(() => {
    console.log("Auth page render:", { user: !!user, isAuthorized });
    // If user is already logged in and authorized, redirect to home page
    if (user && isAuthorized) {
      console.log("User is authorized, redirecting to home");
      navigate('/', { replace: true });
    }
  }, [user, isAuthorized, navigate]);
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4 sm:p-6">
      <AuthCard authorizedUsers={AUTHORIZED_USERS} />
    </div>
  );
};

export default Auth;
