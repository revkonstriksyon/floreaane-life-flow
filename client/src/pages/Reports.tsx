
import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  Target,
  Users,
  DollarSign,
  Clock,
  FileText,
  Download,
  Filter,
  Eye,
  PieChart,
  Activity
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ReportData {
  tasks: any[];
  projects: any[];
  contacts: any[];
  transactions: any[];
  assets: any[];
  notes: any[];
}

interface ProductivityMetrics {
  tasksCompleted: number;
  totalTasks: number;
  completionRate: number;
  averageTaskTime: number;
  projectsCompleted: number;
  activeProjects: number;
}

interface FinancialMetrics {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  topCategories: { category: string; amount: number }[];
  monthlyTrend: { month: string; income: number; expenses: number }[];
}

export default function Reports() {
  const [reportData, setReportData] = useState<ReportData>({
    tasks: [],
    projects: [],
    contacts: [],
    transactions: [],
    assets: [],
    notes: []
  });
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [isLoading, setIsLoading] = useState(true);
  const [productivityMetrics, setProductivityMetrics] = useState<ProductivityMetrics>({
    tasksCompleted: 0,
    totalTasks: 0,
    completionRate: 0,
    averageTaskTime: 0,
    projectsCompleted: 0,
    activeProjects: 0
  });
  const [financialMetrics, setFinancialMetrics] = useState<FinancialMetrics>({
    totalIncome: 0,
    totalExpenses: 0,
    netIncome: 0,
    topCategories: [],
    monthlyTrend: []
  });

  useEffect(() => {
    fetchReportData();
  }, [selectedPeriod]);

  const fetchReportData = async () => {
    try {
      const endDate = new Date();
      const startDate = getStartDate(selectedPeriod, endDate);

      const [
        tasksResult,
        projectsResult,
        contactsResult,
        transactionsResult,
        assetsResult,
        notesResult
      ] = await Promise.all([
        supabase
          .from('tasks')
          .select('*')
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString()),
        supabase
          .from('projects')
          .select('*')
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString()),
        supabase
          .from('contacts')
          .select('*')
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString()),
        supabase
          .from('transactions')
          .select('*')
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString()),
        supabase
          .from('assets')
          .select('*')
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString()),
        supabase
          .from('notes')
          .select('*')
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString())
      ]);

      const data: ReportData = {
        tasks: tasksResult.data || [],
        projects: projectsResult.data || [],
        contacts: contactsResult.data || [],
        transactions: transactionsResult.data || [],
        assets: assetsResult.data || [],
        notes: notesResult.data || []
      };

      setReportData(data);
      calculateMetrics(data);
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStartDate = (period: string, endDate: Date) => {
    const start = new Date(endDate);
    switch (period) {
      case 'week':
        start.setDate(endDate.getDate() - 7);
        break;
      case 'month':
        start.setMonth(endDate.getMonth() - 1);
        break;
      case 'quarter':
        start.setMonth(endDate.getMonth() - 3);
        break;
      case 'year':
        start.setFullYear(endDate.getFullYear() - 1);
        break;
      default:
        start.setMonth(endDate.getMonth() - 1);
    }
    return start;
  };

  const calculateMetrics = (data: ReportData) => {
    // Productivity Metrics
    const completedTasks = data.tasks.filter(t => t.status === 'completed').length;
    const totalTasks = data.tasks.length;
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    const averageTaskTime = data.tasks
      .filter(t => t.duration)
      .reduce((avg, t, _, arr) => avg + t.duration / arr.length, 0);
    const projectsCompleted = data.projects.filter(p => p.status === 'completed').length;
    const activeProjects = data.projects.filter(p => p.status === 'active' || p.status === 'in_progress').length;

    setProductivityMetrics({
      tasksCompleted: completedTasks,
      totalTasks,
      completionRate,
      averageTaskTime,
      projectsCompleted,
      activeProjects
    });

    // Financial Metrics
    const income = data.transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = data.transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    // Top categories
    const categoryTotals: { [key: string]: number } = {};
    data.transactions.forEach(t => {
      if (t.category) {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
      }
    });

    const topCategories = Object.entries(categoryTotals)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    setFinancialMetrics({
      totalIncome: income,
      totalExpenses: expenses,
      netIncome: income - expenses,
      topCategories,
      monthlyTrend: [] // This would need more complex calculation
    });
  };

  const exportReport = () => {
    const reportContent = {
      period: selectedPeriod,
      generatedAt: new Date().toISOString(),
      productivity: productivityMetrics,
      financial: financialMetrics,
      data: reportData
    };

    const blob = new Blob([JSON.stringify(reportContent, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rapport-${selectedPeriod}-${new Date().toLocaleDateString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex-1 overflow-auto flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Prepare rapo a...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-border/50 bg-card/30 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Rapo & Analiz
              </h1>
              <p className="text-muted-foreground mt-1">
                Gade pèfòmans ou ak tendans yo
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Semèn lan</SelectItem>
                  <SelectItem value="month">Mwa a</SelectItem>
                  <SelectItem value="quarter">Trimès la</SelectItem>
                  <SelectItem value="year">Ane a</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtre
              </Button>
              <Button size="sm" onClick={exportReport}>
                <Download className="h-4 w-4 mr-2" />
                Ekspòte
              </Button>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tach Konplè</p>
                  <p className="text-2xl font-bold">{productivityMetrics.tasksCompleted}</p>
                  <p className="text-sm text-muted-foreground">
                    {productivityMetrics.completionRate.toFixed(1)}% to nan fini
                  </p>
                </div>
                <Target className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pwojè Aktif</p>
                  <p className="text-2xl font-bold">{productivityMetrics.activeProjects}</p>
                  <p className="text-sm text-muted-foreground">
                    {productivityMetrics.projectsCompleted} fini
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Revni Net</p>
                  <p className={`text-2xl font-bold ${financialMetrics.netIncome >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    ${financialMetrics.netIncome.toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {financialMetrics.netIncome >= 0 ? <TrendingUp className="inline h-3 w-3" /> : <TrendingDown className="inline h-3 w-3" />}
                    {Math.abs((financialMetrics.netIncome / (financialMetrics.totalIncome || 1)) * 100).toFixed(1)}%
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Nouvo Kontak</p>
                  <p className="text-2xl font-bold">{reportData.contacts.length}</p>
                  <p className="text-sm text-muted-foreground">Nan peryòd la</p>
                </div>
                <Users className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <Tabs defaultValue="productivity" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="productivity">Pwodiktivite</TabsTrigger>
              <TabsTrigger value="financial">Finans</TabsTrigger>
              <TabsTrigger value="social">Sosyal</TabsTrigger>
              <TabsTrigger value="assets">Byen yo</TabsTrigger>
            </TabsList>

            <TabsContent value="productivity">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Pèfòmans Tach</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>To Konpleyon</span>
                          <span>{productivityMetrics.completionRate.toFixed(1)}%</span>
                        </div>
                        <Progress value={productivityMetrics.completionRate} />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <p className="text-2xl font-bold text-green-500">{productivityMetrics.tasksCompleted}</p>
                          <p className="text-sm text-muted-foreground">Fini</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-blue-500">{productivityMetrics.totalTasks - productivityMetrics.tasksCompleted}</p>
                          <p className="text-sm text-muted-foreground">Ap tann</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground">Tan mwayen pa tach</p>
                        <p className="text-lg font-bold">{productivityMetrics.averageTaskTime.toFixed(0)} minit</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Estatistik Pwojè</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>Aktif</span>
                        <Badge variant="outline" className="bg-green-500 text-white">
                          {productivityMetrics.activeProjects}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Konplè</span>
                        <Badge variant="outline" className="bg-blue-500 text-white">
                          {productivityMetrics.projectsCompleted}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Total</span>
                        <Badge variant="outline">
                          {reportData.projects.length}
                        </Badge>
                      </div>

                      {reportData.projects.length > 0 && (
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>To Siksè</span>
                            <span>{((productivityMetrics.projectsCompleted / reportData.projects.length) * 100).toFixed(1)}%</span>
                          </div>
                          <Progress value={(productivityMetrics.projectsCompleted / reportData.projects.length) * 100} />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Aktivite Yo Nan Detay</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {reportData.tasks.slice(0, 10).map((task) => (
                        <div key={task.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div>
                            <h4 className="font-medium">{task.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {new Date(task.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant={task.status === 'completed' ? 'default' : 'secondary'}>
                            {task.status === 'completed' ? 'Fini' : 'Ap tann'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="financial">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Rezime Finansye</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Total Kòb Ki Antre</span>
                        <span className="text-lg font-bold text-green-500">
                          ${financialMetrics.totalIncome.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Total Depans</span>
                        <span className="text-lg font-bold text-red-500">
                          ${financialMetrics.totalExpenses.toFixed(2)}
                        </span>
                      </div>
                      <hr />
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Revni Net</span>
                        <span className={`text-xl font-bold ${financialMetrics.netIncome >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          ${financialMetrics.netIncome.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Top Kategori Depans</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {financialMetrics.topCategories.map((category, index) => (
                        <div key={category.category} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-primary" style={{
                              backgroundColor: `hsl(${index * 60}, 70%, 50%)`
                            }}></div>
                            <span className="font-medium">{category.category}</span>
                          </div>
                          <span className="text-sm font-bold">${category.amount.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Depi Tranzaksyon yo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {reportData.transactions.slice(0, 10).map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div>
                            <h4 className="font-medium">{transaction.description}</h4>
                            <p className="text-sm text-muted-foreground">
                              {new Date(transaction.date).toLocaleDateString()} • {transaction.category}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className={`font-bold ${transaction.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                              {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                            </p>
                            <p className="text-sm text-muted-foreground">{transaction.type}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="social">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Relasyon & Koneksyon</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <p className="text-3xl font-bold">{reportData.contacts.length}</p>
                        <p className="text-muted-foreground">Nouvo kontak yo</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <p className="text-lg font-bold text-blue-500">
                            {reportData.contacts.filter(c => c.relationship_type === 'friend').length}
                          </p>
                          <p className="text-sm text-muted-foreground">Zanmi</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold text-green-500">
                            {reportData.contacts.filter(c => c.relationship_type === 'colleague').length}
                          </p>
                          <p className="text-sm text-muted-foreground">Kòlèg</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Aktivite Entelektyèl</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <p className="text-3xl font-bold">{reportData.notes.length}</p>
                        <p className="text-muted-foreground">Nouvo nòt yo</p>
                      </div>
                      
                      <div className="space-y-2">
                        {reportData.notes.slice(0, 5).map((note) => (
                          <div key={note.id} className="p-2 bg-muted/50 rounded">
                            <h5 className="font-medium text-sm">{note.title || 'Nòt san tit'}</h5>
                            <p className="text-xs text-muted-foreground">
                              {new Date(note.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="assets">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Jesyon Byen</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <p className="text-3xl font-bold">{reportData.assets.length}</p>
                        <p className="text-muted-foreground">Nouvo byen yo</p>
                      </div>
                      
                      <div className="space-y-2">
                        {reportData.assets.slice(0, 5).map((asset) => (
                          <div key={asset.id} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                            <div>
                              <h5 className="font-medium text-sm">{asset.name}</h5>
                              <p className="text-xs text-muted-foreground">{asset.category}</p>
                            </div>
                            {asset.current_value && (
                              <span className="text-sm font-bold">${asset.current_value}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Vale Total Byen yo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-green-500">
                        ${reportData.assets.reduce((sum, asset) => sum + (asset.current_value || 0), 0).toFixed(2)}
                      </p>
                      <p className="text-muted-foreground">Vale aktyèl yo</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
