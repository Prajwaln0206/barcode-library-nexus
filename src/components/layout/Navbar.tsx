
import React from 'react';
import { Link } from 'react-router-dom';
import { MoreVertical, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  return (
    <header className="w-full border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-40">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="flex"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <MoreVertical className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          <Link to="/" className="flex items-center gap-2">
            <span className="font-bold text-xl tracking-tight">LibraryOS</span>
          </Link>
        </div>
        
        <div className="hidden md:flex items-center gap-4 flex-1 px-6">
          <div className="relative flex-1 max-w-md">
            <Input
              type="search"
              placeholder="Search for books, users, or barcodes..."
              className="pl-8 bg-secondary/50 border-0 focus-visible:ring-1"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" className="hidden md:flex">
                <Plus className="mr-1 h-4 w-4" />
                Add New
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to="/books">
                  Add New Book
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/users">
                  Add New User
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/checkout">
                  New Checkout
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button variant="ghost" onClick={() => console.log('Logout clicked')}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
