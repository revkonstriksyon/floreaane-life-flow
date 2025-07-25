import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Users, 
  FileText, 
  Briefcase,
  AlertTriangle,
  Calendar,
  DollarSign,
  Target
} from "lucide-react";
import { ResponsiveLayout } from "@/components/layout/ResponsiveLayout";
import { MoodSelector } from "@/components/dashboard/MoodSelector";
import { AIInsights } from "@/components/ai/AIInsights";
import { SmartTimeSuggestions } from "@/components/ai/SmartTimeSuggestions";
import type { Task, Project, Contact, Note } from "@/types";

interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  totalProjects: number;
  activeProjects: number;
  totalContacts: number;
  totalNotes: number;
  totalIncome: number;
  totalExpenses: number;
  upcomingBills: number;
}

interface RecentActivity {
  type: string;
  title: string;
  description: string;
  time: string;
}

const MOCK_STATS: DashboardStats = {
  totalTasks: 25,
  completedTasks: 18,
  totalProjects: 8,
  activeProjects: 3,
  totalContacts: 45,
  totalNotes: 12,
  totalIncome: 15000,
  totalExpenses: 8500,
  upcomingBills: 3
};

const MOCK_ACTIVITIES: RecentActivity[] = [
  {
    type: 'task',
    title: 'Fini rapò mwa a',
    description: 'Prepare rapò pou jesyon an',
    time: '2 è pase'
  },
  {
    type: 'project',
    title: 'Nouvo pwojè kominote a',
    description: 'Kreye yon pwojè pou kominote a',
    time: '1 jou pase'
  },
  {
    type: 'contact',
    title: 'Ajoute kontak nouvo',
    description: 'Jean-Claude Moïse - Kliyan',
    time: '2 jou pase'
  }
];

const MOCK_UPCOMING_TASKS: Task[] = [
  {
    id: '1',
    title: 'Rankontre ak klyan',
    description: 'Diskisyon pwojè nouvo a',
    status: 'pending',
    priority: 'high',
    category: 'travay',
    due_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    user_id: 'user1',
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Achte pwodwi pou kay la',
    description: 'Lis achte pou sèmen nan',
    status: 'pending',
    priority: 'medium',
    category: 'pèsonèl',
    due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    user_id: 'user1',
    created_at: new Date().toISOString()
  }
];

export default function IndexSimple() {
  const [stats, setStats] = useState<DashboardStats>(MOCK_STATS);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>(MOCK_ACTIVITIES);
  const [upcomingTasks, setUpcomingTasks] = useState<Task[]>(MOCK_UPCOMING_TASKS);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMood, setSelectedMood] = useState<string>('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      // Data is already set as mock data
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveMoodEntry = async (mood: string) => {
    try {
      console.log('Mood saved:', mood);
      setSelectedMood(mood);
    } catch (error) {
      console.error('Error saving mood:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'task': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'project': return <Briefcase className="h-4 w-4 text-blue-500" />;
      case 'contact': return <Users className="h-4 w-4 text-purple-500" />;
      case 'note': return <FileText className="h-4 w-4 text-orange-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <ResponsiveLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Chaje dashboard la...</p>
          </div>
        </div>
      </ResponsiveLayout>
    );
  }

  const completionRate = stats.totalTasks > 0 ? (stats.completedTasks / stats.totalTasks) * 100 : 0;

  const content = (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Akèy</h1>
          <p className="text-muted-foreground">Bon vini nan dashboard ou a</p>
        </div>
        <MoodSelector onMoodSelect={saveMoodEntry} />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tach yo</p>
                <p className="text-2xl font-bold">{stats.completedTasks}/{stats.totalTasks}</p>
                <Progress value={completionRate} className="mt-2" />
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pwojè yo</p>
                <p className="text-2xl font-bold">{stats.activeProjects}/{stats.totalProjects}</p>
                <p className="text-sm text-green-500">Aktif</p>
              </div>
              <Briefcase className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Kontak yo</p>
                <p className="text-2xl font-bold">{stats.totalContacts}</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Kòb ki antre</p>
                <p className="text-2xl font-bold">HTG {stats.totalIncome.toLocaleString()}</p>
                <p className="text-sm text-green-500">+12% depi mwa pase</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Tach Jou a
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingTasks.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  Pa gen tach pou jou a
                </p>
              ) : (
                upcomingTasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`} />
                    <div className="flex-1">
                      <h4 className="font-medium">{task.title}</h4>
                      <p className="text-sm text-muted-foreground">{task.description}</p>
                    </div>
                    <Badge variant="outline">{task.category}</Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Aktivite Resan yo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                  {getActivityIcon(activity.type)}
                  <div className="flex-1">
                    <h4 className="font-medium">{activity.title}</h4>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights & Smart Suggestions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AIInsights 
          data={upcomingTasks} 
          type="dashboard" 
          title="Analiz AI pou Jou a"
        />
        
        {selectedMood && (
          <SmartTimeSuggestions 
            mood={selectedMood}
            availableTime={60}
            recentActivities={['travay', 'kontak']}
          />
        )}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Aksyon Rapid</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <CheckCircle className="h-6 w-6" />
              <span>Nouvo Tach</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Briefcase className="h-6 w-6" />
              <span>Nouvo Pwojè</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Users className="h-6 w-6" />
              <span>Ajoute Kontak</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <FileText className="h-6 w-6" />
              <span>Nouvo Nòt</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Alerts */}
      {stats.upcomingBills > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-orange-500" />
              <div>
                <h3 className="font-semibold text-orange-800">Alèt Facture</h3>
                <p className="text-orange-700">
                  Ou gen {stats.upcomingBills} facture ki gen pou peye nan sèmen nan.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  return <ResponsiveLayout>{content}</ResponsiveLayout>;
}