
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

interface AuthCardProps {
  authorizedUsers: string[];
}

export const AuthCard: React.FC<AuthCardProps> = ({ authorizedUsers }) => {
  const [activeTab, setActiveTab] = React.useState('login');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  return (
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
        
        <Alert className="mx-6 mb-4">
          <AlertDescription className="text-sm">
            This system is restricted to authorized personnel only.
            <br />
            Authorized emails: {authorizedUsers.join(", ")}
          </AlertDescription>
        </Alert>
        
        <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <LoginForm 
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              authorizedUsers={authorizedUsers}
            />
          </TabsContent>
          
          <TabsContent value="register">
            <RegisterForm
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              authorizedUsers={authorizedUsers}
              onRegistrationSuccess={() => setActiveTab('login')}
            />
          </TabsContent>
        </Tabs>
      </Card>
    </motion.div>
  );
};
