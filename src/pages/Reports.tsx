
import React, { useState } from 'react';
import { BarChart2, FileText, Download, Calendar, Users, BookOpen, Clock } from 'lucide-react';
import PageTransition from '@/components/layout/PageTransition';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Reports = () => {
  const [activeTab, setActiveTab] = useState("circulation");
  
  // Sample data
  const circulationData = [
    { month: 'Jan', checkouts: 65, returns: 45 },
    { month: 'Feb', checkouts: 59, returns: 50 },
    { month: 'Mar', checkouts: 80, returns: 55 },
    { month: 'Apr', checkouts: 81, returns: 75 },
    { month: 'May', checkouts: 56, returns: 60 },
    { month: 'Jun', checkouts: 55, returns: 50 },
    { month: 'Jul', checkouts: 40, returns: 45 },
  ];
  
  const overdueBooksData = [
    { id: 1, title: 'The Great Gatsby', patron: 'Emma Wilson', dueDate: '2023-05-10', daysOverdue: 45 },
    { id: 2, title: 'To Kill a Mockingbird', patron: 'James Thompson', dueDate: '2023-06-01', daysOverdue: 23 },
    { id: 3, title: '1984', patron: 'Sophie Martin', dueDate: '2023-06-15', daysOverdue: 9 },
    { id: 4, title: 'The Hobbit', patron: 'Oliver Brown', dueDate: '2023-06-20', daysOverdue: 4 },
  ];
  
  const popularBooksData = [
    { id: 1, title: 'Atomic Habits', author: 'James Clear', checkouts: 32 },
    { id: 2, title: 'The Silent Patient', author: 'Alex Michaelides', checkouts: 28 },
    { id: 3, title: 'Project Hail Mary', author: 'Andy Weir', checkouts: 25 },
    { id: 4, title: 'Where the Crawdads Sing', author: 'Delia Owens', checkouts: 23 },
    { id: 5, title: 'The Midnight Library', author: 'Matt Haig', checkouts: 21 },
  ];
  
  const activePatronsData = [
    { id: 1, name: 'Emma Wilson', checkouts: 15, returns: 12 },
    { id: 2, name: 'Michael Johnson', checkouts: 12, returns: 12 },
    { id: 3, name: 'Olivia Martinez', checkouts: 10, returns: 8 },
    { id: 4, name: 'William Brown', checkouts: 9, returns: 7 },
    { id: 5, name: 'Sophia Davis', checkouts: 8, returns: 6 },
  ];
  
  const downloadReport = (reportType: string) => {
    alert(`Downloading ${reportType} report...`);
    // In a real app, this would generate and download a CSV or PDF
  };

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
        
        <Tabs defaultValue="circulation" onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="circulation">Circulation</TabsTrigger>
            <TabsTrigger value="overdue">Overdue Books</TabsTrigger>
            <TabsTrigger value="popular">Popular Books</TabsTrigger>
            <TabsTrigger value="patrons">Active Patrons</TabsTrigger>
          </TabsList>
          
          <TabsContent value="circulation" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Circulation Statistics</CardTitle>
                  <CardDescription>Monthly checkout and return activity</CardDescription>
                </div>
                <Button variant="outline" onClick={() => downloadReport('circulation')}>
                  <FileText className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={circulationData}
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
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="overdue" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Overdue Books</CardTitle>
                  <CardDescription>Books past their due date</CardDescription>
                </div>
                <Button variant="outline" onClick={() => downloadReport('overdue')}>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </CardHeader>
              <CardContent>
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
                    {overdueBooksData.map((book) => (
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
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="popular" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Popular Books</CardTitle>
                  <CardDescription>Most checked out books</CardDescription>
                </div>
                <Button variant="outline" onClick={() => downloadReport('popular')}>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead className="text-right">Checkouts</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {popularBooksData.map((book) => (
                      <TableRow key={book.id}>
                        <TableCell className="font-medium">{book.title}</TableCell>
                        <TableCell>{book.author}</TableCell>
                        <TableCell className="text-right">{book.checkouts}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="patrons" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Active Patrons</CardTitle>
                  <CardDescription>Users with most activity</CardDescription>
                </div>
                <Button variant="outline" onClick={() => downloadReport('patrons')}>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </CardHeader>
              <CardContent>
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
                    {activePatronsData.map((patron) => (
                      <TableRow key={patron.id}>
                        <TableCell className="font-medium">{patron.name}</TableCell>
                        <TableCell>{patron.checkouts}</TableCell>
                        <TableCell>{patron.returns}</TableCell>
                        <TableCell className="text-right">{patron.checkouts + patron.returns}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Checkouts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <div className="text-2xl font-bold">438</div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">+12% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Patrons</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div className="text-2xl font-bold">126</div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">+5% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue Books</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-destructive" />
                <div className="text-2xl font-bold">24</div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">-3% from last month</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
};

export default Reports;
