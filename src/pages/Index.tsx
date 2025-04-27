import React from 'react';
import { BookOpen, Users, CheckSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import PageTransition from '@/components/layout/PageTransition';
import StatCard from '@/components/dashboard/StatCard';
import QuickActions from '@/components/dashboard/QuickActions';
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
            <QuickActions />
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Index;
