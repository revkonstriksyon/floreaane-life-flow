import { useState, useEffect } from "react";
import { ResponsiveLayout } from "@/components/layout/ResponsiveLayout";
import { PullToRefresh } from "@/components/mobile/TouchOptimized";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { 
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Target,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  CheckCircle,
  Circle,
  AlertTriangle,
  Repeat,
  Zap,
  Brain,
  Lightbulb,
  BarChart3,
  TrendingUp,
  Play,
  Pause,
  RefreshCw,
  Link as LinkIcon,
  Sparkles,
  Timer,
  Users,
  DollarSign,
  Flame,
  Coffee,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
  Mic,
  FileText,
  Bell
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from "@/hooks/api/useTasks";
import { useProjects } from "@/hooks/api/useProjects";
import { useContacts } from "@/hooks/api/useContacts";
import { useAuth } from "@/contexts/AuthContext";
import { format, addDays, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isToday, isSameDay } from "date-fns";
import type { Task, InsertTask } from "@shared/schema";

// Types for enhanced agenda
interface TaskWithAI extends Task {
  aiSuggestions?: string[];
  estimatedDuration?: number;
  optimalTime?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  energyRequired?: 'low' | 'medium' | 'high';
}

interface TimeBlock {
  id: string;
  start: Date;
  end: Date;
  task?: TaskWithAI;
  type: 'task' | 'break' | 'deep-work' | 'meeting';
  color?: string;
}

interface ProductivityMetrics {
  completionRate: number;
  timeByCategory: Record<string, number>;
  weeklyTrend: number[];
  focusTime: number;
  breakTime: number;
}

const priorityColors = {
  low: "bg-green-500",
  medium: "bg-yellow-500", 
  high: "bg-red-500"
};

const categoryIcons = {
  personal: Coffee,
  work: Users,
  health: Sun,
  finance: DollarSign,
  learning: Brain,
  social: Users
};

const timeOfDay = {
  morning: { icon: Sun, label: "Maten", time: "6:00-12:00" },
  afternoon: { icon: Sun, label: "Apremidi", time: "12:00-18:00" },  
  evening: { icon: Moon, label: "Aswè", time: "18:00-24:00" }
};

export default function AgendaEnhanced() {
  const { userId } = useAuth();
  const isMobile = useIsMobile();
  
  // Data hooks
  const { data: tasks = [], isLoading: isLoadingTasks, refetch: refetchTasks } = useTasks(userId!);
  const { data: projects = [] } = useProjects(userId!);
  const { data: contacts = [] } = useContacts(userId!);
  
  // Mutations
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();

  // State
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month' | 'timeline'>('day');
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([]);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [productivity, setProductivity] = useState<ProductivityMetrics>({
    completionRate: 0,
    timeByCategory: {},
    weeklyTrend: [],
    focusTime: 0,
    breakTime: 0
  });

  // New task form state
  const [newTask, setNewTask] = useState<Partial<InsertTask>>({
    title: "",
    time: "",
    duration: 30,
    priority: "medium",
    category: "personal",
    status: "pending",
    location: "",
    objective: "",
    scheduledDate: selectedDate,
    isRecurring: false,
    userId: userId!
  });

  // AI Features
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [autoReplanning, setAutoReplanning] = useState(true);
  const [smartNotifications, setSmartNotifications] = useState(true);

  // Filter and search tasks
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.objective?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || task.category === selectedCategory;
    const matchesDate = viewMode === 'day' ? 
      isSameDay(new Date(task.scheduledDate || task.createdAt), selectedDate) :
      true; // For week/month views, show all
    return matchesSearch && matchesCategory && matchesDate;
  });

  // Calculate productivity metrics
  useEffect(() => {
    if (tasks.length > 0) {
      const completedTasks = tasks.filter(t => t.status === 'completed');
      const completionRate = (completedTasks.length / tasks.length) * 100;
      
      const timeByCategory = tasks.reduce((acc, task) => {
        const category = task.category || 'other';
        acc[category] = (acc[category] || 0) + (task.duration || 30);
        return acc;
      }, {} as Record<string, number>);

      setProductivity({
        completionRate,
        timeByCategory,
        weeklyTrend: [65, 70, 68, 75, 80, 85, 78], // Mock data
        focusTime: 180, // Mock data
        breakTime: 45 // Mock data
      });
    }
  }, [tasks]);

  // AI Suggestions based on user patterns
  useEffect(() => {
    const generateAISuggestions = () => {
      const suggestions = [];
      
      // Time-based suggestions
      const hour = new Date().getHours();
      if (hour < 10) {
        suggestions.push("🌅 Bon maten! Kòmanse ak tach ki pi difisil yo nan kòmansman an");
      } else if (hour > 18) {
        suggestions.push("🌙 Prepare pou demen: revize tach yo ak fè plan");
      }

      // Task-based suggestions
      const incompleteTasks = tasks.filter(t => t.status === 'pending');
      if (incompleteTasks.length > 5) {
        suggestions.push("📋 Ou gen " + incompleteTasks.length + " tach ki rete. Priyorite 3 ki pi enpòtan yo.");
      }

      // Health-based suggestions
      if (!tasks.some(t => t.category === 'health' && isSameDay(new Date(t.scheduledDate || t.createdAt), new Date()))) {
        suggestions.push("💪 Planifye yon aktivite pou sante ou jodi a");
      }

      setAiSuggestions(suggestions);
    };

    generateAISuggestions();
  }, [tasks, selectedDate]);

  const handleRefresh = async () => {
    await refetchTasks();
  };

  const handleCreateTask = async () => {
    if (!newTask.title || !userId) return;

    try {
      await createTaskMutation.mutateAsync(newTask as InsertTask);
      setNewTask({
        title: "",
        time: "",
        duration: 30,
        priority: "medium",
        category: "personal",
        status: "pending",
        location: "",
        objective: "",
        scheduledDate: selectedDate,
        isRecurring: false,
        userId: userId!
      });
      setIsAddTaskOpen(false);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleToggleTaskStatus = async (task: Task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    try {
      await updateTaskMutation.mutateAsync({
        id: parseInt(task.id),
        task: { status: newStatus }
      });
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTaskMutation.mutateAsync(parseInt(taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // Voice recognition for task creation
  const startVoiceRecognition = () => {
    setIsVoiceMode(true);
    // TODO: Implement actual voice recognition
    setTimeout(() => {
      setNewTask(prev => ({
        ...prev,
        title: "Rele Dominique demen"
      }));
      setIsVoiceMode(false);
    }, 2000);
  };

  // Auto-replanning feature
  const handleAutoReplan = () => {
    if (!autoReplanning) return;
    
    // AI logic to reschedule missed tasks
    const missedTasks = tasks.filter(t => 
      t.status === 'pending' && 
      new Date(t.scheduledDate || t.createdAt) < new Date()
    );
    
    // Reschedule to next available slots
    missedTasks.forEach(task => {
      const nextSlot = addDays(new Date(), 1);
      updateTaskMutation.mutate({
        id: parseInt(task.id),
        task: { scheduledDate: nextSlot }
      });
    });
  };

  const renderCalendarView = () => (
    <div className="space-y-4">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={(date) => date && setSelectedDate(date)}
        className="rounded-md border"
      />
      
      {/* Daily overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            {format(selectedDate, "EEEE, MMMM d, yyyy")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredTasks.map(task => {
              const CategoryIcon = categoryIcons[task.category as keyof typeof categoryIcons] || Circle;
              return (
                <div key={task.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent">
                  <button
                    onClick={() => handleToggleTaskStatus(task)}
                    className={cn(
                      "w-4 h-4 rounded-full border-2 flex items-center justify-center",
                      task.status === 'completed' ? "bg-green-500 border-green-500" : "border-muted-foreground"
                    )}
                  >
                    {task.status === 'completed' && <CheckCircle className="h-3 w-3 text-white" />}
                  </button>
                  
                  <CategoryIcon className="h-4 w-4 text-mused-foreground" />
                  
                  <div className="flex-1">
                    <p className={cn("text-sm", task.status === 'completed' && "line-through text-muted-foreground")}>
                      {task.title}
                    </p>
                    {task.time && (
                      <p className="text-xs text-muted-foreground">{task.time}</p>
                    )}
                  </div>
                  
                  <Badge
                    variant="outline"
                    className={cn("text-xs", priorityColors[task.priority as keyof typeof priorityColors])}
                  >
                    {task.priority}
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTimelineView = () => (
    <div className="space-y-4">
      {/* Time blocks for the day */}
      <div className="bg-card rounded-lg p-4">
        <h3 className="font-semibold mb-4">Timeline - {format(selectedDate, "MMM d")}</h3>
        
        <div className="space-y-2">
          {Array.from({ length: 24 }, (_, hour) => {
            const timeSlot = `${hour.toString().padStart(2, '0')}:00`;
            const tasksAtHour = filteredTasks.filter(task => task.time?.startsWith(hour.toString().padStart(2, '0')));
            
            return (
              <div key={hour} className="flex items-center gap-4 min-h-[40px] border-b border-border/50">
                <div className="w-16 text-sm text-muted-foreground">{timeSlot}</div>
                <div className="flex-1">
                  {tasksAtHour.map(task => (
                    <div key={task.id} className="flex items-center gap-2 bg-accent/50 rounded px-2 py-1 mb-1">
                      <span className="text-sm">{task.title}</span>
                      {task.duration && (
                        <Badge variant="secondary" className="text-xs">
                          {task.duration}min
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderProductivityStats = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Estatistik Pwodiktivite
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {productivity.completionRate.toFixed(0)}%
            </div>
            <div className="text-sm text-muted-foreground">Tach Complete</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {productivity.focusTime}min
            </div>
            <div className="text-sm text-muted-foreground">Deep Work</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {Object.keys(productivity.timeByCategory).length}
            </div>
            <div className="text-sm text-muted-foreground">Kategori Aktif</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {productivity.breakTime}min
            </div>
            <div className="text-sm text-muted-foreground">Tan Repo</div>
          </div>
        </div>

        {/* Weekly trend */}
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Tandans Semèn nan</h4>
          <div className="flex items-end gap-1 h-20">
            {productivity.weeklyTrend.map((value, index) => (
              <div
                key={index}
                className="flex-1 bg-primary/20 rounded-t"
                style={{ height: `${value}%` }}
                title={`Day ${index + 1}: ${value}%`}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderAIAssistant = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Asistan AI
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* AI Suggestions */}
          <div>
            <h4 className="text-sm font-medium mb-2">Sijesyon Entèlijan</h4>
            <div className="space-y-2">
              {aiSuggestions.map((suggestion, index) => (
                <div key={index} className="flex items-start gap-2 p-2 bg-accent/50 rounded">
                  <Lightbulb className="h-4 w-4 mt-0.5 text-yellow-500" />
                  <p className="text-sm">{suggestion}</p>
                </div>
              ))}
            </div>
          </div>

          {/* AI Features Toggle */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-replan">Auto-replanning</Label>
              <Switch
                id="auto-replan"
                checked={autoReplanning}
                onCheckedChange={setAutoReplanning}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="smart-notifications">Souvenans Entèlijan</Label>
              <Switch
                id="smart-notifications"
                checked={smartNotifications}
                onCheckedChange={setSmartNotifications}
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleAutoReplan}
              className="w-full"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Re-planifye Tach yo
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={startVoiceRecognition}
              className="w-full"
              disabled={isVoiceMode}
            >
              <Mic className="h-4 w-4 mr-2" />
              {isVoiceMode ? "Kap koute..." : "Kreye Tach ak Vwa"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const content = (
    <div className={cn("p-4 space-y-6", !isMobile && "p-6")}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">Ajanda & Tach</h1>
          <p className="text-muted-foreground">Jesyon ak planifikasyon ak AI</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAIAssistant(!showAIAssistant)}
          >
            <Brain className="h-4 w-4 mr-2" />
            AI
          </Button>
          
          <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nouvo Tach
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Kreye Nouvo Tach</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Tit tach la</Label>
                  <Input
                    id="title"
                    value={newTask.title || ""}
                    onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Egzanp: Rele dokta a"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="time">Lè</Label>
                    <Input
                      id="time"
                      type="time"
                      value={newTask.time || ""}
                      onChange={(e) => setNewTask(prev => ({ ...prev, time: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="duration">Durasyon (min)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={newTask.duration || 30}
                      onChange={(e) => setNewTask(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="priority">Priyorite</Label>
                    <Select 
                      value={newTask.priority || "medium"} 
                      onValueChange={(value) => setNewTask(prev => ({ ...prev, priority: value as any }))}
                    >
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
                  <div>
                    <Label htmlFor="category">Kategori</Label>
                    <Select 
                      value={newTask.category || "personal"} 
                      onValueChange={(value) => setNewTask(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="personal">Pèsonèl</SelectItem>
                        <SelectItem value="work">Travay</SelectItem>
                        <SelectItem value="health">Sante</SelectItem>
                        <SelectItem value="finance">Finans</SelectItem>
                        <SelectItem value="learning">Aprann</SelectItem>
                        <SelectItem value="social">Sosyal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="location">Kote</Label>
                  <Input
                    id="location"
                    value={newTask.location || ""}
                    onChange={(e) => setNewTask(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="📍 Kote w ap fè tach la?"
                  />
                </div>

                <div>
                  <Label htmlFor="objective">Objektif</Label>
                  <Input
                    id="objective"
                    value={newTask.objective || ""}
                    onChange={(e) => setNewTask(prev => ({ ...prev, objective: e.target.value }))}
                    placeholder="🎯 Ki sa w vle rive nan?"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="recurring"
                    checked={newTask.isRecurring || false}
                    onCheckedChange={(checked) => setNewTask(prev => ({ ...prev, isRecurring: checked }))}
                  />
                  <Label htmlFor="recurring">Tach rekuran</Label>
                </div>

                <Button 
                  onClick={handleCreateTask} 
                  className="w-full" 
                  disabled={createTaskMutation.isPending}
                >
                  {createTaskMutation.isPending ? 'Kap kreye...' : 'Kreye Tach'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Cherche tach..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tout Kategori</SelectItem>
            <SelectItem value="personal">Pèsonèl</SelectItem>
            <SelectItem value="work">Travay</SelectItem>
            <SelectItem value="health">Sante</SelectItem>
            <SelectItem value="finance">Finans</SelectItem>
            <SelectItem value="learning">Aprann</SelectItem>
            <SelectItem value="social">Sosyal</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* View Mode Tabs */}
      <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="day">Jou</TabsTrigger>
          <TabsTrigger value="week">Semèn</TabsTrigger>
          <TabsTrigger value="month">Mwa</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="day" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-4">
            <div className="lg:col-span-3">
              {renderCalendarView()}
            </div>
            <div className="space-y-4">
              {showAIAssistant && renderAIAssistant()}
              {renderProductivityStats()}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="week" className="space-y-4">
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Vue semèn yo ap vini nan yon versiyon k ap vini</p>
          </div>
        </TabsContent>

        <TabsContent value="month" className="space-y-4">
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Vue mwa yo ap vini nan yon versiyon k ap vini</p>
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          {renderTimelineView()}
        </TabsContent>
      </Tabs>
    </div>
  );

  return (
    <ResponsiveLayout currentPath="/agenda">
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