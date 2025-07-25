import { useState, useEffect } from "react";
import { ResponsiveLayout } from "@/components/layout/ResponsiveLayout";
import { PullToRefresh, TouchOptimizedButton } from "@/components/mobile/TouchOptimized";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FolderOpen, 
  Plus, 
  Target, 
  Search, 
  Filter,
  Calendar,
  Users,
  Clock,
  Edit,
  Eye,
  Archive,
  CheckCircle,
  AlertTriangle,
  Pause,
  Play
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useProjects, useCreateProject } from "@/hooks/api/useProjects";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import type { Project } from "@shared/schema";

// Using Project type from shared schema

const projectCategories = {
  personal: { label: "Pèsonèl", color: "bg-blue-500" },
  work: { label: "Travay", color: "bg-green-500" },
  construction: { label: "Konstriksyon", color: "bg-orange-500" },
  content: { label: "Kontni", color: "bg-purple-500" },
  music: { label: "Mizik", color: "bg-pink-500" },
  business: { label: "Biznis", color: "bg-yellow-500" },
  legal: { label: "Legal", color: "bg-red-500" },
  travel: { label: "Vwayaj", color: "bg-cyan-500" },
  startup: { label: "Startup", color: "bg-indigo-500" },
  finance: { label: "Finans", color: "bg-emerald-500" }
};

const statusConfig = {
  planning: { label: "An planifikasyon", color: "bg-blue-100 text-blue-800", icon: Clock },
  active: { label: "Aktif", color: "bg-green-100 text-green-800", icon: Play },
  paused: { label: "Anret", color: "bg-yellow-100 text-yellow-800", icon: Pause },
  completed: { label: "Fini", color: "bg-green-100 text-green-800", icon: CheckCircle },
  cancelled: { label: "Abandone", color: "bg-red-100 text-red-800", icon: AlertTriangle }
};

export default function Projects() {
  const { userId } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [, setLocation] = useLocation();
  const isMobile = useIsMobile();

  // Use React Query hooks
  const { data: projects = [], isLoading, refetch } = useProjects(userId!);
  const createProjectMutation = useCreateProject();

  const [newProject, setNewProject] = useState({
    name: "",
    shortDescription: "",
    category: "",
    status: "planning" as const,
    priority: "medium" as const,
    deadline: "",
    budget: "",
    team: 1,
    tags: [] as string[],
  });

  const handleRefresh = async () => {
    await refetch();
  };

  const addProject = async () => {
    if (!userId) return;
    
    try {
      const projectData = {
        userId,
        name: newProject.name.trim(),
        shortDescription: newProject.shortDescription.trim() || null,
        category: newProject.category,
        status: newProject.status,
        priority: newProject.priority,
        progress: 0,
        deadline: newProject.deadline ? new Date(newProject.deadline) : null,
        estimatedBudget: newProject.budget || null,
        team: newProject.team,
        spent: "0",
        tags: newProject.tags,
      };

      await createProjectMutation.mutateAsync(projectData);
      
      setNewProject({
        name: "",
        shortDescription: "",
        category: "",
        status: "planning" as const,
        priority: "medium" as const,
        deadline: "",
        budget: "",
        team: 1,
        tags: [],
      });
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Error adding project:', error);
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.shortDescription?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || project.status === filterStatus;
    const matchesCategory = filterCategory === "all" || project.category === filterCategory;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStats = () => {
    const total = projects.length;
    const active = projects.filter(p => p.status === 'active').length;
    const completed = projects.filter(p => p.status === 'completed').length;
    const planning = projects.filter(p => p.status === 'planning').length;
    const paused = projects.filter(p => p.status === 'paused').length;
    
    return { total, active, completed, planning, paused };
  };

  const stats = getStats();

  const ProjectCard = ({ project }: { project: Project }) => {
    const categoryInfo = projectCategories[project.category as keyof typeof projectCategories];
    const statusInfo = statusConfig[project.status as keyof typeof statusConfig];
    const StatusIcon = statusInfo?.icon || Clock;

    return (
      <Card 
        className="cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => setLocation(`/projects/${project.id}`)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg mb-1">{project.name}</CardTitle>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {project.shortDescription}
              </p>
            </div>
            <Badge className={cn("ml-2", statusInfo?.color)}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {statusInfo?.label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span>Pwogre</span>
              <span className="font-medium">{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="h-2" />
            
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{project.deadline ? new Date(project.deadline).toLocaleDateString() : 'No deadline'}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{project.team}</span>
              </div>
            </div>

            {categoryInfo && (
              <Badge variant="outline" className="text-xs">
                {categoryInfo.label}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const content = (
    <div className={cn("p-4 space-y-6", !isMobile && "p-6")}>
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold mb-2">Pwojè Mwen</h1>
          <p className="text-muted-foreground">Jere ak swiv pwogre pwojè ou yo</p>
        </div>

        {/* Quick Stats */}
        <div className={cn(
          "grid gap-4",
          isMobile ? "grid-cols-2" : "grid-cols-4"
        )}>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                <p className="text-sm text-muted-foreground">Aktif</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-600">{stats.completed}</p>
                <p className="text-sm text-muted-foreground">Fini</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">{stats.planning}</p>
                <p className="text-sm text-muted-foreground">Planifikasyon</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Chèche pwojè..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 md:w-64"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="md:w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tout Eta</SelectItem>
                <SelectItem value="planning">Planifikasyon</SelectItem>
                <SelectItem value="active">Aktif</SelectItem>
                <SelectItem value="paused">Anret</SelectItem>
                <SelectItem value="completed">Fini</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <TouchOptimizedButton>
                <Plus className="h-4 w-4 mr-2" />
                Nouvo Pwojè
              </TouchOptimizedButton>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Kreye Nouvo Pwojè</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Non pwojè a</Label>
                  <Input
                    id="name"
                    value={newProject.name}
                    onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                    placeholder="Non pwojè a"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Deskripsyon kout</Label>
                  <Textarea
                    id="description"
                    value={newProject.shortDescription}
                    onChange={(e) => setNewProject({...newProject, shortDescription: e.target.value})}
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
                    <Label htmlFor="deadline">Dat limit</Label>
                    <Input
                      id="deadline"
                      type="date"
                      value={newProject.deadline}
                      onChange={(e) => setNewProject({...newProject, deadline: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="tags">Tags (separe yo ak virgule)</Label>
                  <Input
                    id="tags"
                    value={newProject.tags.join(', ')}
                    onChange={(e) => setNewProject({...newProject, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)})}
                    placeholder="urgent, kliyan, solo"
                  />
                </div>
                <Button onClick={addProject} className="w-full">
                  Kreye Pwojè
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-full"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-2 bg-muted rounded"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  {searchQuery || filterStatus !== "all" ? "Pa gen pwojè ki kòrèk ak rechèch la" : "Pa gen pwojè yo"}
                </p>
                <TouchOptimizedButton onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Kreye Premye Pwojè Ou
                </TouchOptimizedButton>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
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