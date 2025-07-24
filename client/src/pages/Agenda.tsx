import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  CalendarDays, 
  Clock,
  Plus,
  Filter,
  CheckCircle,
  Circle,
  AlertCircle,
  MapPin,
  Target,
  Flame,
  Repeat,
  Edit,
  Trash2,
  Brain,
  Play,
  Pause
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AIInsights } from "@/components/ai/AIInsights";
import { AIChat } from "@/components/ai/AIChat";

interface Task {
  id: string;
  user_id: string;
  project_id: string | null;
  title: string;
  time: string | null;
  duration: number | null;
  priority: string;
  category: string;
  status: string;
  location: string | null;
  objective: string | null;
  scheduled_date: string | null;
  is_recurring: boolean;
  recurring_pattern: any;
  created_at: string;
  updated_at: string;
}

const taskCategories = {
  personal: { label: "Pèsonèl", color: "bg-blue-500" },
  work: { label: "Travay", color: "bg-green-500" },
  health: { label: "Sante", color: "bg-red-500" },
  social: { label: "Sosyal", color: "bg-purple-500" },
  education: { label: "Edikasyon", color: "bg-yellow-500" },
  finance: { label: "Finans", color: "bg-emerald-500" },
  household: { label: "Kay", color: "bg-orange-500" },
  creative: { label: "Kreyatif", color: "bg-pink-500" },
  other: { label: "Lòt", color: "bg-gray-500" }
};

const priorityColors = {
  low: "bg-green-500",
  medium: "bg-yellow-500", 
  high: "bg-red-500"
};

const priorityLabels = {
  low: "Ba",
  medium: "Mwayen",
  high: "Wo"
};

export default function Agenda() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState("day");
  const [searchTerm, setSearchTerm] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState({
    title: "",
    objective: "",
    scheduled_date: "",
    time: "",
    duration: 60,
    priority: "medium",
    status: "pending",
    category: "personal",
    location: "",
    is_recurring: false,
    recurring_pattern: null,
    project_id: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tasksResult, projectsResult] = await Promise.all([
        supabase.from('tasks').select('*').order('scheduled_date', { ascending: true }),
        supabase.from('projects').select('id, name').eq('status', 'active')
      ]);

      if (tasksResult.error) throw tasksResult.error;
      if (projectsResult.error) throw projectsResult.error;

      setTasks(tasksResult.data || []);
      setProjects(projectsResult.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addTask = async () => {
    try {
      const taskData = {
        ...newTask,
        duration: newTask.duration || null,
        scheduled_date: newTask.scheduled_date || null,
        project_id: newTask.project_id || null
      };

      const { data, error } = await supabase
        .from('tasks')
        .insert([taskData])
        .select();

      if (error) throw error;

      setTasks([...(data || []), ...tasks]);
      setNewTask({
        title: "",
        objective: "",
        scheduled_date: "",
        time: "",
        duration: 60,
        priority: "medium",
        status: "pending",
        category: "personal",
        location: "",
        is_recurring: false,
        recurring_pattern: null,
        project_id: ""
      });
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const toggleTaskStatus = async (taskId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
      const { error } = await supabase
        .from('tasks')
        .update({ status: newStatus })
        .eq('id', taskId);

      if (error) throw error;

      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      ));
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;

      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => {
      if (!task.scheduled_date) return false;
      const taskDate = new Date(task.scheduled_date);
      return taskDate.toDateString() === date.toDateString();
    });
  };

  const getTasksForWeek = (date: Date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    return tasks.filter(task => {
      if (!task.scheduled_date) return false;
      const taskDate = new Date(task.scheduled_date);
      return taskDate >= startOfWeek && taskDate <= endOfWeek;
    });
  };

  const getTasksForMonth = (date: Date) => {
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    return tasks.filter(task => {
      if (!task.scheduled_date) return false;
      const taskDate = new Date(task.scheduled_date);
      return taskDate >= startOfMonth && taskDate <= endOfMonth;
    });
  };

  const getPriorityTasks = () => {
    return tasks.filter(task => task.priority === 'high' && task.status !== 'completed');
  };

  const getOverdueTasks = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return tasks.filter(task => {
      if (!task.scheduled_date || task.status === 'completed') return false;
      const taskDate = new Date(task.scheduled_date);
      taskDate.setHours(0, 0, 0, 0);
      return taskDate < today;
    });
  };

  const getUpcomingTasks = () => {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    return tasks.filter(task => {
      if (!task.scheduled_date || task.status === 'completed') return false;
      const taskDate = new Date(task.scheduled_date);
      return taskDate > today && taskDate <= nextWeek;
    });
  };

  const todayTasks = getTasksForDate(new Date());

  const todayFilteredTasks = tasks.filter(task => {
    if (!selectedDate) return false;
    const taskDate = new Date(task.scheduled_date);
    return taskDate.toDateString() === selectedDate.toDateString();
  });

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.objective?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const upcomingTasks = tasks.filter(task => {
    if (!task.scheduled_date) return false;
    const taskDate = new Date(task.scheduled_date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    return taskDate > today && task.status === 'pending';
  }).slice(0, 5);

  const completedToday = todayTasks.filter(t => t.status === 'completed').length;
  const pendingToday = todayTasks.filter(t => t.status === 'pending').length;
  const highPriorityTasks = tasks.filter(t => t.priority === 'high' && t.status === 'pending').length;

  const selectedDateTasks = tasks.filter(task => {
    if (!selectedDate) return false;
    const taskDate = new Date(task.due_date);
    return taskDate.toDateString() === selectedDate.toDateString();
  });

  const completedTasksToday = todayTasks.filter(task => task.status === 'completed').length;
  const totalTasksToday = todayTasks.length;
  const completionRate = totalTasksToday > 0 ? (completedTasksToday / totalTasksToday) * 100 : 0;

if (isLoading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex-1 overflow-auto flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Chaje ajanda a...</p>
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
                Ajanda & Tach
              </h1>
              <p className="text-muted-foreground mt-1">
                Òganize ak jere tan ou chak jou
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Chèche tach..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtre
              </Button>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-gradient-primary">
                    <Plus className="h-4 w-4 mr-2" />
                    Nouvo Tach
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Ajoute nouvo tach</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Tit tach la</Label>
                      <Input
                        id="title"
                        value={newTask.title}
                        onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                        placeholder="Egzanp: Reyinyon ak ekip la"
                      />
                    </div>
                    <div>
                      <Label htmlFor="objective">Objektif</Label>
                      <Textarea
                        id="objective"
                        value={newTask.objective}
                        onChange={(e) => setNewTask({...newTask, objective: e.target.value})}
                        placeholder="Sa ou vle rive fè..."
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="scheduled_date">Dat</Label>
                        <Input
                          id="scheduled_date"
                          type="date"
                          value={newTask.scheduled_date}
                          onChange={(e) => setNewTask({...newTask, scheduled_date: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="time">Lè</Label>
                        <Input
                          id="time"
                          type="time"
                          value={newTask.time}
                          onChange={(e) => setNewTask({...newTask, time: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category">Kategori</Label>
                        <Select value={newTask.category} onValueChange={(value) => setNewTask({...newTask, category: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Chwazi" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(taskCategories).map(([key, category]) => (
                              <SelectItem key={key} value={key}>{category.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="priority">Priyorite</Label>
                        <Select value={newTask.priority} onValueChange={(value) => setNewTask({...newTask, priority: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Ba</SelectItem>
                            <SelectItem value="medium">Mwayen</SelectItem>
                            <SelectItem value="high">Wo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="duration">Dire (minit)</Label>
                      <Input
                        id="duration"
                        type="number"
                        value={newTask.duration}
                        onChange={(e) => setNewTask({...newTask, duration: parseInt(e.target.value) || 60})}
                        placeholder="60"
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Kote</Label>
                      <Input
                        id="location"
                        value={newTask.location}
                        onChange={(e) => setNewTask({...newTask, location: e.target.value})}
                        placeholder="Biwo, kay, zoom..."
                      />
                    </div>
                    {projects.length > 0 && (
                      <div>
                        <Label htmlFor="project_id">Pwojè (opsyonèl)</Label>
                        <Select value={newTask.project_id} onValueChange={(value) => setNewTask({...newTask, project_id: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Chwazi pwojè" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">Okenn</SelectItem>
                            {projects.map((project) => (
                              <SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="is_recurring"
                        checked={newTask.is_recurring}
                        onCheckedChange={(checked) => setNewTask({...newTask, is_recurring: !!checked})}
                      />
                      <Label htmlFor="is_recurring">Tach rekuran</Label>
                    </div>
                    <Button onClick={addTask} className="w-full">
                      Ajoute tach la
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Jou a</p>
                  <p className="text-2xl font-bold">{todayTasks.length}</p>
                  <p className="text-sm text-muted-foreground">{completedToday} fini</p>
                </div>
                <CalendarDays className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Ap Tann</p>
                  <p className="text-2xl font-bold text-orange-500">{pendingToday}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Priyorite Wo</p>
                  <p className="text-2xl font-bold text-red-500">{highPriorityTasks}</p>
                </div>
                <Flame className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Tach</p>
                  <p className="text-2xl font-bold">{tasks.length}</p>
                </div>
                <Target className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Insights */}
        <div className="p-6 pb-0">
          <AIInsights 
            data={tasks} 
            type="tasks" 
            title="Konsey AI pou Tach yo"
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <Tabs defaultValue="today" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="today">Jou a</TabsTrigger>
              <TabsTrigger value="upcoming">Ki ap vini</TabsTrigger>
              <TabsTrigger value="calendar">Kalandriye</TabsTrigger>
              <TabsTrigger value="all">Tout Tach</TabsTrigger>
            </TabsList>

            <TabsContent value="today">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CalendarDays className="h-5 w-5" />
                        Tach Jou a - {new Date().toLocaleDateString()}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {todayTasks.length > 0 ? (
                          todayTasks.map((task) => {
                            const category = taskCategories[task.category as keyof typeof taskCategories];
                            const priority = priorityColors[task.priority as keyof typeof priorityColors];

                            return (
                              <div key={task.id} className={`flex items-center gap-3 p-4 rounded-lg border ${task.status === 'completed' ? 'bg-green-50 border-green-200' : 'bg-muted/50'}`}>
                                <button 
                                  onClick={() => toggleTaskStatus(task.id, task.status)}
                                  className="flex-shrink-0"
                                >
                                  {task.status === 'completed' ? 
                                    <CheckCircle className="h-6 w-6 text-green-500" /> : 
                                    <Circle className="h-6 w-6 text-muted-foreground hover:text-green-500" />
                                  }
                                </button>

                                <div className="flex-1">
                                  <h3 className={`font-medium ${task.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
                                    {task.title}
                                  </h3>
                                  {task.objective && (
                                    <p className="text-sm text-muted-foreground line-clamp-1">
                                      {task.objective}
                                    </p>
                                  )}
                                  <div className="flex items-center gap-4 mt-2 text-xs">
                                    <Badge variant="outline" className={`${category?.color} text-white border-none`}>
                                      {category?.label}
                                    </Badge>
                                    <Badge variant="outline" className={`${priority} text-white border-none`}>
                                      {priorityLabels[task.priority as keyof typeof priorityLabels]}
                                    </Badge>
                                    {task.time && (
                                      <div className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        <span>{task.time}</span>
                                      </div>
                                    )}
                                    {task.duration && (
                                      <span>{task.duration} min</span>
                                    )}
                                    {task.location && (
                                      <div className="flex items-center gap-1">
                                        <MapPin className="h-3 w-3" />
                                        <span>{task.location}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div className="flex gap-1">
                                  <Button variant="ghost" size="sm" onClick={() => setSelectedTask(task)}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm" onClick={() => deleteTask(task.id)}>
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-center py-12">
                            <CheckCircle className="h-24 w-24 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Pa gen tach pou jou a</h3>
                            <p className="text-muted-foreground">Ajoute tach yo pou kòmanse òganize jou a.</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Mini Kalandriye</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        className="rounded-md border"
                      />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="upcoming">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Tach ki ap vini
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {upcomingTasks.map((task) => {
                      const category = taskCategories[task.category as keyof typeof taskCategories];
                      const priority = priorityColors[task.priority as keyof typeof priorityColors];

                      return (
                        <div key={task.id} className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                          <Circle className="h-6 w-6 text-muted-foreground" />

                          <div className="flex-1">
                            <h3 className="font-medium">{task.title}</h3>
                            {task.objective && (
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {task.objective}
                              </p>
                            )}
                            <div className="flex items-center gap-4 mt-2 text-xs">
                              <Badge variant="outline" className={`${category?.color} text-white border-none`}>
                                {category?.label}
                              </Badge>
                              <Badge variant="outline" className={`${priority} text-white border-none`}>
                                {priorityLabels[task.priority as keyof typeof priorityLabels]}
                              </Badge>
                              {task.scheduled_date && (
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>{new Date(task.scheduled_date).toLocaleDateString()}</span>
                                </div>
                              )}
                              {task.time && (
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  <span>{task.time}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <Button variant="ghost" size="sm" onClick={() => setSelectedTask(task)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="calendar">
              <Card>
                <CardHeader>
                  <CardTitle>Kalandriye Konplè</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-4">
                    {['Dim', 'Len', 'Mad', 'Mèk', 'Jed', 'Van', 'Sam'].map(day => (
                      <div key={day} className="text-center font-semibold text-sm text-muted-foreground p-2">
                        {day}
                      </div>
                    ))}

                    {/* Calendar days would be generated here */}
                    <div className="col-span-7 text-center text-muted-foreground py-8">
                      Kalandriye ki gen pou devlope ak fonksyonalite konplè
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="all">
              <Card>
                <CardHeader>
                  <CardTitle>Tout Tach yo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {filteredTasks.map((task) => {
                      const category = taskCategories[task.category as keyof typeof taskCategories];
                      const priority = priorityColors[task.priority as keyof typeof priorityColors];

                      return (
                        <div key={task.id} className={`flex items-center gap-3 p-4 rounded-lg border ${task.status === 'completed' ? 'bg-green-50 border-green-200' : 'bg-muted/50'}`}>
                          <button 
                            onClick={() => toggleTaskStatus(task.id, task.status)}
                            className="flex-shrink-0"
                          >
                            {task.status === 'completed' ? 
                              <CheckCircle className="h-6 w-6 text-green-500" /> : 
                              <Circle className="h-6 w-6 text-muted-foreground hover:text-green-500" />
                            }
                          </button>

                          <div className="flex-1">
                            <h3 className={`font-medium ${task.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
                              {task.title}
                            </h3>
                            {task.objective && (
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {task.objective}
                              </p>
                            )}
                            <div className="flex items-center gap-4 mt-2 text-xs">
                              <Badge variant="outline" className={`${category?.color} text-white border-none`}>
                                {category?.label}
                              </Badge>
                              <Badge variant="outline" className={`${priority} text-white border-none`}>
                                {priorityLabels[task.priority as keyof typeof priorityLabels]}
                              </Badge>
                              {task.scheduled_date && (
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>{new Date(task.scheduled_date).toLocaleDateString()}</span>
                                </div>
                              )}
                              {task.time && (
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  <span>{task.time}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" onClick={() => setSelectedTask(task)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => deleteTask(task.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
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

      {/* AI Chat */}
      <AIChat 
        context={`Mwen gen ${tasks.length} tach total, ${todayTasks.length} pou jou a, ${completedToday} fini deja.`}
        suggestions={[
          "Ki tach ki pi ijan pou jou a?",
          "Ki jan pou òganize tan mwen pi byen?",
          "Bay m konsey pou fini tout tach yo",
          "Ki jan pou jere tach ki an reta yo?"
        ]}
      />
    </div>
  );
}