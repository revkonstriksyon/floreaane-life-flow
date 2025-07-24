
import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowLeft, 
  Edit, 
  Save, 
  Users, 
  Calendar, 
  DollarSign, 
  Target,
  Clock,
  CheckCircle,
  AlertTriangle,
  Plus,
  FileText,
  Trash2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Project {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  status: string;
  priority: string | null;
  start_date: string | null;
  end_date: string | null;
  budget: number | null;
  spent: number | null;
  progress: number;
  team_members: string | null;
  created_at: string;
}

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string | null;
  scheduled_date: string | null;
  project_id: string | null;
}

export default function ProjectDetail() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProject, setEditedProject] = useState<Partial<Project>>({});
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium",
    scheduled_date: ""
  });
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchProjectData();
    }
  }, [params.id]);

  const fetchProjectData = async () => {
    try {
      const [projectResult, tasksResult] = await Promise.all([
        supabase.from('projects').select('*').eq('id', params.id).single(),
        supabase.from('tasks').select('*').eq('project_id', params.id)
      ]);

      if (projectResult.error) throw projectResult.error;
      if (tasksResult.error) throw tasksResult.error;

      setProject(projectResult.data);
      setTasks(tasksResult.data || []);
      setEditedProject(projectResult.data);
    } catch (error) {
      console.error('Error fetching project data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveProject = async () => {
    try {
      const { error } = await supabase
        .from('projects')
        .update(editedProject)
        .eq('id', params.id);

      if (error) throw error;

      setProject({ ...project!, ...editedProject });
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  const addTask = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{
          ...newTask,
          project_id: params.id,
          status: 'pending'
        }])
        .select();

      if (error) throw error;

      setTasks([...tasks, ...(data || [])]);
      setNewTask({
        title: "",
        description: "",
        priority: "medium",
        scheduled_date: ""
      });
      setIsAddTaskDialogOpen(false);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const updateTaskStatus = async (taskId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status })
        .eq('id', taskId);

      if (error) throw error;

      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, status } : task
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

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex-1 overflow-auto flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Chaje detay pwojè...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex-1 overflow-auto flex items-center justify-center">
          <div className="text-center">
            <AlertTriangle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Pwojè pa jwenn</h2>
            <p className="text-muted-foreground mb-4">Pwojè sa a pa egziste.</p>
            <Button onClick={() => setLocation("/projects")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retounen nan pwojè yo
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const totalTasks = tasks.length;
  const taskProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setLocation("/projects")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retounen
              </Button>
              <h1 className="text-3xl font-bold">{project.name}</h1>
              <Badge variant={project.status === 'completed' ? 'default' : 'secondary'}>
                {project.status}
              </Badge>
            </div>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button onClick={saveProject}>
                    <Save className="h-4 w-4 mr-2" />
                    Sovgade
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Anile
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Modifye
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Project Info */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Enfòmasyon Pwojè</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Non</Label>
                        <Input
                          id="name"
                          value={editedProject.name || ''}
                          onChange={(e) => setEditedProject({...editedProject, name: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Deskripsyon</Label>
                        <Textarea
                          id="description"
                          value={editedProject.description || ''}
                          onChange={(e) => setEditedProject({...editedProject, description: e.target.value})}
                          rows={3}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="status">Estati</Label>
                          <Select
                            value={editedProject.status}
                            onValueChange={(value) => setEditedProject({...editedProject, status: value})}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="planning">Planifikasyon</SelectItem>
                              <SelectItem value="active">Aktif</SelectItem>
                              <SelectItem value="in_progress">Nan Kous</SelectItem>
                              <SelectItem value="completed">Konplete</SelectItem>
                              <SelectItem value="on_hold">An Pòz</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="priority">Priyorite</Label>
                          <Select
                            value={editedProject.priority || ''}
                            onValueChange={(value) => setEditedProject({...editedProject, priority: value})}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Ba</SelectItem>
                              <SelectItem value="medium">Mwayen</SelectItem>
                              <SelectItem value="high">Wo</SelectItem>
                              <SelectItem value="urgent">Ijan</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-sm text-muted-foreground">Deskripsyon</h3>
                        <p className="mt-1">{project.description || 'Pa gen deskripsyon'}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h3 className="font-semibold text-sm text-muted-foreground">Dat kòmanse</h3>
                          <p className="mt-1">{project.start_date ? new Date(project.start_date).toLocaleDateString() : 'Pa defini'}</p>
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm text-muted-foreground">Dat fini</h3>
                          <p className="mt-1">{project.end_date ? new Date(project.end_date).toLocaleDateString() : 'Pa defini'}</p>
                        </div>
                      </div>
                    </div>
  )}
                </CardContent>
              </Card>

              {/* Tasks */}
              <Card className="mt-6">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Tach yo ({totalTasks})</CardTitle>
                    <Dialog open={isAddTaskDialogOpen} onOpenChange={setIsAddTaskDialogOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Ajoute Tach
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Nouvo Tach</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="task-title">Tit</Label>
                            <Input
                              id="task-title"
                              value={newTask.title}
                              onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label htmlFor="task-description">Deskripsyon</Label>
                            <Textarea
                              id="task-description"
                              value={newTask.description}
                              onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="task-priority">Priyorite</Label>
                              <Select
                                value={newTask.priority}
                                onValueChange={(value) => setNewTask({...newTask, priority: value})}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="low">Ba</SelectItem>
                                  <SelectItem value="medium">Mwayen</SelectItem>
                                  <SelectItem value="high">Wo</SelectItem>
                                  <SelectItem value="urgent">Ijan</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="task-date">Dat</Label>
                              <Input
                                id="task-date"
                                type="date"
                                value={newTask.scheduled_date}
                                onChange={(e) => setNewTask({...newTask, scheduled_date: e.target.value})}
                              />
                            </div>
                          </div>
                          <Button onClick={addTask} className="w-full">
                            Ajoute Tach
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {tasks.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        Pa gen tach nan pwojè sa a
                      </p>
                    ) : (
                      tasks.map((task) => (
                        <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateTaskStatus(task.id, task.status === 'completed' ? 'pending' : 'completed')}
                            >
                              {task.status === 'completed' ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <Clock className="h-4 w-4 text-gray-400" />
                              )}
                            </Button>
                            <div>
                              <p className={`font-medium ${task.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
                                {task.title}
                              </p>
                              {task.description && (
                                <p className="text-sm text-muted-foreground">{task.description}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'default' : 'secondary'}>
                              {task.priority}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteTask(task.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Stats */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pwogrè</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Pwojè</span>
                        <span>{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Tach yo</span>
                        <span>{Math.round(taskProgress)}%</span>
                      </div>
                      <Progress value={taskProgress} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Estatistik</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Tach konplete</span>
                      </div>
                      <span className="font-semibold">{completedTasks}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-orange-500" />
                        <span className="text-sm">Tach ki rete</span>
                      </div>
                      <span className="font-semibold">{totalTasks - completedTasks}</span>
                    </div>
                    {project.budget && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-blue-600" />
                          <span className="text-sm">Bidjè</span>
                        </div>
                        <span className="font-semibold">${project.budget}</span>
                      </div>
                    )}
                    {project.spent && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-red-500" />
                          <span className="text-sm">Depanse</span>
                        </div>
                        <span className="font-semibold">${project.spent}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
