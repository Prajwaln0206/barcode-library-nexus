
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export type ActivityType = 'checkout' | 'return' | 'new-book' | 'new-user';

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: Date;
  user?: {
    name: string;
    avatar?: string;
  };
}

interface RecentActivityProps {
  activities: Activity[];
  className?: string;
}

const ActivityIcon: React.FC<{ type: ActivityType }> = ({ type }) => {
  const baseClasses = "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0";
  
  switch (type) {
    case 'checkout':
      return <div className={cn(baseClasses, "bg-blue-100 text-blue-600")}>📤</div>;
    case 'return':
      return <div className={cn(baseClasses, "bg-green-100 text-green-600")}>📥</div>;
    case 'new-book':
      return <div className={cn(baseClasses, "bg-purple-100 text-purple-600")}>📚</div>;
    case 'new-user':
      return <div className={cn(baseClasses, "bg-amber-100 text-amber-600")}>👤</div>;
    default:
      return <div className={cn(baseClasses, "bg-gray-100 text-gray-600")}>📋</div>;
  }
};

const RecentActivity: React.FC<RecentActivityProps> = ({ activities, className }) => {
  return (
    <div className={cn("glass-card rounded-xl", className)}>
      <div className="px-6 py-4 border-b border-border/50">
        <h3 className="text-lg font-medium">Recent Activity</h3>
      </div>
      
      <ScrollArea className="h-[400px] px-6 py-4">
        <div className="space-y-6">
          {activities.map((activity) => (
            <div key={activity.id} className="flex gap-4 items-start animate-fade-in">
              <ActivityIcon type={activity.type} />
              
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-sm">{activity.title}</p>
                  <time className="text-xs text-muted-foreground">
                    {activity.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </time>
                </div>
                
                <p className="text-sm text-muted-foreground">{activity.description}</p>
                
                {activity.user && (
                  <div className="flex items-center mt-2">
                    <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs overflow-hidden">
                      {activity.user.avatar ? (
                        <img src={activity.user.avatar} alt={activity.user.name} className="w-full h-full object-cover" />
                      ) : (
                        activity.user.name.charAt(0)
                      )}
                    </div>
                    <span className="text-xs font-medium ml-1.5">{activity.user.name}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default RecentActivity;
