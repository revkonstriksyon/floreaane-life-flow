import { useState, useEffect } from "react";
import { ResponsiveLayout } from "@/components/layout/ResponsiveLayout";
import { PullToRefresh, TouchOptimizedButton } from "@/components/mobile/TouchOptimized";
import { SwipeCard } from "@/components/mobile/SwipeCard";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { AIInsights } from "@/components/ai/AIInsights";
import { AIChat } from "@/components/ai/AIChat";
import { 
  FolderOpen, 
  Plus, 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  BarChart3, 
  Calendar,
  Users,
  Target,
  Clock,
  DollarSign,
  Edit,
  Eye,
  Archive,
  MoreHorizontal,
  Briefcase,
  Home,
  Palette,
  Music,
  Gavel,
  Plane,
  Lightbulb,
  AlertTriangle
} from "lucide-react";

interface Project {
  id: string;
  user_id: string;
  name: string;
  short_description: string | null;
  status: string;
  category: string;
  progress: number;
  deadline: string | null;
  budget: number | null;
  spent: number | null;
  team: number | null;
  priority: string;
  tags: string[] | null;
  last_activity: string | null;
  is_private: boolean | null;
  created_at: string;
  updated_at: string;
}

const projectCategories = {
  personal: { label: "Pèsonèl", icon: Home, color: "bg-blue-500" },
  work: { label: "Travay", icon: Briefcase, color: "bg-green-500" },
  creative: { label: "Kreyatif", icon: Palette, color: "bg-purple-500" },
  health: { label: "Sante", icon: Target, color: "bg-red-500" },
  education: { label: "Edikasyon", icon: Lightbulb, color: "bg-yellow-500" },
  finance: { label: "Finans", icon: DollarSign, color: "bg-emerald-500" },
  travel: { label: "Vwayaj", icon: Plane, color: "bg-cyan-500" },
  music: { label: "Mizik", icon: Music, color: "bg-pink-500" },
  legal: { label: "Legal", icon: Gavel, color: "bg-gray-500" },
  other: { label: "Lòt", icon: FolderOpen, color: "bg-indigo-500" }
};

const statusColors = {
  planning: "bg-gray-500",
  active: "bg-green-500", 
  in_progress: "bg-blue-500",
  on_hold: "bg-yellow-500",
  completed: "bg-emerald-500",
  cancelled: "bg-red-500"
};

const statusLabels = {
  planning: "Ap planifye",
  active: "Aktif",
  in_progress: "Ap kontinye",
  on_hold: "Sispann",
  completed: "Fini",
  cancelled: "Anile"
};

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: "",
    short_description: "",
    category: "",
    status: "planning",
    priority: "medium",
    deadline: "",
    budget: 0,
    team: 1,
    tags: "",
    is_private: false
  });
    const [location, setLocation] = useState("/");

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [projects, searchQuery, selectedCategory, selectedStatus]);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterProjects = () => {
    let filtered = projects;

    if (searchQuery) {
      filtered = filtered.filter(project => 
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.short_description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(project => project.category === selectedCategory);
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter(project => project.status === selectedStatus);
    }

    setFilteredProjects(filtered);
  };

  const addProject = async () => {
    try {
      const projectData = {
        ...newProject,
        tags: newProject.tags ? newProject.tags.split(',').map(tag => tag.trim()) : [],
        deadline: newProject.deadline || null,
        budget: newProject.budget || null
      };

      const { data, error } = await supabase
        .from('projects')
        .insert([projectData])
        .select();

      if (error) throw error;

      setProjects([...(data || []), ...projects]);
      setNewProject({
        name: "",
        short_description: "",
        category: "",
        status: "planning",
        priority: "medium",
        deadline: "",
        budget: 0,
        team: 1,
        tags: "",
        is_private: false
      });
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Error adding project:', error);
    }
  };

  const updateProjectProgress = async (projectId: string, newProgress: number) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ 
          progress: newProgress,
          status: newProgress === 100 ? 'completed' : 'in_progress'
        })
        .eq('id', projectId);

      if (error) throw error;

      setProjects(projects.map(project => 
        project.id === projectId 
          ? { ...project, progress: newProgress, status: newProgress === 100 ? 'completed' : 'in_progress' }
          : project
      ));
    } catch (error) {
      console.error('Error updating project progress:', error);
    }
  };

  const getTotalBudget = () => projects.reduce((sum, p) => sum + (p.budget || 0), 0);
  const getTotalSpent = () => projects.reduce((sum, p) => sum + (p.spent || 0), 0);
  const getActiveProjects = () => projects.filter(p => p.status === 'active' || p.status === 'in_progress').length;
  const getCompletedProjects = () => projects.filter(p => p.status === 'completed').length;

  const isMobile = useIsMobile();

  const handleRefresh = async () => {
    await fetchProjects();
  };

  if (isLoading) {
    return (
      <ResponsiveLayout currentPath="/projects">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Chaje pwojè yo...</p>
          </div>
        </div>
      </ResponsiveLayout>
    );
  }

  const content = (
    <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-border/50 bg-card/30 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Pwojè & Inisyativ
              </h1>
              <p className="text-muted-foreground mt-1">
                Jere ak swiv pwogre pwojè ou yo
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Chèche pwojè..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tout Kategori</SelectItem>
                  {Object.entries(projectCategories).map(([key, category]) => (
                    <SelectItem key={key} value={key}>{category.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-gradient-primary">
                    <Plus className="h-4 w-4 mr-2" />
                    Nouvo Pwojè
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Kreye nouvo pwojè</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Non pwojè a</Label>
                      <Input
                        id="name"
                        value={newProject.name}
                        onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                        placeholder="Egzanp: Aprann kreyon nouvo"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Deskripsyon kout</Label>
                      <Textarea
                        id="description"
                        value={newProject.short_description}
                        onChange={(e) => setNewProject({...newProject, short_description: e.target.value})}
                        placeholder="Eksplike pwojè a nan kèk mo..."
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category">Kategori</Label>
                        <Select value={newProject.category} onValueChange={(value) => setNewProject({...newProject, category: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Chwazi" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(projectCategories).map(([key, category]) => (
                              <SelectItem key={key} value={key}>{category.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="priority">Priyorite</Label>
                        <Select value={newProject.priority} onValueChange={(value) => setNewProject({...newProject, priority: value})}>
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
                      <Label htmlFor="deadline">Dat limit</Label>
                      <Input
                        id="deadline"
                        type="date"
                        value={newProject.deadline}
                        onChange={(e) => setNewProject({...newProject, deadline: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="budget">Bidjè ($)</Label>
                      <Input
                        id="budget"
                        type="number"
                        value={newProject.budget}
                        onChange={(e) => setNewProject({...newProject, budget: parseFloat(e.target.value) || 0})}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="tags">Tag yo (separe ak vigil)</Label>
                      <Input
                        id="tags"
                        value={newProject.tags}
                        onChange={(e) => setNewProject({...newProject, tags: e.target.value})}
                        placeholder="enpotan, travay, ak, ak"
                      />
                    </div>
                    <Button onClick={addProject} className="w-full">
                      Kreye pwojè a
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
                  <p className="text-sm text-muted-foreground">Total Pwojè</p>
                  <p className="text-2xl font-bold">{projects.length}</p>
                </div>
                <FolderOpen className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Aktif</p>
                  <p className="text-2xl font-bold text-green-500">{getActiveProjects()}</p>
                </div>
                <Target className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Konplè</p>
                  <p className="text-2xl font-bold text-emerald-500">{getCompletedProjects()}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Bidjè Total</p>
                  <p className="text-2xl font-bold">${getTotalBudget().toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">
                    ${getTotalSpent().toLocaleString()} yo depanse
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Insights */}
        <div className="p-6 pb-0">
          <AIInsights 
            data={projects} 
            type="projects" 
            title="Konsey AI pou Pwojè yo"
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <Tabs defaultValue="grid" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="grid">Grid</TabsTrigger>
              <TabsTrigger value="list">Lis</TabsTrigger>
              <TabsTrigger value="kanban">Kanban</TabsTrigger>
            </TabsList>

            <TabsContent value="grid">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => {
                  const category = projectCategories[project.category as keyof typeof projectCategories];
                  const IconComponent = category?.icon || FolderOpen;
                  const isOverdue = project.deadline && new Date(project.deadline) < new Date() && project.status !== 'completed';

                  return (
                    <Card key={project.id} className={`hover:shadow-md transition-shadow ${isOverdue ? 'border-red-200' : ''}`}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${category?.color || 'bg-gray-500'} bg-opacity-10`}>
                              <IconComponent className={`h-5 w-5 ${category?.color || 'text-gray-500'}`} />
                            </div>
                            <div>
                              <CardTitle className="text-lg line-clamp-1">{project.name}</CardTitle>
                              <p className="text-sm text-muted-foreground">
                                {category?.label || project.category}
                              </p>
                            </div>
                          </div>
                          <Badge 
                            variant="outline" 
                            className={`${statusColors[project.status as keyof typeof statusColors]} text-white border-none`}
                          >
                            {statusLabels[project.status as keyof typeof statusLabels]}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {project.short_description && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                            {project.short_description}
                          </p>
                        )}

                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Pwogre</span>
                              <span>{project.progress}%</span>
                            </div>
                            <Progress value={project.progress} className="h-2" />
                          </div>

                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            {project.deadline && (
                              <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-500' : ''}`}>
                                <Calendar className="h-4 w-4" />
                                <span>{new Date(project.deadline).toLocaleDateString()}</span>
                                {isOverdue && <AlertTriangle className="h-4 w-4" />}
                              </div>
                            )}
                            {project.team && project.team > 1 && (
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                <span>{project.team}</span>
                              </div>
                            )}
                          </div>

                          {project.budget && (
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Bidjè:</span>
                              <span className="font-medium">${project.budget.toLocaleString()}</span>
                            </div>
                          )}

                          {project.tags && project.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {project.tags.slice(0, 3).map((tag, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {project.tags.length > 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{project.tags.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="flex justify-between mt-4">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            Wè
                          </Button>
                          <div className="flex gap-1">
                            <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setLocation(`/projects/${project.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="list">
              <div className="space-y-4">
                {filteredProjects.map((project) => {
                  const category = projectCategories[project.category as keyof typeof projectCategories];
                  const IconComponent = category?.icon || FolderOpen;
                  const isOverdue = project.deadline && new Date(project.deadline) < new Date() && project.status !== 'completed';

                  return (
                    <Card key={project.id} className={`hover:shadow-md transition-shadow ${isOverdue ? 'border-red-200' : ''}`}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            <div className={`p-3 rounded-lg ${category?.color || 'bg-gray-500'} bg-opacity-10`}>
                              <IconComponent className={`h-6 w-6 ${category?.color || 'text-gray-500'}`} />
                            </div>

                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-lg">{project.name}</h3>
                                <Badge 
                                  variant="outline" 
                                  className={`${statusColors[project.status as keyof typeof statusColors]} text-white border-none`}
                                >
                                  {statusLabels[project.status as keyof typeof statusLabels]}
                                </Badge>
                                {isOverdue && <AlertTriangle className="h-4 w-4 text-red-500" />}
                              </div>

                              <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
                                {project.short_description}
                              </p>

                              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <BarChart3 className="h-4 w-4" />
                                  <span>{project.progress}%</span>
                                </div>
                                {project.deadline && (
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    <span>{new Date(project.deadline).toLocaleDateString()}</span>
                                  </div>
                                )}
                                {project.budget && (
                                  <div className="flex items-center gap-1">
                                    <DollarSign className="h-4 w-4" />
                                    <span>${project.budget.toLocaleString()}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="w-32">
                              <Progress value={project.progress} className="h-2" />
                            </div>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              Wè
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="kanban">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {Object.entries(statusLabels).map(([status, label]) => {
                  const statusProjects = filteredProjects.filter(p => p.status === status);
                  return (
                    <div key={status} className="space-y-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${statusColors[status as keyof typeof statusColors]}`}></div>
                        <h3 className="font-semibold">{label}</h3>
                        <Badge variant="secondary">{statusProjects.length}</Badge>
                      </div>
                      <div className="space-y-3">
                        {statusProjects.map((project) => {
                          const category = projectCategories[project.category as keyof typeof projectCategories];
                          const IconComponent = category?.icon || FolderOpen;

                          return (
                            <Card key={project.id} className="p-3 hover:shadow-md transition-shadow cursor-pointer">
                              <div className="flex items-start gap-2 mb-2">
                                <IconComponent className="h-4 w-4 text-muted-foreground mt-1" />
                                <div className="flex-1">
                                  <h4 className="font-medium text-sm line-clamp-2">{project.name}</h4>
                                  {project.short_description && (
                                    <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                                      {project.short_description}
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Progress value={project.progress} className="h-1" />
                                <div className="flex justify-between text-xs text-muted-foreground">
                                  <span>{project.progress}%</span>
                                  {project.deadline && (
                                    <span>{new Date(project.deadline).toLocaleDateString()}</span>
                                  )}
                                </div>
                              </div>
                            </Card>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* AI Chat */}
        <AIChat 
          context="Mwen gen plizyè pwojè k ap travay sou yo."
          suggestions={[
            "Ki pwojè ki bezwen pi plis atansyon?",
            "Ki jan pou jere delè pwojè yo?",
            "Bay konsey pou amelyore jesyon pwojè",
            "Ki priyorite pou semèn nan?"
          ]}
        />
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