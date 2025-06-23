
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Download, BarChart3, Users, Smartphone, Globe } from 'lucide-react';
import { getScanAnalytics, exportAnalyticsCSV, ScanData } from '@/utils/analytics';
import { useToast } from '@/hooks/use-toast';

const AnalyticsDashboard: React.FC = () => {
  const [scans, setScans] = React.useState<ScanData[]>([]);
  const { toast } = useToast();

  React.useEffect(() => {
    const loadAnalytics = () => {
      const scanData = getScanAnalytics();
      setScans(scanData);
    };

    loadAnalytics();
    // Refresh analytics every 30 seconds
    const interval = setInterval(loadAnalytics, 30000);
    return () => clearInterval(interval);
  }, []);

  const downloadCSV = () => {
    try {
      const csv = exportAnalyticsCSV(scans);
      if (!csv) {
        toast({
          title: "No Data",
          description: "No scan data available to export.",
          variant: "destructive"
        });
        return;
      }

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `qr-analytics-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Analytics report downloaded successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download analytics report.",
        variant: "destructive"
      });
    }
  };

  const getStats = () => {
    const totalScans = scans.length;
    const uniqueUsers = new Set(scans.map(s => s.userAgent)).size;
    const mobileScans = scans.filter(s => s.device.type === 'mobile').length;
    const iosScans = scans.filter(s => s.device.os === 'ios').length;
    const androidScans = scans.filter(s => s.device.os === 'android').length;

    return { totalScans, uniqueUsers, mobileScans, iosScans, androidScans };
  };

  const stats = getStats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <Button onClick={downloadCSV} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalScans}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.uniqueUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mobile Scans</CardTitle>
            <Smartphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.mobileScans}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">iOS Users</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.iosScans}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Android Users</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.androidScans}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Scans Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Scans</CardTitle>
        </CardHeader>
        <CardContent>
          {scans.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No scan data available yet. QR code scans will appear here.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Device</TableHead>
                  <TableHead>OS</TableHead>
                  <TableHead>Browser</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Redirected</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scans.slice(0, 10).map((scan) => (
                  <TableRow key={scan.id}>
                    <TableCell className="text-sm">
                      {new Date(scan.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{scan.device.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{scan.device.os}</Badge>
                    </TableCell>
                    <TableCell className="text-sm">{scan.device.browser}</TableCell>
                    <TableCell>
                      <Badge variant={scan.isRepeatUser ? "default" : "outline"}>
                        {scan.isRepeatUser ? "Repeat" : "New"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={scan.redirectedTo === 'ios' ? "default" : 
                                scan.redirectedTo === 'android' ? "secondary" : "outline"}
                      >
                        {scan.redirectedTo}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
