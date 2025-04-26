
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  useEffect(() => {
    // If user is already logged in, redirect to home page
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please enter both email and password."
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      // Verify if the user is an authorized user
      const { data: authorizedData, error: authorizedError } = await supabase
        .from('authorized_users')
        .select('*')
        .eq('id', data.user.id);
      
      if (authorizedError) {
        console.error("Error checking authorized users:", authorizedError);
      }
      
      if (!authorizedData || authorizedData.length === 0) {
        await supabase.auth.signOut();
        throw new Error("You are not authorized to access this system.");
      }
      
      toast({
        title: "Login successful",
        description: "Welcome back!"
      });
      
      navigate('/');
      
    } catch (error) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred."
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please enter both email and password."
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      // Check if there are any existing authorized users
      const { count, error: countError } = await supabase
        .from('authorized_users')
        .select('*', { count: 'exact', head: true });
      
      if (countError) {
        console.error("Error checking authorized users count:", countError);
      }
      
      // If this is the first user, automatically make them an admin
      if (count === 0) {
        const { error: insertError } = await supabase
          .from('authorized_users')
          .insert({
            id: data.user!.id,
            email: email,
            role: 'admin'
          });
        
        if (insertError) {
          console.error("Error creating admin user:", insertError);
          throw new Error("Failed to create admin user.");
        }
        
        toast({
          title: "Admin account created",
          description: "You have been registered as the first admin of the system."
        });
        
        // No need to explicitly navigate as the auth state change will redirect
      } else {
        // For subsequent users, they need to be approved by an admin
        toast({
          variant: "default",
          title: "Registration request submitted",
          description: "Your request has been submitted. Please contact an administrator for access approval."
        });
        
        // Sign out since they need approval
        await supabase.auth.signOut();
      }
      
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred."
      });
    } finally {
      setLoading(false);
    }
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4 sm:p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">NGO Library System</CardTitle>
            <CardDescription>
              {activeTab === 'login' ? 'Sign in to your account' : 'Create a new account'}
            </CardDescription>
          </CardHeader>
          
          <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="youremail@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium">
                      Password
                    </label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="current-password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={togglePasswordVisibility}
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                        <span className="sr-only">Toggle password visibility</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></span>
                        Signing in...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <LogIn className="h-4 w-4 mr-2" />
                        Sign in
                      </span>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleSignUp}>
                <CardContent className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <label htmlFor="register-email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="youremail@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="register-password" className="text-sm font-medium">
                      Password
                    </label>
                    <div className="relative">
                      <Input
                        id="register-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="new-password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={togglePasswordVisibility}
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                        <span className="sr-only">Toggle password visibility</span>
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground text-sm">
                    The first user to register will automatically be granted admin access.
                    Subsequent users will need approval from an admin.
                  </p>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></span>
                        Creating account...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Create account
                      </span>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </motion.div>
    </div>
  );
};

export default Auth;
