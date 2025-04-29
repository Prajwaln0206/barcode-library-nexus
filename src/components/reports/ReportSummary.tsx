
import React from 'react';
import { BookOpen, Users, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ReportSummaryProps {
  totalCheckouts: number;
  activePatrons: number;
  overdueBooks: number;
}

const ReportSummary: React.FC<ReportSummaryProps> = ({ 
  totalCheckouts, 
  activePatrons, 
  overdueBooks 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Checkouts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            <div className="text-2xl font-bold">{totalCheckouts}</div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Patrons</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <div className="text-2xl font-bold">{activePatrons}</div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Overdue Books</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-destructive" />
            <div className="text-2xl font-bold">{overdueBooks}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportSummary;
