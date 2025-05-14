
import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { 
  Drawer,
  DrawerContent,
} from "@/components/ui/drawer";

const Shell: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const closeSidebar = () => {
    setSidebarOpen(false);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 h-[calc(100vh-4rem)]">
        {/* Desktop sidebar */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <Sidebar isOpen={true} onClose={closeSidebar} />
        </div>
        
        {/* Mobile sidebar - using Drawer component */}
        <Drawer open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <DrawerContent className="p-0 max-h-[90vh]">
            <div className="md:hidden">
              <Sidebar isOpen={true} onClose={closeSidebar} />
            </div>
          </DrawerContent>
        </Drawer>
        
        <main className="flex-1 pt-6 px-4 md:px-6 pb-12 overflow-y-auto">
          <div className="container max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <Outlet key={location.pathname} />
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Shell;
