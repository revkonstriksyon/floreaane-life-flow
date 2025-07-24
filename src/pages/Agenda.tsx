import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Target, 
  Flame, 
  Plus,
  Filter,
  Search,
  BarChart3,
  Brain,
  CheckCircle2,
  Circle,
  AlertCircle
} from "lucide-react";

const mockTasks = [
  {
    id: 1,
    title: "Rele Flore-Anne pou pwojè Kay Kanapevè",
    time: "09:00",
    duration: 30,
    priority: "high",
    category: "travay",
    status: "pending",
    location: "Biwo",
    objective: "pwojè"
  },
  {
    id: 2,
    title: "Ekri nouvo rap verse",
    time: "14:00", 
    duration: 120,
    priority: "medium",
    category: "personal",
    status: "completed",
    location: "Lakay",
    objective: "kreativite"
  },
  {
    id: 3,
    title: "Randevou ak kontab la",
    time: "16:30",
    duration: 60,
    priority: "high",
    category: "finans",
    status: "pending",
    location: "Biwo l",
    objective: "obligasyon"
  }
];

const timeSlots = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, '0');
  return `${hour}:00`;
});

export default function Agenda() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [activeView, setActiveView] = useState("calendar");

  const toggleTask = (taskId: number) => {
    // TODO: Implement task toggle with Supabase
    console.log("Toggle task:", taskId);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-destructive/10 text-destructive border-destructive/20";
      case "medium": return "bg-warning/10 text-warning border-warning/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    return status === "completed" ? CheckCircle2 : Circle;
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        currentPath="/agenda"
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-border/50 bg-card/30 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Ajenda & Tach
              </h1>
              <p className="text-muted-foreground mt-1">
                Jere tan ou ak pwodiktivite maksimòm
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechèch tach..."
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
                Nouvo Tach
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <Tabs value={activeView} onValueChange={setActiveView} className="h-full flex flex-col">
            <TabsList className="m-6 mb-0">
              <TabsTrigger value="calendar" className="gap-2">
                <CalendarIcon className="h-4 w-4" />
                Kalandriye
              </TabsTrigger>
              <TabsTrigger value="timeline" className="gap-2">
                <Clock className="h-4 w-4" />
                Timeline
              </TabsTrigger>
              <TabsTrigger value="kanban" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                Kanban
              </TabsTrigger>
              <TabsTrigger value="ai" className="gap-2">
                <Brain className="h-4 w-4" />
                IA Sijesyon
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 p-6 pt-4 overflow-auto">
              <TabsContent value="calendar" className="h-full mt-0">
                <div className="grid grid-cols-12 gap-6 h-full">
                  {/* Calendar */}
                  <Card className="col-span-4">
                    <CardHeader>
                      <CardTitle className="text-lg">Kalandriye</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => date && setSelectedDate(date)}
                        className="rounded-md border"
                      />
                      
                      {/* Quick Stats */}
                      <div className="mt-6 space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Total Tach</span>
                          <Badge variant="secondary">12</Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Konplete</span>
                          <Badge className="bg-success/10 text-success">8</Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">An Kous</span>
                          <Badge className="bg-warning/10 text-warning">4</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Tasks List */}
                  <div className="col-span-8 space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Clock className="h-5 w-5" />
                          Tach pou {selectedDate.toLocaleDateString('ht-HT')}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {mockTasks.map((task) => {
                          const StatusIcon = getStatusIcon(task.status);
                          return (
                            <div
                              key={task.id}
                              className="flex items-center gap-4 p-4 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors"
                            >
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleTask(task.id)}
                                className="p-0 h-auto"
                              >
                                <StatusIcon className={`h-5 w-5 ${task.status === 'completed' ? 'text-success' : 'text-muted-foreground'}`} />
                              </Button>
                              
                              <div className="flex-1">
                                <h3 className={`font-medium ${task.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
                                  {task.title}
                                </h3>
                                <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {task.time} ({task.duration}min)
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {task.location}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Target className="h-3 w-3" />
                                    {task.objective}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <Badge className={getPriorityColor(task.priority)}>
                                  <Flame className="h-3 w-3 mr-1" />
                                  {task.priority}
                                </Badge>
                                <Badge variant="outline">
                                  {task.category}
                                </Badge>
                              </div>
                            </div>
                          );
                        })}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="timeline" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Timeline Jounen an</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {timeSlots.map((time) => (
                        <div key={time} className="flex items-center gap-4">
                          <span className="w-16 text-sm text-muted-foreground font-mono">
                            {time}
                          </span>
                          <div className="flex-1 h-12 border border-dashed border-border/50 rounded-md flex items-center px-3 hover:bg-muted/30 transition-colors">
                            <span className="text-sm text-muted-foreground">
                              Drag & drop tach isit la
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="kanban" className="mt-0">
                <div className="grid grid-cols-3 gap-6">
                  {["To Do", "An Kous", "Fini"].map((column) => (
                    <Card key={column}>
                      <CardHeader>
                        <CardTitle className="text-center">{column}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {mockTasks
                            .filter(task => {
                              if (column === "To Do") return task.status === "pending";
                              if (column === "An Kous") return task.status === "in_progress";
                              return task.status === "completed";
                            })
                            .map((task) => (
                              <div
                                key={task.id}
                                className="p-3 bg-card border border-border/50 rounded-md"
                              >
                                <h4 className="font-medium text-sm">{task.title}</h4>
                                <div className="flex items-center gap-2 mt-2">
                                  <Badge className={getPriorityColor(task.priority)}>
                                    {task.priority}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {task.duration}min
                                  </span>
                                </div>
                              </div>
                            ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="ai" className="mt-0">
                <div className="grid grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Brain className="h-5 w-5" />
                        Sijesyon IA
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <h4 className="font-medium text-primary">Optimizasyon Tan</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              Ou gen 2 randevou ki pre yo nan 16:00 ak 16:30. Konsèye w deplase youn nan yo pou evite stress.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-warning/5 border border-warning/20 rounded-lg">
                        <div className="flex items-start gap-3">
                          <Brain className="h-5 w-5 text-warning mt-0.5" />
                          <div>
                            <h4 className="font-medium text-warning">Pwodiktivite</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              Baz sou konpòtman ou avan, pi bon lè pou travay kreyatif se nan maten (8:00-11:00).
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-success/5 border border-success/20 rounded-lg">
                        <div className="flex items-start gap-3">
                          <Target className="h-5 w-5 text-success mt-0.5" />
                          <div>
                            <h4 className="font-medium text-success">Objektif</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              Ou prèske rive nan objektif semèn nan: 8/10 tach konplete. Kontinye konsa!
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Tach IA Rekòmande</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="p-3 border border-border/50 rounded-lg">
                          <h4 className="font-medium text-sm">Prepare pou randevou ak kontab la</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            Konsèye 30min avan pou revize dokiman yo
                          </p>
                          <Button size="sm" variant="outline" className="mt-2">
                            Ajoute
                          </Button>
                        </div>

                        <div className="p-3 border border-border/50 rounded-lg">
                          <h4 className="font-medium text-sm">Swiv avèk Flore-Anne</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            Pa gen nouvèl depi 3 jou - voye yon mesaj rapid
                          </p>
                          <Button size="sm" variant="outline" className="mt-2">
                            Ajoute
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}