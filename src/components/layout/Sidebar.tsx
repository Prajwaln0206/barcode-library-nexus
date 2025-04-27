
import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BookOpen, Users, BarChart2, Library, Bookmark, CheckSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
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
  ];
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && isOpen) {
        onClose();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen, onClose]);

  return (
    <aside
      className={cn(
        "w-64 bg-sidebar border-r border-sidebar-border h-full",
        "z-50"
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
                onClick={() => {
                  if (window.innerWidth < 768) {
                    onClose();
                  }
                }}
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
          </nav>
        </ScrollArea>
      </div>
    </aside>
  );
};

export default Sidebar;
