
import React from 'react';
import { Loader } from 'lucide-react';

const LoadingState: React.FC = () => {
  return (
    <div className="w-full flex justify-center items-center py-20">
      <div className="text-center">
        <Loader className="h-10 w-10 animate-spin mx-auto mb-4 text-primary" />
        <p className="text-muted-foreground">Loading report data...</p>
      </div>
    </div>
  );
};

export default LoadingState;
