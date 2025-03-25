
import React from 'react';
import { BookOpen, Users, CheckSquare, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import PageTransition from '@/components/layout/PageTransition';
import StatCard from '@/components/dashboard/StatCard';
import RecentActivity from '@/components/dashboard/RecentActivity';
import { dashboardStats, mockActivities } from '@/lib/data';

const staggerDelay = 0.1;

const Index = () => {
  return (
    <PageTransition>
      <div className="space-y-8">
        <div>
          <h1 className="font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to the Library Management System.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: staggerDelay * 0 }}
          >
            <StatCard
              title="Total Books"
              value={dashboardStats.totalBooks}
              icon={<BookOpen className="h-5 w-5 text-primary" />}
              trend={{ value: 4.3, isPositive: true }}
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: staggerDelay * 1 }}
          >
            <StatCard
              title="Books Checked Out"
              value={dashboardStats.booksCheckedOut}
              icon={<CheckSquare className="h-5 w-5 text-amber-500" />}
              trend={{ value: 2.1, isPositive: true }}
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: staggerDelay * 2 }}
          >
            <StatCard
              title="Total Members"
              value={dashboardStats.totalMembers}
              icon={<Users className="h-5 w-5 text-emerald-500" />}
              trend={{ value: 1.2, isPositive: true }}
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: staggerDelay * 3 }}
          >
            <StatCard
              title="Active Members"
              value={dashboardStats.activeMembers}
              icon={<UserPlus className="h-5 w-5 text-blue-500" />}
              trend={{ value: 0.8, isPositive: false }}
            />
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: staggerDelay * 4 }}
          >
            <RecentActivity activities={mockActivities} />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: staggerDelay * 5 }}
          >
            <div className="glass-card rounded-xl p-6 h-full">
              <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <a href="/books" className="block p-4 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors">
                  <h4 className="font-medium">Manage Books</h4>
                  <p className="text-sm text-muted-foreground">Add, edit, or remove books from the system</p>
                </a>
                <a href="/users" className="block p-4 rounded-lg bg-accent hover:bg-accent/80 transition-colors">
                  <h4 className="font-medium">Manage Users</h4>
                  <p className="text-sm text-muted-foreground">Handle user registrations and permissions</p>
                </a>
                <a href="/checkout" className="block p-4 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors">
                  <h4 className="font-medium">Checkout & Return</h4>
                  <p className="text-sm text-muted-foreground">Process book checkouts and returns</p>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Index;
