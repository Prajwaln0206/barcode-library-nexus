
import React, { useState, useEffect } from 'react';
import { BarChart2 } from 'lucide-react';
import PageTransition from '@/components/layout/PageTransition';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import {
  getCirculationData,
  getOverdueBooks,
  getPopularBooks,
  getActivePatrons,
  getReportSummary
} from '@/services/ReportService';

// Import our new components
import LoadingState from '@/components/reports/LoadingState';
import ReportSummary from '@/components/reports/ReportSummary';
import CirculationChart from '@/components/reports/CirculationChart';
import OverdueTable from '@/components/reports/OverdueTable';
import PopularBooksTable from '@/components/reports/PopularBooksTable';
import ActivePatronsTable from '@/components/reports/ActivePatronsTable';

const Reports = () => {
  const [activeTab, setActiveTab] = useState("circulation");
  const [circulationData, setCirculationData] = useState([]);
  const [overdueBooks, setOverdueBooks] = useState([]);
  const [popularBooks, setPopularBooks] = useState([]);
  const [activePatrons, setActivePatrons] = useState([]);
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

  const downloadReport = (reportType) => {
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
          <LoadingState />
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
                <CirculationChart 
                  data={circulationData} 
                  onExport={() => downloadReport('circulation')}
                />
              </TabsContent>
              
              <TabsContent value="overdue" className="mt-6">
                <OverdueTable 
                  books={overdueBooks} 
                  onExport={() => downloadReport('overdue')}
                />
              </TabsContent>
              
              <TabsContent value="popular" className="mt-6">
                <PopularBooksTable 
                  books={popularBooks} 
                  onExport={() => downloadReport('popular')}
                />
              </TabsContent>
              
              <TabsContent value="patrons" className="mt-6">
                <ActivePatronsTable 
                  patrons={activePatrons} 
                  onExport={() => downloadReport('patrons')}
                />
              </TabsContent>
            </Tabs>
            
            <ReportSummary 
              totalCheckouts={summary.totalCheckouts} 
              activePatrons={summary.activePatrons} 
              overdueBooks={summary.overdueBooks} 
            />
          </>
        )}
      </div>
    </PageTransition>
  );
};

export default Reports;
