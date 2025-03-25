
import React from 'react';
import { Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="glass-card p-8 max-w-md text-center rounded-xl">
        <h1 className="text-6xl font-bold mb-2">404</h1>
        <p className="text-xl text-muted-foreground mb-6">Page not found</p>
        <p className="mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button asChild>
          <Link to="/">
            <Home className="mr-2 h-4 w-4" />
            Return Home
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
