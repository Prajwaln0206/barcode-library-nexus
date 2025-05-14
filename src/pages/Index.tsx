
import React, { useEffect, useState, useCallback } from 'react';
import { BookOpen, Users, CheckSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import PageTransition from '@/components/layout/PageTransition';
import StatCard from '@/components/dashboard/StatCard';
import QuickActions from '@/components/dashboard/QuickActions';
import { DashboardStats, getDashboardStats } from '@/services/StatsService';
import { useToast } from '@/components/ui/use-toast';

const staggerDelay = 0.1;

const Index = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();
  
  // Add a refresh trigger for the dashboard
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Force a refresh every 30 seconds to keep dashboard up to date
  useEffect(() => {
    const intervalId = setInterval(() => {
      setRefreshTrigger(prev => prev + 1);
    }, 30000); // 30 seconds
    
    return () => clearInterval(intervalId);
  }, []);

  const fetchDashboardStats = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch dashboard statistics',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats, refreshTrigger]); // Now depends on refreshTrigger

  // Manual refresh function that can be called directly
  const handleManualRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <PageTransition>
      <div className="space-y-8 mb-10">
        <div className="space-y-2 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">NGO Library Management System</h1>
            <p className="text-muted-foreground">Manage your library resources efficiently</p>
          </div>
          <button 
            onClick={handleManualRefresh}
            className="text-xs text-primary hover:underline"
          >
            Refresh Dashboard
          </button>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[0, 1, 2].map((index) => (
              <div key={index} className="glass-card rounded-xl p-6 animate-pulse">
                <div className="h-6 w-1/3 bg-muted rounded mb-2"></div>
                <div className="h-8 w-1/4 bg-muted rounded mb-4"></div>
                <div className="h-4 w-2/3 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: staggerDelay * 0 }}
            >
              <StatCard
                title="Books in Library"
                value={stats?.totalBooks || 0}
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
                value={stats?.activeMembers || 0}
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
                value={stats?.booksCheckedOut || 0}
                icon={<CheckSquare className="h-5 w-5 text-blue-500" />}
                description="Books currently borrowed"
                trend={{ value: 1.2, isPositive: true }}
              />
            </motion.div>
          </div>
        )}
        
        <div className="grid grid-cols-1 gap-6">
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
