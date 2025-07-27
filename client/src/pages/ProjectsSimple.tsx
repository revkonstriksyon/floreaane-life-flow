import { useState, useEffect } from "react";
import { ResponsiveLayout } from "@/components/layout/ResponsiveLayout";
import { PullToRefresh, TouchOptimizedButton } from "@/components/mobile/TouchOptimized";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  Play,
  MoreHorizontal,
  Star,
  TrendingUp,
  Grid3X3,
  List
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useProjects, useCreateProject } from "@/hooks/api/useProjects";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import type { Project } from "@shared/schema";

const projectCategories = {
  personal: { label: "Pèsonèl", color: "bg-blue-500", gradient: "from-blue-400 to-blue-600" },
  work: { label: "Travay", color: "bg-green-500", gradient: "from-green-400 to-green-600" },
  construction: { label: "Konstriksyon", color: "bg-orange-500", gradient: "from-orange-400 to-orange-600" },
  content: { label: "Kontni", color: "bg-purple-500", gradient: "from-purple-400 to-purple-600" },
  music: { label: "Mizik", color: "bg-pink-500", gradient: "from-pink-400 to-pink-600" },
  business: { label: "Biznis", color: "bg-yellow-500", gradient: "from-yellow-400 to-yellow-600" },
  legal: { label: "Legal", color: "bg-red-500", gradient: "from-red-400 to-red-600" },
  travel: { label: "Vwayaj", color: "bg-cyan-500", gradient: "from-cyan-400 to-cyan-600" },
  startup: { label: "Startup", color: "bg-indigo-500", gradient: "from-indigo-400 to-indigo-600" },
  finance: { label: "Finans", color: "bg-emerald-500", gradient: "from-emerald-400 to-emerald-600" }
};

const statusConfig = {
  planning: { label: "An planifikasyon", color: "bg-blue-100 text-blue-800", icon: Clock, dot: "bg-blue-500" },
  active: { label: "Aktif", color: "bg-green-100 text-green-800", icon: Play, dot: "bg-green-500" },
  paused: { label: "Anret", color: "bg-yellow-100 text-yellow-800", icon: Pause, dot: "bg-yellow-500" },
  completed: { label: "Fini", color: "bg-green-100 text-green-800", icon: CheckCircle, dot: "bg-green-500" },
  cancelled: { label: "Abandone", color: "bg-red-100 text-red-800", icon: AlertTriangle, dot: "bg-red-500" }
};

export default function Projects() {
  const { userId } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
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
    const outOfSchedule = projects.filter(p => 
      p.deadline && new Date(p.deadline) < new Date() && p.status !== 'completed'
    ).length;
    
    return { total, active, completed, planning, outOfSchedule };
  };

  const stats = getStats();

  const ProjectCard = ({ project }: { project: Project }) => {
    const categoryInfo = projectCategories[project.category as keyof typeof projectCategories];
    const statusInfo = statusConfig[project.status as keyof typeof statusConfig];
    const StatusIcon = statusInfo?.icon || Clock;

    return (
      <Card 
        className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:bg-white/90"
        onClick={() => setLocation(`/projects/${project.id}`)}
      >
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-3 h-3 rounded-full ${statusInfo?.dot}`} />
                <Badge variant="outline" className="text-xs border-gray-200">
                  {statusInfo?.label}
                </Badge>
                {project.priority === 'high' && (
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                )}
              </div>
              <CardTitle className="text-lg mb-1 group-hover:text-primary transition-colors">
                {project.name}
              </CardTitle>
              <p className="text-sm text-gray-600 line-clamp-2">
                {project.shortDescription}
              </p>
            </div>
            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Pwogre</span>
              <span className="font-semibold">{project.progress}%</span>
            </div>
            <div className="relative">
              <Progress value={project.progress} className="h-2 bg-gray-100" />
              <div 
                className={`absolute top-0 left-0 h-2 rounded-full bg-gradient-to-r ${categoryInfo?.gradient || 'from-gray-400 to-gray-600'} transition-all duration-500`}
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>
            
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>{project.deadline ? new Date(project.deadline).toLocaleDateString() : 'Pa gen limit'}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <Users className="h-4 w-4" />
                <span>{project.team}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            {categoryInfo && (
              <Badge className={`${categoryInfo.color} text-white border-none text-xs`}>
                {categoryInfo.label}
              </Badge>
            )}
            <div className="flex -space-x-2">
              {Array.from({ length: Math.min(project.team, 3) }).map((_, i) => (
                <Avatar key={i} className="h-6 w-6 border-2 border-white">
                  <AvatarFallback className="text-xs">
                    {String.fromCharCode(65 + i)}
                  </AvatarFallback>
                </Avatar>
              ))}
              {project.team > 3 && (
                <div className="h-6 w-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                  <span className="text-xs text-gray-600">+{project.team - 3}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const content = (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
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
              <h1 className="text-3xl font-bold text-gray-900">Pwojè</h1>
              <p className="text-gray-600 mt-1">Jere ak swiv pwogre pwojè ou yo</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="hidden md:flex">
                <Filter className="h-4 w-4 mr-2" />
                Filtre
              </Button>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Nouvo Pwojè
                  </Button>
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
                        className="border-gray-200 focus:border-blue-500"
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
                        className="border-gray-200 focus:border-blue-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category">Kategori</Label>
                        <Select value={newProject.category} onValueChange={(value) => setNewProject({...newProject, category: value})}>
                          <SelectTrigger className="border-gray-200">
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
                          className="border-gray-200 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <Button onClick={addProject} className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
                      Kreye Pwojè
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
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

      {/* Main Content */}
      <div className="p-6">
        {/* Filters and Search */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-gray-200/50">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Chèche pwojè..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 md:w-64 border-gray-200 bg-white/80 focus:border-blue-500"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="md:w-40 border-gray-200 bg-white/80">
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
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="md:w-40 border-gray-200 bg-white/80">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tout Kategori</SelectItem>
                  {Object.entries(projectCategories).map(([key, category]) => (
                    <SelectItem key={key} value={key}>{category.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="border-gray-200"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="border-gray-200"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
                    id="description"
        </div>
                    value={newProject.shortDescription}
                </div>
        {/* Projects List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className={cn(
              "grid gap-6",
              viewMode === 'grid' ? "md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
            )}>
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse bg-white/60 border-0">
                  <CardHeader>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-2 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredProjects.length > 0 ? (
            <div className={cn(
              "grid gap-6",
              viewMode === 'grid' ? "md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
            )}>
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <Card className="bg-white/60 backdrop-blur-sm border-0">
              <CardContent className="py-12">
                <div className="text-center">
                  <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">
                    {searchQuery || filterStatus !== "all" ? "Pa gen pwojè ki kòrèk ak rechèch la" : "Pa gen pwojè yo"}
                  </p>
                  <Button 
                    onClick={() => setIsAddDialogOpen(true)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Kreye Premye Pwojè Ou
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </ResponsiveLayout>
  );
}