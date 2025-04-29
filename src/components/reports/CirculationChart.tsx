
import React from 'react';
import { FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CirculationData } from '@/services/ReportService';

interface CirculationChartProps {
  data: CirculationData[];
  onExport: () => void;
}

const CirculationChart: React.FC<CirculationChartProps> = ({ data, onExport }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Circulation Statistics</CardTitle>
          <CardDescription>Monthly checkout and return activity</CardDescription>
        </div>
        <Button variant="outline" onClick={onExport}>
          <FileText className="mr-2 h-4 w-4" />
          Export
        </Button>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="checkouts" fill="#8884d8" name="Checkouts" />
                <Bar dataKey="returns" fill="#82ca9d" name="Returns" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground">No circulation data available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CirculationChart;
