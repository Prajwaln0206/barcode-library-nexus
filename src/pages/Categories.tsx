
import React from 'react';
import { Bookmark } from 'lucide-react';
import PageTransition from '@/components/layout/PageTransition';

const Categories = () => {
  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-3 rounded-full">
              <Bookmark className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>
        
        <div className="grid gap-6">
          <div className="rounded-lg border bg-card text-card-foreground shadow">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Book Categories</h2>
              <p className="text-muted-foreground">
                Manage your book categories here. This page is currently under development.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Categories;
