import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Target, 
  TrendingUp, 
  Clock, 
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Award,
  Zap,
  Brain
} from "lucide-react";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isToday } from "date-fns";
import type { Task } from "@shared/schema";

interface ProductivityStatsProps {
  tasks: Task[];
  selectedDate: Date;
}

interface DailyStats {
  date: Date;
  completed: number;
  total: number;
  timeSpent: number;
}

interface CategoryStats {
  category: string;
  completed: number;
  total: number;
  timeSpent: number;
  percentage: number;
}

export function ProductivityStats({ tasks, selectedDate }: ProductivityStatsProps) {
  const [weeklyStats, setWeeklyStats] = useState<DailyStats[]>([]);
  const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([]);
  const [overallStats, setOverallStats] = useState({
    completionRate: 0,
    totalTasks: 0,
    completedTasks: 0,
    averageTaskTime: 0,
    productivityScore: 0,
    streak: 0
  });

  useEffect(() => {
    calculateStats();
  }, [tasks, selectedDate]);

  const calculateStats = () => {
    // Weekly stats
    const weekStart = startOfWeek(selectedDate);
    const weekEnd = endOfWeek(selectedDate);
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

    const dailyStats = weekDays.map(day => {
      const dayTasks = tasks.filter(task => 
        task.scheduledDate && 
        format(new Date(task.scheduledDate), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
      );
      
      const completed = dayTasks.filter(t => t.status === 'completed').length;
      const timeSpent = dayTasks
        .filter(t => t.status === 'completed')
        .reduce((sum, t) => sum + (t.duration || 0), 0);

      return {
        date: day,
        completed,
        total: dayTasks.length,
        timeSpent
      };
    });

    setWeeklyStats(dailyStats);

    // Category stats
    const categories = ['travay', 'pèsonèl', 'sosyal', 'administratif', 'sante', 'edikasyon'];
    const categoryData = categories.map(category => {
      const categoryTasks = tasks.filter(t => t.category === category);
      const completed = categoryTasks.filter(t => t.status === 'completed').length;
      const timeSpent = categoryTasks
        .filter(t => t.status === 'completed')
        .reduce((sum, t) => sum + (t.duration || 0), 0);
      
      return {
        category,
        completed,
        total: categoryTasks.length,
        timeSpent,
        percentage: categoryTasks.length > 0 ? (completed / categoryTasks.length) * 100 : 0
      };
    }).filter(c => c.total > 0);

    setCategoryStats(categoryData);

    // Overall stats
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    const averageTaskTime = completedTasks > 0 
      ? tasks.filter(t => t.status === 'completed' && t.duration)
             .reduce((sum, t) => sum + (t.duration || 0), 0) / completedTasks
      : 0;

    // Calculate streak (consecutive days with completed tasks)
    let streak = 0;
    for (let i = dailyStats.length - 1; i >= 0; i--) {
      if (dailyStats[i].completed > 0) {
        streak++;
      } else {
        break;
      }
    }

    // Productivity score (0-100)
    const productivityScore = Math.min(100, Math.round(
      (completionRate * 0.4) + 
      (streak * 10) + 
      (averageTaskTime > 0 ? Math.min(30, averageTaskTime / 2) : 0)
    ));

    setOverallStats({
      completionRate,
      totalTasks,
      completedTasks,
      averageTaskTime,
      productivityScore,
      streak
    });
  };

  const getCategoryLabel = (category: string) => {
    const labels: { [key: string]: string } = {
      'travay': 'Travay',
      'pèsonèl': 'Pèsonèl',
      'sosyal': 'Sosyal',
      'administratif': 'Administratif',
      'sante': 'Sante',
      'edikasyon': 'Edikasyon'
    };
    return labels[category] || category;
  };

  const getCategoryColor = (category: string, index: number) => {
    const colors = [
      'bg-blue-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-gray-500',
      'bg-green-500',
      'bg-indigo-500'
    ];
    return colors[index % colors.length];
  };

  const getProductivityLevel = (score: number) => {
    if (score >= 80) return { label: 'Ekselan', color: 'text-green-600', icon: '🔥' };
    if (score >= 60) return { label: 'Bon', color: 'text-blue-600', icon: '⚡' };
    if (score >= 40) return { label: 'Mwayen', color: 'text-yellow-600', icon: '📈' };
    return { label: 'Ka amelyore', color: 'text-red-600', icon: '💪' };
  };

  const productivityLevel = getProductivityLevel(overallStats.productivityScore);

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">% Konpleyon</p>
                <p className="text-2xl font-bold">{overallStats.completionRate.toFixed(1)}%</p>
              </div>
              <Target className="h-8 w-8 text-green-500" />
            </div>
            <Progress value={overallStats.completionRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tach Fini</p>
                <p className="text-2xl font-bold">{overallStats.completedTasks}</p>
                <p className="text-xs text-muted-foreground">nan {overallStats.totalTasks} total</p>
              </div>
              <Award className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tan Mwayen</p>
                <p className="text-2xl font-bold">{overallStats.averageTaskTime.toFixed(0)}</p>
                <p className="text-xs text-muted-foreground">minit pa tach</p>
              </div>
              <Clock className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Nivo Pwodiktivite</p>
                <p className={`text-2xl font-bold ${productivityLevel.color}`}>
                  {overallStats.productivityScore}
                </p>
                <p className="text-xs text-muted-foreground">
                  {productivityLevel.icon} {productivityLevel.label}
                </p>
              </div>
              <Brain className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats */}
      <Tabs defaultValue="weekly" className="w-full">
        <TabsList>
          <TabsTrigger value="weekly">Semèn nan</TabsTrigger>
          <TabsTrigger value="categories">Kategori yo</TabsTrigger>
          <TabsTrigger value="trends">Tendans</TabsTrigger>
        </TabsList>

        <TabsContent value="weekly">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Pèfòmans Semèn nan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weeklyStats.map((day, index) => {
                  const completionRate = day.total > 0 ? (day.completed / day.total) * 100 : 0;
                  const isCurrentDay = isToday(day.date);

                  return (
                    <div key={index} className={cn(
                      "p-4 rounded-lg border",
                      isCurrentDay && "bg-primary/5 border-primary/20"
                    )}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">
                            {format(day.date, 'EEEE')}
                          </h4>
                          <span className="text-sm text-muted-foreground">
                            {format(day.date, 'MMM d')}
                          </span>
                          {isCurrentDay && (
                            <Badge variant="default" className="text-xs">Jou a</Badge>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {day.completed}/{day.total} tach
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {day.timeSpent}min
                          </p>
                        </div>
                      </div>
                      <Progress value={completionRate} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">
                        {completionRate.toFixed(0)}% konplete
                      </p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Analiz pa Kategori
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryStats.map((category, index) => (
                  <div key={category.category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded ${getCategoryColor(category.category, index)}`} />
                        <span className="font-medium">{getCategoryLabel(category.category)}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {category.completed}/{category.total}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {category.timeSpent}min
                        </p>
                      </div>
                    </div>
                    <Progress value={category.percentage} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      {category.percentage.toFixed(0)}% konplete
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Tendans ak Insight yo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-5 w-5 text-green-600" />
                      <h4 className="font-medium text-green-800">Streak Aktyèl</h4>
                    </div>
                    <p className="text-2xl font-bold text-green-600">
                      {overallStats.streak} jou
                    </p>
                    <p className="text-sm text-green-600">
                      Jou konsekitif ak tach konplete
                    </p>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="h-5 w-5 text-blue-600" />
                      <h4 className="font-medium text-blue-800">Balans Lavi/Travay</h4>
                    </div>
                    <div className="space-y-2">
                      {categoryStats.slice(0, 2).map((cat, index) => (
                        <div key={cat.category} className="flex justify-between text-sm">
                          <span>{getCategoryLabel(cat.category)}</span>
                          <span className="font-medium">
                            {((cat.timeSpent / categoryStats.reduce((sum, c) => sum + c.timeSpent, 0)) * 100).toFixed(0)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-medium text-yellow-800 mb-2">💡 Rekòmandasyon</h4>
                  <ul className="space-y-1 text-sm text-yellow-700">
                    {overallStats.completionRate < 70 && (
                      <li>• Konsèye w diminye kantite tach yo chak jou</li>
                    )}
                    {overallStats.averageTaskTime > 60 && (
                      <li>• Divize tach yo ki pi long nan etap pi piti</li>
                    )}
                    {overallStats.streak === 0 && (
                      <li>• Kòmanse ak tach senp yo pou bati yon streak</li>
                    )}
                    {categoryStats.some(c => c.percentage < 50) && (
                      <li>• Konsantre sou kategori ki gen pi piti to konpleyon</li>
                    )}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}