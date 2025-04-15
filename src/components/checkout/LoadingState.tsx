
import React from 'react';
import { Clock } from 'lucide-react';

const LoadingState: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-[60vh]">
      <div className="text-center">
        <Clock className="animate-spin h-8 w-8 mx-auto mb-4 text-primary" />
        <p>Loading...</p>
      </div>
    </div>
  );
};

export default LoadingState;
