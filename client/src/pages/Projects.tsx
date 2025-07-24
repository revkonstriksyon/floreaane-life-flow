import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
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
  Lightbulb
} from "lucide-react";

interface Project {
  id: string;
  name: string;
  short_description: string | null;
  long_description: string | null;
  status: string | null;
  category: string | null;
  progress_percentage: number | null;
  deadline: string | null;
  estimated_budget: number | null;
  actual_cost: number | null;
  start_date: string | null;
  tags: string[] | null;
  is_private: boolean | null;
  created_at: string | null;
  updated_at: string | null;
  user_id: string;
}

const statusColors: Record<string, string> = {
  planning: "bg-blue-100 text-blue-800",
  active: "bg-green-100 text-green-800", 
  in_progress: "bg-yellow-100 text-yellow-800",
  on_hold: "bg-orange-100 text-orange-800",
  completed: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-red-100 text-red-800"
};

const statusLabels: Record<string, string> = {
  planning: "Planifikasyon",
  active: "Aktif",
  in_progress: "Nan Travay",
  on_hold: "Rete",
  completed: "Fini",
  cancelled: "Anile"
};

const categoryIcons: Record<string, any> = {
  personal: Home,
  work: Briefcase,
  creative: Palette,
  health: Target,
  education: Lightbulb,
  travel: Plane,
  legal: Gavel,
  entertainment: Music
};

const categoryNames: Record<string, string> = {
  personal: "Pèsonèl",
  work: "Travay",
  creative: "Kreyatif", 
  health: "Sante",
  education: "Edikasyon",
  travel: "Vwayaj",
  legal: "Legal",
  entertainment: "Amizman"
};

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching projects:', error);
        return;
      }

      setProjects(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.short_description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const activeProjects = projects.filter(p => p.status === 'active' || p.status === 'in_progress').length;
  const totalBudget = projects.reduce((sum, p) => sum + (p.estimated_budget || 0), 0);
  const totalSpent = projects.reduce((sum, p) => sum + (p.actual_cost || 0), 0);

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar collapsed={sidebarCollapsed} onToggle={setSidebarCollapsed} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            <p className="mt-4">Ap chèche pwojè yo...</p>
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
              <h1 className="text-3xl font-bold">Jesyon Pwojè</h1>
              <p className="text-muted-foreground">Planifye ak sivèy pwojè ou yo</p>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nouvo Pwojè
            </Button>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Chèche pwojè yo..."
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

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Pwojè</p>
                    <p className="text-2xl font-bold">{projects.length}</p>
                  </div>
                  <FolderOpen className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Aktif</p>
                    <p className="text-2xl font-bold">{activeProjects}</p>
                  </div>
                  <Target className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Fini</p>
                    <p className="text-2xl font-bold">{completedProjects}</p>
                  </div>
                  <Archive className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Bidjè Total</p>
                    <p className="text-2xl font-bold">${totalBudget.toLocaleString()}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <Tabs defaultValue="grid" className="w-full">
            <div className="flex items-center justify-between mb-6">
              <TabsList>
                <TabsTrigger value="grid">Grid</TabsTrigger>
                <TabsTrigger value="list">Lis</TabsTrigger>
                <TabsTrigger value="kanban">Kanban</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="grid">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => {
                  const IconComponent = categoryIcons[project.category || 'personal'] || Home;

                  return (
                    <Card key={project.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <IconComponent className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{project.name}</CardTitle>
                              <Badge variant="secondary" className={statusColors[project.status || 'planning']}>
                                {statusLabels[project.status || 'planning']}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {project.short_description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {project.short_description}
                            </p>
                          )}

                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Pwogrè</span>
                              <span>{project.progress_percentage || 0}%</span>
                            </div>
                            <Progress value={project.progress_percentage || 0} className="h-2" />
                          </div>

                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>
                                {project.deadline 
                                  ? new Date(project.deadline).toLocaleDateString('fr-FR')
                                  : 'Pa gen dèt'}
                              </span>
                            </div>
                            {project.estimated_budget && (
                              <div className="flex items-center gap-2">
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                                <span>${project.estimated_budget.toLocaleString()}</span>
                              </div>
                            )}
                          </div>

                          {project.tags && project.tags.length > 0 && (
                            <div className="flex gap-1 flex-wrap">
                              {project.tags.slice(0, 3).map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {project.tags.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{project.tags.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="list">
              <Card>
                <CardHeader>
                  <CardTitle>Lis Pwojè</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredProjects.map((project) => (
                      <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-sm transition-shadow">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <FolderOpen className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{project.name}</h3>
                            <p className="text-sm text-muted-foreground">{project.short_description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge variant="secondary" className={statusColors[project.status || 'planning']}>
                            {statusLabels[project.status || 'planning']}
                          </Badge>
                          <div className="text-sm text-muted-foreground">
                            {project.progress_percentage || 0}%
                          </div>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
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