
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BookOpen, Users, BarChart2, Settings, LogOut, Library, Bookmark, CheckSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navItems = [
    { path: '/', label: 'Dashboard', icon: <Home className="h-4 w-4" /> },
    { path: '/books', label: 'Books', icon: <BookOpen className="h-4 w-4" /> },
    { path: '/users', label: 'Users', icon: <Users className="h-4 w-4" /> },
    { path: '/checkout', label: 'Checkout', icon: <CheckSquare className="h-4 w-4" /> },
    { path: '/categories', label: 'Categories', icon: <Bookmark className="h-4 w-4" /> },
    { path: '/reports', label: 'Reports', icon: <BarChart2 className="h-4 w-4" /> },
    { path: '/settings', label: 'Settings', icon: <Settings className="h-4 w-4" /> },
  ];
  
  return (
    <>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="h-16 flex items-center px-4 border-b border-sidebar-border/50">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary text-primary-foreground">
                <Library className="h-4 w-4" />
              </div>
              <span className="font-semibold text-lg">LibraryOS</span>
            </div>
          </div>
          
          <ScrollArea className="flex-1 px-2 py-4">
            <nav className="space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                    )
                  }
                  onClick={onClose}
                >
                  {item.icon}
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </ScrollArea>
          
          <div className="border-t border-sidebar-border/50 p-4">
            <Button variant="outline" size="sm" className="w-full justify-start text-sidebar-foreground">
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </Button>
          </div>
        </div>
      </aside>
      
      {/* Overlay for mobile view */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}
    </>
  );
};

export default Sidebar;
