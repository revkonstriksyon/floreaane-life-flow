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

export default function Agenda() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState("day");
  const [searchTerm, setSearchTerm] = useState("");
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    due_date: "",
    due_time: "",
    priority: "medium",
    status: "pending",
    category: "",
    location: "",
    estimated_duration: 60,
    is_recurring: false,
    recurring_pattern: ""
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('due_date', { ascending: true });

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addTask = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([newTask])
        .select();

      if (error) throw error;

      setTasks([...tasks, ...(data || [])]);
      setNewTask({
        title: "",
        description: "",
        due_date: "",
        due_time: "",
        priority: "medium",
        status: "pending",
        category: "",
        location: "",
        estimated_duration: 60,
        is_recurring: false,
        recurring_pattern: ""
      });
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const toggleTaskStatus = async (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: newStatus })
        .eq('id', taskId);

      if (error) throw error;

      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      ));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const selectedDateTasks = tasks.filter(task => {
    if (!selectedDate) return false;
    const taskDate = new Date(task.due_date);
    return taskDate.toDateString() === selectedDate.toDateString();
  });

  const todayTasks = tasks.filter(task => {
    const today = new Date();
    const taskDate = new Date(task.due_date);
    return taskDate.toDateString() === today.toDateString();
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
            <p className="mt-4 text-muted-foreground">Chaje tach yo...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Ajanda & Tach</h1>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvo tach
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
                      placeholder="Egzanp: Reyinyon ak kliyan"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Deskripsyon</Label>
                    <Textarea
                      id="description"
                      value={newTask.description}
                      onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                      placeholder="Deskripsyon tach la..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="due_date">Dat</Label>
                      <Input
                        id="due_date"
                        type="date"
                        value={newTask.due_date}
                        onChange={(e) => setNewTask({...newTask, due_date: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="due_time">Lè</Label>
                      <Input
                        id="due_time"
                        type="time"
                        value={newTask.due_time}
                        onChange={(e) => setNewTask({...newTask, due_time: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="priority">Priyorite</Label>
                    <Select value={newTask.priority} onValueChange={(value) => setNewTask({...newTask, priority: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chwazi priyorite" />
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
                    <Input
                      id="category"
                      value={newTask.category}
                      onChange={(e) => setNewTask({...newTask, category: e.target.value})}
                      placeholder="travay, pèsonèl, sante..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Kote</Label>
                    <Input
                      id="location"
                      value={newTask.location}
                      onChange={(e) => setNewTask({...newTask, location: e.target.value})}
                      placeholder="Biwo a, kay la..."
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="is_recurring" 
                      checked={newTask.is_recurring}
                      onCheckedChange={(checked) => setNewTask({...newTask, is_recurring: checked as boolean})}
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar Section */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5" />
                  Kalandriye
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />

                <div className="mt-4 space-y-2">
                  <h3 className="font-semibold">
                    Tach yo {selectedDate ? selectedDate.toLocaleDateString() : 'jodi a'}
                  </h3>
                  <div className="space-y-1">
                    {selectedDateTasks.slice(0, 5).map((task) => (
                      <div key={task.id} className="flex items-center gap-2 p-2 bg-muted rounded">
                        <button onClick={() => toggleTaskStatus(task.id, task.status)}>
                          {task.status === 'completed' ? 
                            <CheckCircle className="h-4 w-4 text-green-500" /> : 
                            <Circle className="h-4 w-4" />
                          }
                        </button>
                        <span className={`text-sm flex-1 ${task.status === 'completed' ? 'line-through' : ''}`}>
                          {task.title}
                        </span>
                        <Badge 
                          variant={task.priority === 'high' ? 'destructive' : 'secondary'}
                          className="text-xs"
                        >
                          {task.priority}
                        </Badge>
                      </div>
                    ))}
                    {selectedDateTasks.length === 0 && (
                      <p className="text-sm text-muted-foreground">Pa gen tach yo jou sa a</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tasks Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Tach jodi a</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalTasksToday}</div>
                    <p className="text-xs text-muted-foreground">
                      {completedTasksToday} fèt, {totalTasksToday - completedTasksToday} rete
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Pwodiktivite</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{Math.round(completionRate)}%</div>
                    <p className="text-xs text-muted-foreground">To konpletasyon jodi a</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Total tach</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{tasks.length}</div>
                    <p className="text-xs text-muted-foreground">Nan sistèm nan</p>
                  </CardContent>
                </Card>
              </div>

              {/* Tasks List */}
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Input
                    placeholder="Chèche tach..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtre
                  </Button>
                </div>

                <div className="space-y-4">
                  {tasks
                    .filter(task => 
                      task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      task.description?.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((task) => (
                      <Card key={task.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3 flex-1">
                              <button 
                                className="mt-1"
                                onClick={() => toggleTaskStatus(task.id, task.status)}
                              >
                                {task.status === 'completed' ? 
                                  <CheckCircle className="h-5 w-5 text-green-500" /> : 
                                  <Circle className="h-5 w-5 text-muted-foreground" />
                                }
                              </button>

                              <div className="flex-1">
                                <h3 className={`font-semibold ${task.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
                                  {task.title}
                                </h3>
                                {task.description && (
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {task.description}
                                  </p>
                                )}

                                <div className="flex items-center gap-4 mt-2">
                                  {task.due_date && (
                                    <div className="flex items-center gap-1">
                                      <CalendarDays className="h-4 w-4" />
                                      <span className="text-sm">
                                        {new Date(task.due_date).toLocaleDateString()}
                                        {task.due_time && ` ${task.due_time}`}
                                      </span>
                                    </div>
                                  )}

                                  {task.location && (
                                    <div className="flex items-center gap-1">
                                      <MapPin className="h-4 w-4" />
                                      <span className="text-sm">{task.location}</span>
                                    </div>
                                  )}

                                  {task.is_recurring && (
                                    <div className="flex items-center gap-1">
                                      <Repeat className="h-4 w-4" />
                                      <span className="text-sm">Repete</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <Badge 
                                variant={
                                  task.priority === 'high' ? 'destructive' : 
                                  task.priority === 'medium' ? 'default' : 'secondary'
                                }
                              >
                                <Flame className="h-3 w-3 mr-1" />
                                {task.priority}
                              </Badge>

                              {task.category && (
                                <Badge variant="outline">
                                  {task.category}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>

                {tasks.length === 0 && (
                  <div className="text-center py-12">
                    <Clock className="h-24 w-24 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Pa gen tach ankò</h3>
                    <p className="text-muted-foreground">Kòmanse ak ajoute premye tach ou a.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}