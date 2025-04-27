
import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, CheckSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import PageTransition from '@/components/layout/PageTransition';
import StatCard from '@/components/dashboard/StatCard';
import { dashboardStats } from '@/lib/data';

const staggerDelay = 0.1;

const Index = () => {
  return (
    <PageTransition>
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">NGO Library Management System</h1>
          <p className="text-muted-foreground">Manage your library resources efficiently</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: staggerDelay * 0 }}
          >
            <StatCard
              title="Books in Library"
              value={dashboardStats.totalBooks}
              icon={<BookOpen className="h-5 w-5 text-primary" />}
              description="Total books available in the system"
              trend={{ value: 4.3, isPositive: true }}
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: staggerDelay * 1 }}
          >
            <StatCard
              title="Active Members"
              value={dashboardStats.activeMembers}
              icon={<Users className="h-5 w-5 text-emerald-500" />}
              description="Current active library members"
              trend={{ value: 2.1, isPositive: true }}
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: staggerDelay * 2 }}
          >
            <StatCard
              title="Books Checked Out"
              value={dashboardStats.booksCheckedOut}
              icon={<CheckSquare className="h-5 w-5 text-blue-500" />}
              description="Books currently borrowed"
              trend={{ value: 1.2, isPositive: true }}
            />
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: staggerDelay * 4 }}
          >
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
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Index;
