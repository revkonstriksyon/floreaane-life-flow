import { useState, useEffect } from "react";
import { ResponsiveLayout } from "@/components/layout/ResponsiveLayout";
import { PullToRefresh, TouchOptimizedButton } from "@/components/mobile/TouchOptimized";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  ArrowLeft,
  Edit,
  Users,
  Calendar,
  DollarSign,
  FileText,
  MessageSquare,
  Plus,
  Clock,
  CheckCircle,
  AlertTriangle,
  Target,
  Upload,
  Link,
  BarChart3,
  Settings,
  Archive,
  Play,
  Pause,
  MoreHorizontal
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useLocation } from "wouter";

interface Project {
  id: string;
  name: string;
  short_description: string;
  description?: string;
  category: string;
  status: string;
  priority: string;
  progress: number;
  deadline: string;
  budget?: number;
  spent?: number;
  team: number;
  tags?: string;
  created_at: string;
  updated_at: string;
}

interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  due_date?: string;
  project_id: string;
  completed: boolean;
}

const statusConfig = {
  planning: { label: "An planifikasyon", color: "bg-blue-100 text-blue-800", icon: Clock },
  active: { label: "Aktif", color: "bg-green-100 text-green-800", icon: Play },
  paused: { label: "Anret", color: "bg-yellow-100 text-yellow-800", icon: Pause },
  completed: { label: "Fini", color: "bg-green-100 text-green-800", icon: CheckCircle },
  cancelled: { label: "Abandone", color: "bg-red-100 text-red-800", icon: AlertTriangle }
};

export default function ProjectDetail({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [, setLocation] = useLocation();
  const isMobile = useIsMobile();

  const [editProject, setEditProject] = useState({
    name: "",
    short_description: "",
    description: "",
    status: "",
    deadline: "",
    budget: 0
  });

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium",
    due_date: ""
  });

  const fetchProjectData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch project details
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', params.id)
        .single();

      if (projectError) throw projectError;
      
      setProject(projectData);
      setEditProject({
        name: projectData.name,
        short_description: projectData.short_description,
        description: projectData.description || "",
        status: projectData.status,
        deadline: projectData.deadline,
        budget: projectData.budget || 0
      });

      // Fetch project tasks
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .eq('project_id', params.id)
        .order('created_at', { ascending: false });

      if (tasksError) throw tasksError;
      setTasks(tasksData || []);

    } catch (error) {
      console.error('Error fetching project data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectData();
  }, [params.id]);

  const handleRefresh = async () => {
    await fetchProjectData();
  };

  const updateProject = async () => {
    try {
      const { error } = await supabase
        .from('projects')
        .update(editProject)
        .eq('id', params.id);

      if (error) throw error;

      setProject(prev => prev ? { ...prev, ...editProject } : null);
      setIsEditingProject(false);
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const addTask = async () => {
    try {
      const taskData = {
        ...newTask,
        project_id: params.id,
        status: 'pending',
        completed: false
      };

      const { data, error } = await supabase
        .from('tasks')
        .insert([taskData])
        .select();

      if (error) throw error;

      if (data) {
        setTasks([...data, ...tasks]);
        setNewTask({
          title: "",
          description: "",
          priority: "medium",
          due_date: ""
        });
        setIsAddingTask(false);
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const toggleTaskCompletion = async (taskId: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ 
          completed: !completed,
          status: !completed ? 'completed' : 'pending'
        })
        .eq('id', taskId);

      if (error) throw error;

      setTasks(tasks.map(task => 
        task.id === taskId 
          ? { ...task, completed: !completed, status: !completed ? 'completed' : 'pending' }
          : task
      ));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const updateProjectProgress = async (newProgress: number) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ 
          progress: newProgress,
          status: newProgress === 100 ? 'completed' : 'active'
        })
        .eq('id', params.id);

      if (error) throw error;

      setProject(prev => prev ? { 
        ...prev, 
        progress: newProgress,
        status: newProgress === 100 ? 'completed' : 'active'
      } : null);
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  if (isLoading || !project) {
    return (
      <ResponsiveLayout currentPath="/projects">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Chaje pwojè a...</p>
          </div>
        </div>
      </ResponsiveLayout>
    );
  }

  const statusInfo = statusConfig[project.status as keyof typeof statusConfig];
  const StatusIcon = statusInfo?.icon || Clock;
  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const content = (
    <div className={cn("p-4 space-y-6", !isMobile && "p-6")}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation('/projects')}
            className="p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{project.name}</h1>
            <p className="text-muted-foreground">{project.short_description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={cn("", statusInfo?.color)}>
            <StatusIcon className="h-3 w-3 mr-1" />
            {statusInfo?.label}
          </Badge>
          <Button variant="outline" size="sm" onClick={() => setIsEditingProject(true)}>
            <Edit className="h-4 w-4" />
            {!isMobile && <span className="ml-2">Edit</span>}
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className={cn(
        "grid gap-4",
        isMobile ? "grid-cols-2" : "grid-cols-4"
      )}>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{project.progress}%</div>
            <div className="text-sm text-muted-foreground">Pwogre</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
            <div className="text-sm text-muted-foreground">Tach Fini</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{totalTasks}</div>
            <div className="text-sm text-muted-foreground">Total Tach</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{project.team}</div>
            <div className="text-sm text-muted-foreground">Ekip</div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Pwogre Jeneral</span>
              <span className="font-medium">{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className={cn(
          "grid w-full",
          isMobile ? "grid-cols-3" : "grid-cols-5"
        )}>
          <TabsTrigger value="overview">Apèsi</TabsTrigger>
          <TabsTrigger value="tasks">Tach</TabsTrigger>
          <TabsTrigger value="files">Fichye</TabsTrigger>
          {!isMobile && <TabsTrigger value="budget">Bidjè</TabsTrigger>}
          {!isMobile && <TabsTrigger value="team">Ekip</TabsTrigger>}
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Deskripsyon Pwojè a</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {project.description || project.short_description}
              </p>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Enfòmasyon Dat
              </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Kòmanse:</span>
                    <span>{new Date(project.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Dat Limit:</span>
                    <span>{new Date(project.deadline).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Estatistik
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Konplesyon Tach:</span>
                    <span>{taskCompletionRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Priyorite:</span>
                    <span className="capitalize">{project.priority}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tasks Tab */}
        <TabsContent value="tasks" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Tach yo ({tasks.length})</h3>
            <Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
              <DialogTrigger asChild>
                <TouchOptimizedButton size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvo Tach
                </TouchOptimizedButton>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Ajoute Nouvo Tach</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="task-title">Tit tach la</Label>
                    <Input
                      id="task-title"
                      value={newTask.title}
                      onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                      placeholder="Tit tach la"
                    />
                  </div>
                  <div>
                    <Label htmlFor="task-description">Deskripsyon</Label>
                    <Textarea
                      id="task-description"
                      value={newTask.description}
                      onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                      placeholder="Deskripsyon tach la..."
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="task-due">Dat Limit</Label>
                    <Input
                      id="task-due"
                      type="date"
                      value={newTask.due_date}
                      onChange={(e) => setNewTask({...newTask, due_date: e.target.value})}
                    />
                  </div>
                  <Button onClick={addTask} className="w-full">
                    Ajoute Tach
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-3">
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <Card key={task.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => toggleTaskCompletion(task.id, task.completed)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <h4 className={cn(
                          "font-medium",
                          task.completed && "line-through text-muted-foreground"
                        )}>
                          {task.title}
                        </h4>
                        {task.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {task.description}
                          </p>
                        )}
                        {task.due_date && (
                          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(task.due_date).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Pa gen tach yo nan pwojè a</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Files Tab */}
        <TabsContent value="files" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Dokiman ak Fichye
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">Pa gen fichye yo nan pwojè a</p>
                <TouchOptimizedButton>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Fichye
                </TouchOptimizedButton>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Budget Tab */}
        <TabsContent value="budget" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Bidjè & Depans
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      ${project.budget || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">Bidjè</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      ${project.spent || 0}
                    </div>
                    <div className="text-sm text-muted-foreground">Depanse</div>
                  </div>
                </div>
                <Progress 
                  value={project.budget ? ((project.spent || 0) / project.budget) * 100 : 0} 
                  className="h-2" 
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Manm Ekip la
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  {project.team} manm nan ekip la
                </p>
                <TouchOptimizedButton>
                  <Plus className="h-4 w-4 mr-2" />
                  Envite Manm
                </TouchOptimizedButton>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Project Dialog */}
      <Dialog open={isEditingProject} onOpenChange={setIsEditingProject}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Pwojè a</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Non pwojè a</Label>
              <Input
                id="edit-name"
                value={editProject.name}
                onChange={(e) => setEditProject({...editProject, name: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Deskripsyon kout</Label>
              <Textarea
                id="edit-description"
                value={editProject.short_description}
                onChange={(e) => setEditProject({...editProject, short_description: e.target.value})}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="edit-progress">Pwogre (%)</Label>
              <Input
                id="edit-progress"
                type="number"
                min="0"
                max="100"
                value={project.progress}
                onChange={(e) => updateProjectProgress(parseInt(e.target.value) || 0)}
              />
            </div>
            <Button onClick={updateProject} className="w-full">
              Sove Chanjman yo
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );

  return (
    <ResponsiveLayout currentPath="/projects">
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