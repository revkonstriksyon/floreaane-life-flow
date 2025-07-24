import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
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

const mockProjects = [
  {
    id: 1,
    name: "Kay Kanapevè - Renovasyon",
    shortDescription: "Renovasyon konplè kay lan ak nouvo konsèp modèn",
    status: "in_progress",
    category: "construction",
    progress: 65,
    deadline: "2024-03-15",
    budget: 45000,
    spent: 28000,
    team: 4,
    priority: "high",
    tags: ["urgent", "construction", "client"],
    lastActivity: "2024-01-15",
    isPrivate: false
  },
  {
    id: 2,
    name: "Mixtape 2025 - Pwodwi",
    shortDescription: "Nouvo mixtape ak 12 pis orijinal",
    status: "planning",
    category: "music",
    progress: 25,
    deadline: "2024-06-01",
    budget: 8000,
    spent: 1200,
    team: 3,
    priority: "medium",
    tags: ["creative", "music", "personal"],
    lastActivity: "2024-01-12",
    isPrivate: false
  },
  {
    id: 3,
    name: "Aplikasyon FLOREAANE",
    shortDescription: "SaaS pèsonèl pou jesyon lavi ak pwodiktivite",
    status: "active",
    category: "tech",
    progress: 80,
    deadline: "2024-02-28",
    budget: 0,
    spent: 0,
    team: 1,
    priority: "high",
    tags: ["startup", "saas", "personal"],
    lastActivity: "2024-01-16",
    isPrivate: false
  }
];

const categoryIcons = {
  construction: Home,
  music: Music,
  tech: Briefcase,
  personal: Target,
  business: DollarSign,
  creative: Palette,
  legal: Gavel,
  travel: Plane,
  idea: Lightbulb
};

const statusColors = {
  planning: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  active: "bg-green-500/10 text-green-500 border-green-500/20",
  in_progress: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  on_hold: "bg-gray-500/10 text-gray-500 border-gray-500/20",
  completed: "bg-success/10 text-success border-success/20",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20"
};

const priorityColors = {
  low: "bg-gray-500/10 text-gray-500",
  medium: "bg-warning/10 text-warning",
  high: "bg-destructive/10 text-destructive"
};

export default function Projects() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeView, setActiveView] = useState("grid");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredProjects = mockProjects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || project.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalProjects = mockProjects.length;
  const activeProjects = mockProjects.filter(p => p.status === "active" || p.status === "in_progress").length;
  const completedProjects = mockProjects.filter(p => p.status === "completed").length;
  const totalBudget = mockProjects.reduce((sum, p) => sum + p.budget, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ht-HT', {
      style: 'currency',
      currency: 'HTG'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ht-HT');
  };

  const getCategoryIcon = (category: string) => {
    const IconComponent = categoryIcons[category as keyof typeof categoryIcons] || FolderOpen;
    return IconComponent;
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        currentPath="/projects"
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-border/50 bg-card/30 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Pwojè Mwen
              </h1>
              <p className="text-muted-foreground mt-1">
                Jere ak swiv tout pwojè ou yo nan yon sèl plas
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechèch pwojè..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtre
              </Button>
              <Button size="sm" className="bg-gradient-primary">
                <Plus className="h-4 w-4 mr-2" />
                Nouvo Pwojè
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <Card className="bg-card/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <FolderOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{totalProjects}</p>
                    <p className="text-sm text-muted-foreground">Total Pwojè</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-success/10 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{activeProjects}</p>
                    <p className="text-sm text-muted-foreground">Aktif</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-warning/10 rounded-lg">
                    <Target className="h-5 w-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{completedProjects}</p>
                    <p className="text-sm text-muted-foreground">Konplete</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <DollarSign className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{formatCurrency(totalBudget)}</p>
                    <p className="text-sm text-muted-foreground">Total Bidjè</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <Tabs value={activeView} onValueChange={setActiveView} className="h-full flex flex-col">
            <div className="flex items-center justify-between px-6 py-4">
              <TabsList>
                <TabsTrigger value="grid" className="gap-2">
                  <Grid3X3 className="h-4 w-4" />
                  Grid
                </TabsTrigger>
                <TabsTrigger value="list" className="gap-2">
                  <List className="h-4 w-4" />
                  List
                </TabsTrigger>
                <TabsTrigger value="kanban" className="gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Kanban
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-2">
                <Button
                  variant={filterStatus === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("all")}
                >
                  Tout
                </Button>
                <Button
                  variant={filterStatus === "active" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("active")}
                >
                  Aktif
                </Button>
                <Button
                  variant={filterStatus === "completed" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("completed")}
                >
                  Konplete
                </Button>
              </div>
            </div>

            <div className="flex-1 px-6 pb-6 overflow-auto">
              <TabsContent value="grid" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProjects.map((project) => {
                    const CategoryIcon = getCategoryIcon(project.category);
                    return (
                      <Card key={project.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-primary/10 rounded-lg">
                                <CategoryIcon className="h-5 w-5 text-primary" />
                              </div>
                              <div className="flex-1">
                                <CardTitle className="text-lg leading-tight">
                                  {project.name}
                                </CardTitle>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {project.shortDescription}
                                </p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          {/* Progress */}
                          <div>
                            <div className="flex items-center justify-between text-sm mb-2">
                              <span className="text-muted-foreground">Pwogrè</span>
                              <span className="font-medium">{project.progress}%</span>
                            </div>
                            <Progress value={project.progress} className="h-2" />
                          </div>

                          {/* Status & Priority */}
                          <div className="flex items-center gap-2">
                            <Badge className={statusColors[project.status as keyof typeof statusColors]}>
                              {project.status}
                            </Badge>
                            <Badge className={priorityColors[project.priority as keyof typeof priorityColors]}>
                              {project.priority}
                            </Badge>
                          </div>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-1">
                            {project.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          {/* Details */}
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">
                                {formatDate(project.deadline)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">
                                {project.team} manm
                              </span>
                            </div>
                          </div>

                          {/* Budget */}
                          {project.budget > 0 && (
                            <div className="text-sm">
                              <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Bidjè</span>
                                <span className="font-medium">
                                  {formatCurrency(project.spent)} / {formatCurrency(project.budget)}
                                </span>
                              </div>
                              <Progress 
                                value={(project.spent / project.budget) * 100} 
                                className="h-1 mt-1" 
                              />
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex items-center gap-2 pt-2">
                            <Button variant="outline" size="sm" className="flex-1">
                              <Eye className="h-4 w-4 mr-2" />
                              Wè
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1">
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="list" className="mt-0">
                <Card>
                  <CardContent className="p-0">
                    <div className="divide-y divide-border/50">
                      {filteredProjects.map((project) => {
                        const CategoryIcon = getCategoryIcon(project.category);
                        return (
                          <div key={project.id} className="p-4 hover:bg-muted/30 transition-colors">
                            <div className="flex items-center gap-4">
                              <div className="p-2 bg-primary/10 rounded-lg">
                                <CategoryIcon className="h-5 w-5 text-primary" />
                              </div>
                              
                              <div className="flex-1">
                                <h3 className="font-medium">{project.name}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {project.shortDescription}
                                </p>
                              </div>

                              <div className="flex items-center gap-4">
                                <div className="text-right">
                                  <p className="text-sm font-medium">{project.progress}%</p>
                                  <Progress value={project.progress} className="w-20 h-2" />
                                </div>
                                
                                <Badge className={statusColors[project.status as keyof typeof statusColors]}>
                                  {project.status}
                                </Badge>
                                
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Calendar className="h-4 w-4" />
                                  {formatDate(project.deadline)}
                                </div>
                                
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="kanban" className="mt-0">
                <div className="grid grid-cols-4 gap-6">
                  {["Planning", "An Kous", "Revizyon", "Konplete"].map((column) => (
                    <Card key={column}>
                      <CardHeader>
                        <CardTitle className="text-center text-sm">{column}</CardTitle>
                        <Badge variant="secondary" className="w-fit mx-auto">
                          {filteredProjects.filter(p => {
                            if (column === "Planning") return p.status === "planning";
                            if (column === "An Kous") return p.status === "active" || p.status === "in_progress";
                            if (column === "Revizyon") return p.status === "review";
                            return p.status === "completed";
                          }).length}
                        </Badge>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {filteredProjects
                          .filter(p => {
                            if (column === "Planning") return p.status === "planning";
                            if (column === "An Kous") return p.status === "active" || p.status === "in_progress";
                            if (column === "Revizyon") return p.status === "review";
                            return p.status === "completed";
                          })
                          .map((project) => {
                            const CategoryIcon = getCategoryIcon(project.category);
                            return (
                              <div
                                key={project.id}
                                className="p-3 bg-card border border-border/50 rounded-md hover:shadow-sm transition-shadow cursor-pointer"
                              >
                                <div className="flex items-center gap-2 mb-2">
                                  <CategoryIcon className="h-4 w-4 text-primary" />
                                  <h4 className="font-medium text-sm">{project.name}</h4>
                                </div>
                                
                                <p className="text-xs text-muted-foreground mb-3">
                                  {project.shortDescription}
                                </p>
                                
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between text-xs">
                                    <span>Pwogrè</span>
                                    <span>{project.progress}%</span>
                                  </div>
                                  <Progress value={project.progress} className="h-1" />
                                </div>
                                
                                <div className="flex items-center gap-1 mt-3">
                                  <Badge 
                                    className={priorityColors[project.priority as keyof typeof priorityColors]}
                                  >
                                    {project.priority}
                                  </Badge>
                                  <Badge variant="outline">
                                    {project.team}
                                  </Badge>
                                </div>
                              </div>
                            );
                          })}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}