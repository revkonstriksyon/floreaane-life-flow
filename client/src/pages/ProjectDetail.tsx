import { useState, useEffect } from "react";
import { useRoute } from "wouter";
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
import { Checkbox } from "@/components/ui/checkbox";
import { 
  ArrowLeft,
  Edit,
  Save,
  Plus,
  Calendar,
  DollarSign,
  Users,
  FileText,
  Paperclip,
  MessageSquare,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Brain,
  Lightbulb,
  Zap,
  BarChart3
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AIInsights } from "@/components/ai/AIInsights";

type Project = Database['public']['Tables']['projects']['Row'];
type Task = Database['public']['Tables']['tasks']['Row'];

interface ProjectInsight {
  status: string;
  nextActions: string[];
  blockers?: string[];
  recommendations: string[];
  estimatedCompletion?: string;
}

const statusColors = {
  planning: "bg-blue-500",
  active: "bg-green-500",
  in_progress: "bg-yellow-500",
  on_hold: "bg-orange-500",
  completed: "bg-emerald-500",
  cancelled: "bg-red-500"
};

const statusLabels = {
  planning: "Planifikasyon",
  active: "Aktif",
  in_progress: "Nan Pwogrè",
  on_hold: "Sispann",
  completed: "Fini",
  cancelled: "Anile"
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

export default function ProjectDetail() {
  const [match, params] = useRoute("/projects/:id");
  const projectId = params?.id;
  const queryClient = useQueryClient();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedProject, setEditedProject] = useState<Partial<Project>>({});
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium",
    due_date: "",
    assigned_to: ""
  });
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

  // Fetch project data
  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();
      
      if (error) throw error;
      return data as Project;
    },
    enabled: !!projectId,
  });

  // Fetch project tasks
  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ['project-tasks', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Task[];
    },
    enabled: !!projectId,
  });

  // Get AI project analysis
  const { data: aiAnalysis, isLoading: analysisLoading } = useQuery({
    queryKey: ['project-analysis', projectId],
    queryFn: async () => {
      const response = await fetch('/api/ai/project-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          project,
          tasks,
          recentActivity: []
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get project analysis');
      }
      
      return response.json() as Promise<ProjectInsight>;
    },
    enabled: !!project && tasks.length >= 0,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Update project mutation
  const updateProject = useMutation({
    mutationFn: async (updates: Partial<Project>) => {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', projectId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', projectId] });
      setIsEditing(false);
      setEditedProject({});
    },
  });

  // Add task mutation
  const addTask = useMutation({
    mutationFn: async (task: any) => {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{ ...task, project_id: projectId, user_id: 'temp-user-id' }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-tasks', projectId] });
      setNewTask({
        title: "",
        description: "",
        priority: "medium",
        due_date: "",
        assigned_to: ""
      });
      setIsAddTaskOpen(false);
    },
  });

  const handleSaveProject = () => {
    if (Object.keys(editedProject).length > 0) {
      updateProject.mutate(editedProject);
    }
  };

  const handleAddTask = () => {
    if (newTask.title.trim()) {
      addTask.mutate(newTask);
    }
  };

  if (!match || !projectId) {
    return <div>Pwojè pa jwenn</div>;
  }

  if (projectLoading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex-1 overflow-auto flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Chaje pwojè a...</p>
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
            <h2 className="text-2xl font-bold mb-4">Pwojè pa jwenn</h2>
            <Button onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retounen
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const totalTasks = tasks.length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="flex h-screen bg-background">
      <Sidebar currentPath="/projects" />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-border/50 bg-card/30 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retounen
              </Button>
              
              <div>
                <div className="flex items-center gap-3 mb-2">
                  {isEditing ? (
                    <Input
                      value={editedProject.name ?? project.name}
                      onChange={(e) => setEditedProject({...editedProject, name: e.target.value})}
                      className="text-2xl font-bold bg-transparent border-none p-0 h-auto"
                    />
                  ) : (
                    <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                      {project.name}
                    </h1>
                  )}
                  
                  <Badge variant="outline" className={`${statusColors[project.status as keyof typeof statusColors]} text-white border-none`}>
                    {statusLabels[project.status as keyof typeof statusLabels]}
                  </Badge>
                </div>
                
                <p className="text-muted-foreground">
                  {isEditing ? (
                    <Textarea
                      value={editedProject.shortDescription ?? project.shortDescription ?? ""}
                      onChange={(e) => setEditedProject({...editedProject, shortDescription: e.target.value})}
                      className="min-h-[60px]"
                      placeholder="Deskripsyon pwojè a..."
                    />
                  ) : (
                    project.shortDescription || "Pa gen deskripsyon"
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <Button onClick={handleSaveProject} disabled={updateProject.isPending}>
                    <Save className="h-4 w-4 mr-2" />
                    Konsève
                  </Button>
                  <Button variant="outline" onClick={() => {
                    setIsEditing(false);
                    setEditedProject({});
                  }}>
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
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Project Overview */}
            <div className="lg:col-span-2 space-y-6">
              {/* AI Analysis */}
              {aiAnalysis && (
                <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-primary" />
                      🤖 Analiz IA Pwojè a
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <BarChart3 className="h-4 w-4" />
                        Sitiyasyon Jodi a
                      </h4>
                      <p className="text-sm text-muted-foreground">{aiAnalysis.status}</p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        Pwochen Aksyon yo
                      </h4>
                      <ul className="space-y-1">
                        {aiAnalysis.nextActions.map((action, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                            <CheckCircle className="h-3 w-3 mt-1 text-green-500" />
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {aiAnalysis.blockers && aiAnalysis.blockers.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          Blokaj yo
                        </h4>
                        <ul className="space-y-1">
                          {aiAnalysis.blockers.map((blocker, index) => (
                            <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                              <AlertTriangle className="h-3 w-3 mt-1 text-yellow-500" />
                              {blocker}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-blue-500" />
                        Rekòmandasyon yo
                      </h4>
                      <ul className="space-y-1">
                        {aiAnalysis.recommendations.map((rec, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                            <Lightbulb className="h-3 w-3 mt-1 text-blue-500" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {aiAnalysis.estimatedCompletion && (
                      <div>
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Estimasyon Konpletasyon
                        </h4>
                        <p className="text-sm text-muted-foreground">{aiAnalysis.estimatedCompletion}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Tasks Section */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Tâche yo ({completedTasks}/{totalTasks})
                    </CardTitle>
                    
                    <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Ajoute Tâche
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Nouvo Tâche</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="task-title">Tit</Label>
                            <Input
                              id="task-title"
                              value={newTask.title}
                              onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                              placeholder="Non tâche a..."
                            />
                          </div>
                          <div>
                            <Label htmlFor="task-description">Deskripsyon</Label>
                            <Textarea
                              id="task-description"
                              value={newTask.description}
                              onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                              placeholder="Detay sou tâche a..."
                            />
                          </div>
                          <div>
                            <Label htmlFor="task-priority">Priorite</Label>
                            <Select 
                              value={newTask.priority} 
                              onValueChange={(value) => setNewTask({...newTask, priority: value})}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Chwazi priorite" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="low">Ba</SelectItem>
                                <SelectItem value="medium">Mwayen</SelectItem>
                                <SelectItem value="high">Wo</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Button onClick={handleAddTask} className="w-full" disabled={addTask.isPending}>
                            Ajoute Tâche a
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {tasks.map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Checkbox 
                            checked={task.status === 'completed'}
                            className="h-4 w-4"
                          />
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
                          <Badge 
                            variant="outline" 
                            className={`${priorityColors[task.priority as keyof typeof priorityColors]} text-white border-none`}
                          >
                            {priorityLabels[task.priority as keyof typeof priorityLabels]}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    
                    {tasks.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>Pa gen tâche nan pwojè sa a ankò</p>
                        <Button 
                          variant="outline" 
                          className="mt-2"
                          onClick={() => setIsAddTaskOpen(true)}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Ajoute Premye Tâche a
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Project Stats & Info */}
            <div className="space-y-6">
              {/* Progress Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Pwogrè
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Konpletasyon</span>
                      <span>{Math.round(progressPercentage)}%</span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-500">{completedTasks}</p>
                      <p className="text-sm text-muted-foreground">Fini</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-500">{totalTasks - completedTasks}</p>
                      <p className="text-sm text-muted-foreground">Rete</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Project Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Detay Pwojè a
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Kategori</span>
                    <span className="font-medium">{project.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Priorite</span>
                    <Badge 
                      variant="outline" 
                      className={`${priorityColors[project.priority as keyof typeof priorityColors]} text-white border-none`}
                    >
                      {priorityLabels[project.priority as keyof typeof priorityLabels]}
                    </Badge>
                  </div>
                  {project.deadline && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Dat Limit</span>
                      <span className="font-medium">
                        {new Date(project.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {project.budget && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Bidjè</span>
                      <span className="font-medium">${project.budget}</span>
                    </div>
                  )}
                  {project.spent && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Depanse</span>
                      <span className="font-medium">${project.spent}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Aksyon Rapid
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    Pwograme Reyinyon
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Envi Manm Ekip
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Paperclip className="h-4 w-4 mr-2" />
                    Ajoute Dokiman
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Diskisyon Ekip
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}