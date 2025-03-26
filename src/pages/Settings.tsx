
import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import PageTransition from '@/components/layout/PageTransition';

const Settings = () => {
  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-3 rounded-full">
              <SettingsIcon className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>
        
        <div className="grid gap-6">
          <div className="rounded-lg border bg-card text-card-foreground shadow">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Library Settings</h2>
              <p className="text-muted-foreground">
                Configure your library system settings here. This page is currently under development.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Settings;
