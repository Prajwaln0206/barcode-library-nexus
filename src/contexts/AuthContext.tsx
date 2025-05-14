
import React, { createContext, useState, useEffect, useContext } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

// Define the list of authorized users
const AUTHORIZED_USERS = [
  "admin@ngo-library.com",
  "librarian@ngo-library.com"
];

type AuthContextType = {
  session: Session | null;
  user: User | null;
  signOut: () => Promise<void>;
  loading: boolean;
  isAuthorized: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, session?.user?.email);
        setSession(session);
        
        if (session?.user) {
          setUser(session.user);
          
          // Check if the user's email is in the authorized list
          const userEmail = session.user.email;
          const authorized = userEmail ? AUTHORIZED_USERS.includes(userEmail) : false;
          setIsAuthorized(authorized);
          
          if (!authorized) {
            // We'll handle unauthorized users more gracefully
            console.log("User not authorized:", userEmail);
            toast({
              variant: "destructive",
              title: "Access Denied",
              description: "You are not authorized to access this system."
            });
          }
        } else {
          setUser(null);
          setIsAuthorized(false);
        }
        
        setLoading(false);
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session check:", session?.user?.email);
      if (session?.user) {
        setUser(session.user);
        
        // Check if the user's email is in the authorized list
        const userEmail = session.user.email;
        const authorized = userEmail ? AUTHORIZED_USERS.includes(userEmail) : false;
        setIsAuthorized(authorized);
        
        if (!authorized) {
          console.log("Initial check: User not authorized:", userEmail);
          // We won't immediately sign them out - let the protected routes handle this
        }
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [toast]);

  const signOut = async () => {
    try {
      console.log("Signing out user");
      await supabase.auth.signOut();
      setIsAuthorized(false);
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value = {
    session,
    user,
    signOut,
    loading,
    isAuthorized
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
