
import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, CheckSquare } from 'lucide-react';

const QuickActions = () => {
  return (
    <div className="glass-card rounded-xl p-6 h-full">
      <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
      <div className="space-y-3">
        <Link 
          to="/books" 
          className="block p-4 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
        >
          <h3 className="font-medium flex items-center">
            <BookOpen className="h-4 w-4 mr-2" />
            Manage Books
          </h3>
          <p className="text-sm text-muted-foreground mt-1">Add or manage library books</p>
        </Link>
        
        <Link 
          to="/checkout" 
          className="block p-4 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
        >
          <h3 className="font-medium flex items-center">
            <CheckSquare className="h-4 w-4 mr-2" />
            Checkout & Return
          </h3>
          <p className="text-sm text-muted-foreground mt-1">Process book loans and returns</p>
        </Link>
      </div>
    </div>
  );
};

export default QuickActions;
