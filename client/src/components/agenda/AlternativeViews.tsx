import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Target, 
  Heart, 
  BarChart3,
  Quote,
  TrendingUp,
  Award,
  Lightbulb,
  Zap,
  Calendar,
  Clock
} from "lucide-react";
import { format } from "date-fns";
import type { Task, Project } from "@shared/schema";

interface AlternativeViewsProps {
  tasks: Task[];
  projects: Project[];
  selectedDate: Date;
}

interface ObjectiveProgress {
  objective: string;
  tasks: Task[];
  completed: number;
  total: number;
  progress: number;
}

const motivationalQuotes = [
  "Chak jou se yon nouvo kòmansman. Pwofite l!",
  "Ou pi fò pase ou panse. Kontinye!",
  "Siksè a se yon vwayaj, se pa yon destinasyon.",
  "Chak tach ou konplete se yon viktwa.",
  "Ou gen kapasite pou reyèlize rèv ou yo.",
  "Pwogre a pi enpòtan pase pèfeksyon an.",
  "Jou a se yon kado. Se poutèt sa yo rele l 'present'.",
  "Ou ka, ou ap fè l, ou prèt!"
];

export function AlternativeViews({ tasks, projects, selectedDate }: AlternativeViewsProps) {
  const [selectedObjective, setSelectedObjective] = useState<string | null>(null);

  // Group tasks by objectives
  const getObjectiveProgress = (): ObjectiveProgress[] => {
    const objectiveMap = new Map<string, Task[]>();
    
    tasks.forEach(task => {
      if (task.objective) {
        if (!objectiveMap.has(task.objective)) {
          objectiveMap.set(task.objective, []);
        }
        objectiveMap.get(task.objective)!.push(task);
      }
    });

    return Array.from(objectiveMap.entries()).map(([objective, objectiveTasks]) => {
      const completed = objectiveTasks.filter(t => t.status === 'completed').length;
      const total = objectiveTasks.length;
      const progress = total > 0 ? (completed / total) * 100 : 0;

      return {
        objective,
        tasks: objectiveTasks,
        completed,
        total,
        progress
      };
    });
  };

  const getProductivityLevel = () => {
    const completedToday = tasks.filter(t => 
      t.status === 'completed' && 
      t.scheduledDate &&
      format(new Date(t.scheduledDate), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
    ).length;

    const totalToday = tasks.filter(t => 
      t.scheduledDate &&
      format(new Date(t.scheduledDate), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
    ).length;

    const rate = totalToday > 0 ? (completedToday / totalToday) * 100 : 0;

    if (rate >= 90) return { level: 'Ekstraòdinè', color: 'text-purple-600', score: 100 };
    if (rate >= 80) return { level: 'Ekselan', color: 'text-green-600', score: 90 };
    if (rate >= 70) return { level: 'Bon', color: 'text-blue-600', score: 80 };
    if (rate >= 50) return { level: 'Mwayen', color: 'text-yellow-600', score: 60 };
    return { level: 'Ka amelyore', color: 'text-red-600', score: 40 };
  };

  const getTodaysReflection = () => {
    const completedTasks = tasks.filter(t => 
      t.status === 'completed' && 
      t.scheduledDate &&
      format(new Date(t.scheduledDate), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
    );

    const totalTime = completedTasks.reduce((sum, t) => sum + (t.duration || 0), 0);
    const categories = [...new Set(completedTasks.map(t => t.category))];

    return {
      tasksCompleted: completedTasks.length,
      timeSpent: totalTime,
      categoriesWorked: categories,
      achievements: completedTasks.filter(t => t.priority === 'high' || t.priority === 'urgent')
    };
  };

  const objectiveProgress = getObjectiveProgress();
  const productivityLevel = getProductivityLevel();
  const todaysReflection = getTodaysReflection();
  const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  return (
    <Tabs defaultValue="objectives" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="objectives">🎯 Objektif yo</TabsTrigger>
        <TabsTrigger value="motivation">💪 Motivasyon</TabsTrigger>
        <TabsTrigger value="statistics">📊 Estatistik</TabsTrigger>
      </TabsList>

      <TabsContent value="objectives" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Sa m dwe fè pou m avanse sou objektif yo?
            </CardTitle>
          </CardHeader>
          <CardContent>
            {objectiveProgress.length === 0 ? (
              <div className="text-center py-8">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Pa gen objektif yo defini nan tach ou yo
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Ajoute objektif yo nan tach ou yo pou wè pwogre ou
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {objectiveProgress.map((obj, index) => (
                  <Card 
                    key={index}
                    className={cn(
                      "cursor-pointer hover:shadow-md transition-shadow",
                      selectedObjective === obj.objective && "ring-2 ring-primary"
                    )}
                    onClick={() => setSelectedObjective(
                      selectedObjective === obj.objective ? null : obj.objective
                    )}
                  >
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{obj.objective}</h4>
                          <Badge variant="outline">
                            {obj.completed}/{obj.total} tach
                          </Badge>
                        </div>
                        
                        <Progress value={obj.progress} className="h-2" />
                        
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>{obj.progress.toFixed(0)}% konplete</span>
                          <span>
                            {obj.tasks.reduce((sum, t) => sum + (t.duration || 0), 0)} minit total
                          </span>
                        </div>

                        {selectedObjective === obj.objective && (
                          <div className="mt-4 pt-4 border-t">
                            <h5 className="font-medium mb-2">Tach yo ki rete:</h5>
                            <div className="space-y-2">
                              {obj.tasks
                                .filter(t => t.status !== 'completed')
                                .map(task => (
                                  <div key={task.id} className="flex items-center gap-2 p-2 bg-muted rounded">
                                    <div className={`w-2 h-2 rounded-full ${
                                      task.priority === 'urgent' ? 'bg-red-500' :
                                      task.priority === 'high' ? 'bg-orange-500' :
                                      task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                                    }`} />
                                    <span className="text-sm">{task.title}</span>
                                    {task.scheduledDate && (
                                      <Badge variant="outline" className="text-xs">
                                        {format(new Date(task.scheduledDate), 'MMM d')}
                                      </Badge>
                                    )}
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="motivation" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Quote className="h-5 w-5" />
                Quote Jounen an
              </CardTitle>
            </CardHeader>
            <CardContent>
              <blockquote className="text-lg italic text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                "{randomQuote}"
              </blockquote>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Nivo Pwodiktivite
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className={`text-4xl font-bold ${productivityLevel.color}`}>
                  {productivityLevel.score}
                </div>
                <div className="space-y-2">
                  <Progress value={productivityLevel.score} className="h-3" />
                  <p className={`font-medium ${productivityLevel.color}`}>
                    {productivityLevel.level}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Refleksyon Jounen an
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Award className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600">
                  {todaysReflection.tasksCompleted}
                </p>
                <p className="text-sm text-green-600">Tach konplete</p>
              </div>

              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-600">
                  {Math.floor(todaysReflection.timeSpent / 60)}h {todaysReflection.timeSpent % 60}m
                </p>
                <p className="text-sm text-blue-600">Tan pwodiktif</p>
              </div>

              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Target className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-600">
                  {todaysReflection.categoriesWorked.length}
                </p>
                <p className="text-sm text-purple-600">Domèn travay</p>
              </div>
            </div>

            {todaysReflection.achievements.length > 0 && (
              <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-medium text-yellow-800 mb-2 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  Reyèlizasyon Enpòtan yo
                </h4>
                <div className="space-y-1">
                  {todaysReflection.achievements.map(task => (
                    <div key={task.id} className="text-sm text-yellow-700">
                      • {task.title}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="statistics" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">% Tach Konplete</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {tasks.length > 0 
                    ? ((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100).toFixed(1)
                    : 0
                  }%
                </div>
                <Progress 
                  value={tasks.length > 0 
                    ? (tasks.filter(t => t.status === 'completed').length / tasks.length) * 100
                    : 0
                  } 
                  className="mt-2" 
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tan pa Kategori</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {['travay', 'pèsonèl', 'sosyal'].map((category, index) => {
                  const categoryTasks = tasks.filter(t => t.category === category && t.status === 'completed');
                  const timeSpent = categoryTasks.reduce((sum, t) => sum + (t.duration || 0), 0);
                  const totalTime = tasks
                    .filter(t => t.status === 'completed')
                    .reduce((sum, t) => sum + (t.duration || 0), 0);
                  const percentage = totalTime > 0 ? (timeSpent / totalTime) * 100 : 0;

                  return (
                    <div key={category} className="flex justify-between items-center">
                      <span className="text-sm capitalize">{category}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 text-xs text-right">
                          {percentage.toFixed(0)}%
                        </div>
                        <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              index === 0 ? 'bg-blue-500' :
                              index === 1 ? 'bg-purple-500' : 'bg-pink-500'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Balans Lavi/Travay</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(() => {
                  const workTasks = tasks.filter(t => t.category === 'travay' && t.status === 'completed');
                  const personalTasks = tasks.filter(t => 
                    ['pèsonèl', 'sosyal', 'sante'].includes(t.category) && t.status === 'completed'
                  );
                  
                  const workTime = workTasks.reduce((sum, t) => sum + (t.duration || 0), 0);
                  const personalTime = personalTasks.reduce((sum, t) => sum + (t.duration || 0), 0);
                  const totalTime = workTime + personalTime;

                  const workPercentage = totalTime > 0 ? (workTime / totalTime) * 100 : 50;
                  const personalPercentage = totalTime > 0 ? (personalTime / totalTime) * 100 : 50;

                  return (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Travay</span>
                        <span className="text-sm font-medium">{workPercentage.toFixed(0)}%</span>
                      </div>
                      <Progress value={workPercentage} className="h-2" />
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Lavi Pèsonèl</span>
                        <span className="text-sm font-medium">{personalPercentage.toFixed(0)}%</span>
                      </div>
                      <Progress value={personalPercentage} className="h-2" />

                      <div className="text-center pt-2">
                        <Badge variant={
                          Math.abs(workPercentage - personalPercentage) < 20 ? 'default' : 'secondary'
                        }>
                          {Math.abs(workPercentage - personalPercentage) < 20 ? 'Balanse' : 'Pa balanse'}
                        </Badge>
                      </div>
                    </>
                  );
                })()}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Analiz Detaye
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Distribisyon Priyorite</h4>
                <div className="space-y-2">
                  {['urgent', 'high', 'medium', 'low'].map(priority => {
                    const priorityTasks = tasks.filter(t => t.priority === priority);
                    const completed = priorityTasks.filter(t => t.status === 'completed').length;
                    const percentage = priorityTasks.length > 0 ? (completed / priorityTasks.length) * 100 : 0;

                    return (
                      <div key={priority} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${
                            priority === 'urgent' ? 'bg-red-500' :
                            priority === 'high' ? 'bg-orange-500' :
                            priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                          }`} />
                          <span className="text-sm capitalize">{priority}</span>
                        </div>
                        <div className="text-sm">
                          {completed}/{priorityTasks.length} ({percentage.toFixed(0)}%)
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Pèfòmans pa Jou</h4>
                <div className="space-y-2">
                  {['Lendi', 'Madi', 'Mèkredi', 'Jedi', 'Vandredi', 'Samdi', 'Dimanch'].map((day, index) => {
                    // This would need actual day-of-week analysis
                    const randomPercentage = Math.floor(Math.random() * 40) + 60; // Mock data
                    
                    return (
                      <div key={day} className="flex items-center justify-between">
                        <span className="text-sm">{day}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 text-xs text-right">{randomPercentage}%</div>
                          <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-500"
                              style={{ width: `${randomPercentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}