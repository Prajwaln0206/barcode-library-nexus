
import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const { signOut } = useAuth();

  return (
    <header className="w-full border-b border-border/40 bg-background/95 backdrop-blur-md sticky top-0 z-40">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleSidebar}
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          
          <Link to="/" className="flex items-center gap-2">
            <span className="font-bold text-xl tracking-tight">NGO Library System</span>
          </Link>
        </div>
        
        <div className="hidden md:flex items-center gap-4 flex-1 px-6">
          <div className="relative flex-1 max-w-md">
            <Input
              type="search"
              placeholder="Search books by title, author, or barcode..."
              className="pl-4 bg-background/50 border-border/50 focus-visible:ring-1"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={signOut}>
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
