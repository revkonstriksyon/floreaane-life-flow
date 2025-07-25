import { useState } from "react";
import { ResponsiveLayout } from "@/components/layout/ResponsiveLayout";
import { PullToRefresh, TouchOptimizedButton } from "@/components/mobile/TouchOptimized";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Download, Activity, Target, Calendar, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import { AIInsights } from "@/components/ai/AIInsights";
import { AIChat } from "@/components/ai/AIChat";

interface ReportData {
  id: string;
  type: string;
  period: string;
  value: number;
  change: number;
  status: 'up' | 'down' | 'stable';
}

const mockReports: ReportData[] = [
  {
    id: '1',
    type: 'Pwodiktivite',
    period: 'Semèn sa a',
    value: 85,
    change: 12,
    status: 'up'
  },
  {
    id: '2', 
    type: 'Tach Konplete',
    period: 'Mwa sa a',
    value: 67,
    change: -5,
    status: 'down'
  },
  {
    id: '3',
    type: 'Pwojè Aktif',
    period: 'Total',
    value: 8,
    change: 2,
    status: 'up'
  },
  {
    id: '4',
    type: 'Depans',
    period: 'Mwa sa a', 
    value: 1250,
    change: 150,
    status: 'up'
  }
];

export default function ReportsSimple() {
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useIsMobile();
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");

  const handleRefresh = async () => {
    setIsLoading(true);
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1000);
  };

  const generateReport = () => {
    // Mock report generation
    console.log('Generating report...');
  };

  const content = (
    <div className={cn("p-4 space-y-6", !isMobile && "p-6")}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Rapò yo</h1>
        <p className="text-muted-foreground">Analize ak wè pwogre ou</p>
      </div>

      {/* Period Selector */}
      <div className="flex gap-2 mb-6">
        <Button 
          variant={selectedPeriod === "weekly" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedPeriod("weekly")}
        >
          Semèn
        </Button>
        <Button 
          variant={selectedPeriod === "monthly" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedPeriod("monthly")}
        >
          Mwa
        </Button>
        <Button 
          variant={selectedPeriod === "yearly" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedPeriod("yearly")}
        >
          Ane
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {mockReports.map((report) => (
          <Card key={report.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{report.type}</p>
                  <p className="text-2xl font-bold">
                    {report.type === 'Depans' ? `$${report.value}` : 
                     report.type === 'Pwojè Aktif' ? report.value :
                     `${report.value}%`}
                  </p>
                  <p className="text-xs text-muted-foreground">{report.period}</p>
                </div>
                <div className="flex flex-col items-end">
                  {report.status === 'up' ? (
                    <TrendingUp className="h-8 w-8 text-green-500" />
                  ) : report.status === 'down' ? (
                    <TrendingUp className="h-8 w-8 text-red-500 rotate-180" />
                  ) : (
                    <Activity className="h-8 w-8 text-blue-500" />
                  )}
                  <Badge 
                    variant={report.status === 'up' ? 'default' : 
                            report.status === 'down' ? 'destructive' : 'secondary'}
                    className="mt-2"
                  >
                    {report.status === 'up' ? '+' : report.status === 'down' ? '-' : ''}
                    {Math.abs(report.change)}
                    {report.type === 'Depans' ? '$' : 
                     report.type === 'Pwojè Aktif' ? '' : '%'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Insights */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Objektif Semèn nan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Tach yo konplete</span>
                <span className="text-sm font-medium">12/15</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{width: '80%'}}></div>
              </div>
              <p className="text-xs text-muted-foreground">
                80% done - 3 tach ki rete
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Aktivite Yo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Jodi a</span>
                <span className="text-sm font-medium">8 tach</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Demen</span>
                <span className="text-sm font-medium">5 tach</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Semèn nan</span>
                <span className="text-sm font-medium">32 tach</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Rapò Detaye
            </div>
            <Button onClick={generateReport} size="sm">
              <Download className="h-4 w-4 mr-2" />
              Jenere Rapò
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Charts placeholder */}
            <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Grafik ak analiz yo vin nan pwochèn vèsyon an</p>
              </div>
            </div>
            
            {/* Summary Stats */}
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">85%</p>
                <p className="text-sm text-muted-foreground">To Konplisyon</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">4.2h</p>
                <p className="text-sm text-muted-foreground">Mwayen Travay/Jou</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">12</p>
                <p className="text-sm text-muted-foreground">Pwojè Aktif</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <div className="mb-6">
        <AIInsights 
          data={mockReports} 
          type="reports" 
          title="Konsey AI pou Rapò yo"
        />
      </div>

      {/* AI Chat */}
      <AIChat 
        context={`Rapò yo montre pwodiktivite 85%, ak 67% tach konplete nan mwa sa a.`}
        suggestions={[
          "Kijan pou amelyore pwodiktivite a?",
          "Analiz aktivite semèn nan",
          "Bay konsey sou jesyon tan",
          "Ki kote m ka konsantre pi plis?"
        ]}
      />
    </div>
  );

  return (
    <ResponsiveLayout currentPath="/reports">
      {isMobile ? (
        <PullToRefresh onRefresh={handleRefresh}>
          {content}
        </PullToRefresh>
      ) : (
        content
      )}
    </ResponsiveLayout>
  );
}