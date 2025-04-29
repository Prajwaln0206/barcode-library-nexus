
import React from 'react';
import { Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ActivePatron } from '@/services/ReportService';

interface ActivePatronsTableProps {
  patrons: ActivePatron[];
  onExport: () => void;
}

const ActivePatronsTable: React.FC<ActivePatronsTableProps> = ({ patrons, onExport }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Active Patrons</CardTitle>
          <CardDescription>Users with most activity</CardDescription>
        </div>
        <Button variant="outline" onClick={onExport}>
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </CardHeader>
      <CardContent>
        {patrons.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Checkouts</TableHead>
                <TableHead>Returns</TableHead>
                <TableHead className="text-right">Total Activity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patrons.map((patron) => (
                <TableRow key={patron.id}>
                  <TableCell className="font-medium">{patron.name}</TableCell>
                  <TableCell>{patron.checkouts}</TableCell>
                  <TableCell>{patron.returns}</TableCell>
                  <TableCell className="text-right">{patron.checkouts + patron.returns}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="py-10 text-center">
            <p className="text-muted-foreground">No patron activity data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivePatronsTable;
