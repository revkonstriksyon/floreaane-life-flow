import { useState, useEffect } from "react";
import { ResponsiveLayout } from "@/components/layout/ResponsiveLayout";
import { PullToRefresh, TouchOptimizedButton } from "@/components/mobile/TouchOptimized";
import { SwipeCard } from "@/components/mobile/SwipeCard";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DayPreview } from "@/components/dashboard/DayPreview";
import { QuickStats } from "@/components/dashboard/QuickStats";
import { MoodSelector } from "@/components/dashboard/MoodSelector";
import { AISuggestions } from "@/components/dashboard/AISuggestions";
import { SmartTimeSuggestions } from "@/components/ai/SmartTimeSuggestions";
import { cn } from "@/lib/utils";
import { 
  CalendarDays, 
  Target, 
  Brain, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Star,
  Users,
  DollarSign,
  FileText,
  Plus,
  ArrowRight,
  Calendar,
  Briefcase
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  totalProjects: number;
  activeProjects: number;
  totalContacts: number;
  totalNotes: number;
  totalAssets: number;
  upcomingBills: number;
  monthlyIncome: number;
  monthlyExpenses: number;
}

interface RecentActivity {
  id: string;
  type: 'task' | 'project' | 'note' | 'contact' | 'transaction';
  title: string;
  description: string;
  time: string;
  status?: string;
}

export default function Index() {
  const [stats, setStats] = useState<DashboardStats>({
    totalTasks: 0,
    completedTasks: 0,
    totalProjects: 0,
    activeProjects: 0,
    totalContacts: 0,
    totalNotes: 0,
    totalAssets: 0,
    upcomingBills: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [upcomingTasks, setUpcomingTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMood, setSelectedMood] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch all stats in parallel
      const [
        tasksResult,
        projectsResult,
        contactsResult,
        notesResult,
        assetsResult,
        billsResult,
        transactionsResult
      ] = await Promise.all([
        supabase.from('tasks').select('*'),
        supabase.from('projects').select('*'),
        supabase.from('contacts').select('*'),
        supabase.from('notes').select('*'),
        supabase.from('assets').select('*'),
        supabase.from('bills').select('*'),
        supabase.from('transactions').select('*')
      ]);

      const tasks = tasksResult.data || [];
      const projects = projectsResult.data || [];
      const contacts = contactsResult.data || [];
      const notes = notesResult.data || [];
      const assets = assetsResult.data || [];
      const bills = billsResult.data || [];
      const transactions = transactionsResult.data || [];

      // Calculate stats
      const completedTasks = tasks.filter(t => t.status === 'completed').length;
      const activeProjects = projects.filter(p => p.status === 'active' || p.status === 'in_progress').length;

      const today = new Date();
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();

      const monthlyIncome = transactions
        .filter(t => t.type === 'income' && new Date(t.created_at || new Date()).getMonth() === currentMonth && new Date(t.created_at || new Date()).getFullYear() === currentYear)
        .reduce((sum, t) => sum + t.amount, 0);

      const monthlyExpenses = transactions
        .filter(t => t.type === 'expense' && new Date(t.created_at || new Date()).getMonth() === currentMonth && new Date(t.created_at || new Date()).getFullYear() === currentYear)
        .reduce((sum, t) => sum + t.amount, 0);

      const upcomingBills = bills.filter(bill => {
        const dueDate = new Date(bill.due_date);
        const weekFromNow = new Date();
        weekFromNow.setDate(weekFromNow.getDate() + 7);
        return dueDate <= weekFromNow && bill.status !== 'paid';
      }).length;

      setStats({
        totalTasks: tasks.length,
        completedTasks,
        totalProjects: projects.length,
        activeProjects,
        totalContacts: contacts.length,
        totalNotes: notes.length,
        totalAssets: assets.length,
        upcomingBills,
        monthlyIncome,
        monthlyExpenses
      });

      // Get upcoming tasks
      const upcoming = tasks
        .filter(t => t.status === 'pending' && t.due_date)
        .sort((a, b) => new Date(a.due_date || new Date()).getTime() - new Date(b.due_date || new Date()).getTime())
        .slice(0, 5);

      setUpcomingTasks(upcoming);

      // Create recent activities
      const activities: RecentActivity[] = [
        ...tasks.slice(0, 3).map(task => ({
          id: task.id,
          type: 'task' as const,
          title: task.title,
          description: `Kategori: ${task.category}`,
          time: new Date(task.created_at || new Date()).toLocaleDateString(),
          status: task.status || 'pending'
        })),
        ...projects.slice(0, 2).map(project => ({
          id: project.id,
          type: 'project' as const,
          title: project.name,
          description: `${project.progress_percentage || 0}% konplè`,
          time: new Date(project.created_at || new Date()).toLocaleDateString(),
          status: project.status || 'planning'
        })),
        ...notes.slice(0, 2).map(note => ({
          id: note.id,
          type: 'note' as const,
          title: note.title || 'Sans tit',
          description: note.content.substring(0, 50) + '...',
          time: new Date(note.created_at || new Date()).toLocaleDateString()
        }))
      ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5);

      setRecentActivities(activities);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveMoodEntry = async (mood: string) => {
    try {
      const { error } = await supabase
        .from('mood_entries')
        .insert([{ mood, notes: '', user_id: 'current_user' }]);

      if (error) throw error;
      setSelectedMood(mood);
    } catch (error) {
      console.error('Error saving mood:', error);
    }
  };

  const taskCompletionRate = stats.totalTasks > 0 ? (stats.completedTasks / stats.totalTasks) * 100 : 0;
  const projectCompletionRate = stats.totalProjects > 0 ? (stats.activeProjects / stats.totalProjects) * 100 : 0;
  const isMobile = useIsMobile();

  const handleRefresh = async () => {
    await fetchDashboardData();
  };

  if (isLoading) {
    return (
      <ResponsiveLayout currentPath="/">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Chaje done yo...</p>
          </div>
        </div>
      </ResponsiveLayout>
    );
  }

  const content = (
      <div className={cn("p-4", !isMobile && "p-6")}>
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
              Bonjou! 👋
            </h1>
            <p className="text-muted-foreground">
              Men yon aperçu sou jou ou a ak pwogre ou yo
            </p>
          </div>

          {/* Quick Stats */}
          <div className={cn(
            "grid gap-4 mb-6",
            isMobile 
              ? "grid-cols-2" 
              : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          )}>
            <SwipeCard
              className="h-full"
              rightAction={{
                icon: <span>📊</span>,
                label: "Detay",
                color: "bg-blue-500"
              }}
              onSwipeRight={() => window.location.href = '/agenda'}
            >
              <Card className="h-full">
                <CardContent className={cn("p-4", !isMobile && "p-6")}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Tach Total</p>
                    <p className="text-2xl font-bold">{stats.totalTasks}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Progress value={taskCompletionRate} className="flex-1" />
                      <span className="text-sm text-muted-foreground">{taskCompletionRate.toFixed(0)}%</span>
                    </div>
                  </div>
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            </SwipeCard>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pwojè Aktif</p>
                    <p className="text-2xl font-bold">{stats.activeProjects}</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      {stats.totalProjects} total
                    </p>
                  </div>
                  <Target className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Balans Mwa a</p>
                    <p className={`text-2xl font-bold ${stats.monthlyIncome - stats.monthlyExpenses >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      ${(stats.monthlyIncome - stats.monthlyExpenses).toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      {stats.upcomingBills} faktè ki rete
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Done</p>
                    <p className="text-2xl font-bold">{stats.totalNotes + stats.totalContacts + stats.totalAssets}</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Tout bagay ou gen
                    </p>
                  </div>
                  <FileText className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className={cn(
            "grid gap-4",
            isMobile 
              ? "grid-cols-1" 
              : "grid-cols-1 lg:grid-cols-3 gap-6"
          )}>
            {/* Left Column */}
            <div className={cn(
              "space-y-4",
              !isMobile && "lg:col-span-2 space-y-6"
            )}>
              {/* Today's Tasks */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Tach Jou a
                  </CardTitle>
                  <TouchOptimizedButton 
                    onClick={() => window.location.href = '/agenda'}
                    size="sm"
                    variant="secondary"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajoute
                  </TouchOptimizedButton>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {upcomingTasks.length > 0 ? (
                      upcomingTasks.map((task) => (
                        <div key={task.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                          <div className={`w-3 h-3 rounded-full ${
                            task.priority === 'high' ? 'bg-red-500' :
                            task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                          }`}></div>
                          <div className="flex-1">
                            <p className="font-medium">{task.title}</p>
                            <p className="text-sm text-muted-foreground">{task.category}</p>
                          </div>
                          <Badge variant={task.status === 'completed' ? 'default' : 'secondary'}>
                            {task.status === 'completed' ? 'Fini' : 'Ap tann'}
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6">
                        <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">Pa gen tach pou jou a!</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Aktivite Resan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <div className={`p-2 rounded-full ${
                          activity.type === 'task' ? 'bg-blue-100' :
                          activity.type === 'project' ? 'bg-green-100' :
                          activity.type === 'note' ? 'bg-purple-100' :
                          activity.type === 'contact' ? 'bg-orange-100' : 'bg-gray-100'
                        }`}>
                          {activity.type === 'task' && <CheckCircle className="h-4 w-4 text-blue-600" />}
                          {activity.type === 'project' && <Briefcase className="h-4 w-4 text-green-600" />}
                          {activity.type === 'note' && <FileText className="h-4 w-4 text-purple-600" />}
                          {activity.type === 'contact' && <Users className="h-4 w-4 text-orange-600" />}
                          {activity.type === 'transaction' && <DollarSign className="h-4 w-4 text-gray-600" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{activity.title}</p>
                          <p className="text-sm text-muted-foreground">{activity.description}</p>
                        </div>
                        <span className="text-sm text-muted-foreground">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className={cn(
              "space-y-4",
              !isMobile && "space-y-6"
            )}>
              {/* Mood Selector */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    Ki jan ou santi ou?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <MoodSelector onMoodSelect={saveMoodEntry} selectedMood={selectedMood} />
                </CardContent>
              </Card>

              {/* AI Time Suggestions */}
              {selectedMood && (
                <SmartTimeSuggestions 
                  mood={selectedMood}
                  availableTime={45} // Example: 45 minutes free time
                  recentActivities={recentActivities.map(a => a.title)}
                  userContext={{}}
                />
              )}

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Aksyon Rapid
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button className="w-full justify-start" variant="ghost">
                      <Plus className="h-4 w-4 mr-2" />
                      Nouvo Tach
                    </Button>
                    <Button className="w-full justify-start" variant="ghost">
                      <Plus className="h-4 w-4 mr-2" />
                      Nouvo Pwojè
                    </Button>
                    <Button className="w-full justify-start" variant="ghost">
                      <Plus className="h-4 w-4 mr-2" />
                      Nouvo Nòt
                    </Button>
                    <Button className="w-full justify-start" variant="ghost">
                      <Plus className="h-4 w-4 mr-2" />
                      Nouvo Kontak
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Alerts */}
              {stats.upcomingBills > 0 && (
                <Card className="border-orange-200 bg-orange-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-orange-800">
                      <AlertTriangle className="h-5 w-5" />
                      Atansyon
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-orange-700">
                      Ou gen {stats.upcomingBills} faktè ki gen pou peye nan semèn ki ap vini an.
                    </p>
                    <Button size="sm" variant="outline" className="mt-3 w-full">
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Wè Faktè yo
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
  );

  return (
    <ResponsiveLayout currentPath="/">
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