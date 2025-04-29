
import React, { useState, useEffect } from 'react';
import { BarChart2, FileText, Download, Calendar, Users, BookOpen, Clock, Loader } from 'lucide-react';
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
import {
  CirculationData,
  OverdueBook,
  PopularBook,
  ActivePatron,
  getCirculationData,
  getOverdueBooks,
  getPopularBooks,
  getActivePatrons,
  getReportSummary
} from '@/services/ReportService';
import { useToast } from '@/hooks/use-toast';

const Reports = () => {
  const [activeTab, setActiveTab] = useState("circulation");
  const [circulationData, setCirculationData] = useState<CirculationData[]>([]);
  const [overdueBooks, setOverdueBooks] = useState<OverdueBook[]>([]);
  const [popularBooks, setPopularBooks] = useState<PopularBook[]>([]);
  const [activePatrons, setActivePatrons] = useState<ActivePatron[]>([]);
  const [summary, setSummary] = useState({ totalCheckouts: 0, activePatrons: 0, overdueBooks: 0 });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setLoading(true);
        
        // Fetch all report data in parallel
        const [circulation, overdue, popular, patrons, summaryData] = await Promise.all([
          getCirculationData(),
          getOverdueBooks(),
          getPopularBooks(),
          getActivePatrons(),
          getReportSummary()
        ]);
        
        setCirculationData(circulation);
        setOverdueBooks(overdue);
        setPopularBooks(popular);
        setActivePatrons(patrons);
        setSummary(summaryData);
      } catch (error) {
        console.error('Error fetching report data:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load report data from database',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchReportData();
  }, [toast]);

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
        
        {loading ? (
          <div className="w-full flex justify-center items-center py-20">
            <div className="text-center">
              <Loader className="h-10 w-10 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Loading report data...</p>
            </div>
          </div>
        ) : (
          <>
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
                      {circulationData.length > 0 ? (
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
                      ) : (
                        <div className="h-full flex items-center justify-center">
                          <p className="text-muted-foreground">No circulation data available</p>
                        </div>
                      )}
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
                    {overdueBooks.length > 0 ? (
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
                          {overdueBooks.map((book) => (
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
                    {popularBooks.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Author</TableHead>
                            <TableHead className="text-right">Checkouts</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {popularBooks.map((book) => (
                            <TableRow key={book.id}>
                              <TableCell className="font-medium">{book.title}</TableCell>
                              <TableCell>{book.author}</TableCell>
                              <TableCell className="text-right">{book.checkouts}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="py-10 text-center">
                        <p className="text-muted-foreground">No checkout data available</p>
                      </div>
                    )}
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
                    {activePatrons.length > 0 ? (
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
                          {activePatrons.map((patron) => (
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
                    <div className="text-2xl font-bold">{summary.totalCheckouts}</div>
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
                    <div className="text-2xl font-bold">{summary.activePatrons}</div>
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
                    <div className="text-2xl font-bold">{summary.overdueBooks}</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </PageTransition>
  );
};

export default Reports;
