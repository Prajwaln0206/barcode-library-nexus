
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
import { OverdueBook } from '@/services/ReportService';

interface OverdueTableProps {
  books: OverdueBook[];
  onExport: () => void;
}

const OverdueTable: React.FC<OverdueTableProps> = ({ books, onExport }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Overdue Books</CardTitle>
          <CardDescription>Books past their due date</CardDescription>
        </div>
        <Button variant="outline" onClick={onExport}>
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </CardHeader>
      <CardContent>
        {books.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Book Title</TableHead>
                <TableHead>Patron</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="text-right">Days Overdue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {books.map((book) => (
                <TableRow key={book.id}>
                  <TableCell className="font-medium">{book.title}</TableCell>
                  <TableCell>{book.patron}</TableCell>
                  <TableCell>{book.dueDate}</TableCell>
                  <TableCell className="text-right">
                    <span className="text-destructive font-medium">{book.daysOverdue}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="py-10 text-center">
            <p className="text-muted-foreground">No overdue books found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OverdueTable;
