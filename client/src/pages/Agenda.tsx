
import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { supabase } from "@/integrations/supabase/client";
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle2, 
  Circle, 
  Star,
  MapPin,
  User,
  Brain,
  BarChart3
} from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string | null;
  priority: string | null;
  category: string | null;
  due_date: string | null;
  start_date: string | null;
  duration_minutes: number | null;
  project_id: string | null;
  related_contact_id: string | null;
  related_asset_id: string | null;
  tags: string[] | null;
  is_recurring: boolean | null;
  created_at: string | null;
  user_id: string | null;
}

const priorityColors: Record<string, string> = {
  high: "bg-destructive/10 text-destructive border-destructive/20",
  medium: "bg-warning/10 text-warning border-warning/20",
  low: "bg-muted text-muted-foreground"
};

const statusLabels: Record<string, string> = {
  pending: "Rete",
  in_progress: "Nan Travay", 
  completed: "Fini",
  cancelled: "Anile"
};

const categoryColors: Record<string, string> = {
  personal: "bg-blue-100 text-blue-800",
  work: "bg-green-100 text-green-800",
  health: "bg-red-100 text-red-800",
  education: "bg-purple-100 text-purple-800",
  social: "bg-pink-100 text-pink-800"
};

const timeSlots = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, '0');
  return `${hour}:00`;
});

export default function Agenda() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [activeView, setActiveView] = useState("calendar");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching tasks:', error);
        return;
      }

      setTasks(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    
    const { error } = await supabase
      .from('tasks')
      .update({ status: newStatus })
      .eq('id', taskId);

    if (error) {
      console.error('Error updating task:', error);
      return;
    }

    setTasks(tasks.map(t => 
      t.id === taskId ? { ...t, status: newStatus } : t
    ));
  };

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const todayTasks = filteredTasks.filter(task => {
    if (!task.due_date) return false;
    const taskDate = new Date(task.due_date);
    const today = new Date();
    return taskDate.toDateString() === today.toDateString();
  });

  const upcomingTasks = filteredTasks.filter(task => {
    if (!task.due_date) return false;
    const taskDate = new Date(task.due_date);
    const today = new Date();
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    return taskDate >= tomorrow;
  });

  const overdueTasks = filteredTasks.filter(task => {
    if (!task.due_date || task.status === 'completed') return false;
    const taskDate = new Date(task.due_date);
    const today = new Date();
    return taskDate < today;
  });

  const completedTasks = filteredTasks.filter(task => task.status === 'completed').length;
  const pendingTasks = filteredTasks.filter(task => task.status === 'pending').length;

  const getPriorityColor = (priority: string | null) => {
    return priorityColors[priority || 'low'] || priorityColors.low;
  };

  const getStatusIcon = (status: string | null) => {
    return status === "completed" ? CheckCircle2 : Circle;
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar collapsed={sidebarCollapsed} onToggle={setSidebarCollapsed} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            <p className="mt-4">Ap chèche tach yo...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar collapsed={sidebarCollapsed} onToggle={setSidebarCollapsed} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold">Ajenda & Tach</h1>
              <p className="text-muted-foreground">Jesyon tan ak tach yo</p>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nouvo Tach
            </Button>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Chèche tach yo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filtre
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Jodi a</p>
                    <p className="text-2xl font-bold">{todayTasks.length}</p>
                  </div>
                  <CalendarIcon className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Rete</p>
                    <p className="text-2xl font-bold">{pendingTasks}</p>
                  </div>
                  <Circle className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Fini</p>
                    <p className="text-2xl font-bold">{completedTasks}</p>
                  </div>
                  <CheckCircle2 className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Anreta</p>
                    <p className="text-2xl font-bold text-red-500">{overdueTasks.length}</p>
                  </div>
                  <Clock className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <Tabs value={activeView} onValueChange={setActiveView} className="h-full flex flex-col">
            <TabsList className="m-6 mb-0">
              <TabsTrigger value="calendar" className="gap-2">
                <CalendarIcon className="h-4 w-4" />
                Kalandriye
              </TabsTrigger>
              <TabsTrigger value="timeline" className="gap-2">
                <Clock className="h-4 w-4" />
                Timeline
              </TabsTrigger>
              <TabsTrigger value="kanban" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                Kanban
              </TabsTrigger>
              <TabsTrigger value="ai" className="gap-2">
                <Brain className="h-4 w-4" />
                IA Sijesyon
              </TabsTrigger>
            </TabsList>

            <TabsContent value="calendar" className="flex-1 p-6 overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
                {/* Calendar */}
                <div className="lg:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle>Kalandriye</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => date && setSelectedDate(date)}
                        className="rounded-md border"
                      />
                    </CardContent>
                  </Card>
                </div>

                {/* Tasks List */}
                <div className="lg:col-span-3 space-y-6 overflow-y-auto">
                  {/* Today's Tasks */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Tach Jodi a</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {todayTasks.map((task) => {
                          const StatusIcon = getStatusIcon(task.status);
                          return (
                            <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg border hover:shadow-sm transition-shadow">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleTask(task.id)}
                                className="p-0 h-auto"
                              >
                                <StatusIcon className={`h-5 w-5 ${task.status === 'completed' ? 'text-green-500' : 'text-muted-foreground'}`} />
                              </Button>
                              <div className="flex-1">
                                <h4 className={`font-medium ${task.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
                                  {task.title}
                                </h4>
                                {task.description && (
                                  <p className="text-sm text-muted-foreground">{task.description}</p>
                                )}
                                <div className="flex items-center gap-2 mt-1">
                                  {task.priority && (
                                    <Badge variant="outline" className={getPriorityColor(task.priority)}>
                                      {task.priority === 'high' ? 'Wo' : task.priority === 'medium' ? 'Mwayen' : 'Ba'}
                                    </Badge>
                                  )}
                                  {task.category && (
                                    <Badge variant="outline" className={categoryColors[task.category] || categoryColors.personal}>
                                      {task.category}
                                    </Badge>
                                  )}
                                  {task.duration_minutes && (
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                      <Clock className="h-3 w-3" />
                                      {task.duration_minutes}min
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        {todayTasks.length === 0 && (
                          <p className="text-center text-muted-foreground py-8">
                            Pa gen tach pou jodi a
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Upcoming Tasks */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Tach Ki Vini</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {upcomingTasks.slice(0, 10).map((task) => {
                          const StatusIcon = getStatusIcon(task.status);
                          return (
                            <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg border hover:shadow-sm transition-shadow">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleTask(task.id)}
                                className="p-0 h-auto"
                              >
                                <StatusIcon className={`h-5 w-5 ${task.status === 'completed' ? 'text-green-500' : 'text-muted-foreground'}`} />
                              </Button>
                              <div className="flex-1">
                                <h4 className={`font-medium ${task.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
                                  {task.title}
                                </h4>
                                {task.due_date && (
                                  <p className="text-sm text-muted-foreground">
                                    {new Date(task.due_date).toLocaleDateString('fr-FR')}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                        {upcomingTasks.length === 0 && (
                          <p className="text-center text-muted-foreground py-8">
                            Pa gen tach ki vini
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Overdue Tasks */}
                  {overdueTasks.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-red-600">Tach Anreta</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {overdueTasks.map((task) => {
                            const StatusIcon = getStatusIcon(task.status);
                            return (
                              <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg border border-red-200 bg-red-50 hover:shadow-sm transition-shadow">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleTask(task.id)}
                                  className="p-0 h-auto"
                                >
                                  <StatusIcon className="h-5 w-5 text-red-500" />
                                </Button>
                                <div className="flex-1">
                                  <h4 className="font-medium text-red-700">{task.title}</h4>
                                  {task.due_date && (
                                    <p className="text-sm text-red-600">
                                      Dèt: {new Date(task.due_date).toLocaleDateString('fr-FR')}
                                    </p>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="timeline" className="flex-1 p-6">
              <Card>
                <CardHeader>
                  <CardTitle>Timeline Jou a</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {timeSlots.map((time) => {
                      const timeTaska = todayTasks.filter(task => {
                        if (!task.start_date) return false;
                        const taskTime = new Date(task.start_date).getHours();
                        const slotTime = parseInt(time.split(':')[0]);
                        return taskTime === slotTime;
                      });

                      return (
                        <div key={time} className="grid grid-cols-12 gap-4 py-2 border-b border-muted">
                          <div className="col-span-2 text-sm font-medium text-muted-foreground">
                            {time}
                          </div>
                          <div className="col-span-10">
                            {timeTaska.length > 0 ? (
                              timeTaska.map(task => (
                                <div key={task.id} className="p-2 bg-primary/10 rounded-md mb-1">
                                  <div className="font-medium">{task.title}</div>
                                  {task.duration_minutes && (
                                    <div className="text-sm text-muted-foreground">
                                      {task.duration_minutes} min
                                    </div>
                                  )}
                                </div>
                              ))
                            ) : (
                              <div className="h-8"></div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
