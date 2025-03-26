
import React from 'react';
import { BarChart2 } from 'lucide-react';
import PageTransition from '@/components/layout/PageTransition';

const Reports = () => {
  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-3 rounded-full">
              <BarChart2 className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>
        
        <div className="grid gap-6">
          <div className="rounded-lg border bg-card text-card-foreground shadow">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Library Reports</h2>
              <p className="text-muted-foreground">
                View and generate library reports here. This page is currently under development.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Reports;
