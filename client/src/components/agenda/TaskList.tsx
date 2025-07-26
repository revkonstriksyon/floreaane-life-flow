import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckCircle, 
  Clock, 
  MapPin, 
  Target, 
  Flame,
  Filter,
  Search,
  Edit,
  Trash2,
  Plus,
  Calendar,
  Repeat,
  AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import type { Task } from "@shared/schema";

interface TaskListProps {
  tasks: Task[];
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
  onTaskDelete: (taskId: string) => void;
  onTaskEdit: (task: Task) => void;
  onAddTask: () => void;
}

const priorities = [
  { value: 'all', label: 'Tout Priyorite' },
  { value: 'urgent', label: 'Ijan', color: 'bg-red-500' },
  { value: 'high', label: 'Wo', color: 'bg-orange-500' },
  { value: 'medium', label: 'Mwayen', color: 'bg-yellow-500' },
  { value: 'low', label: 'Ba', color: 'bg-green-500' }
];

const categories = [
  { value: 'all', label: 'Tout Kategori' },
  { value: 'travay', label: 'Travay', icon: '💼' },
  { value: 'pèsonèl', label: 'Pèsonèl', icon: '🏠' },
  { value: 'sosyal', label: 'Sosyal', icon: '👥' },
  { value: 'administratif', label: 'Administratif', icon: '📋' },
  { value: 'sante', label: 'Sante', icon: '🏥' },
  { value: 'edikasyon', label: 'Edikasyon', icon: '📚' }
];

const statuses = [
  { value: 'all', label: 'Tout Eta' },
  { value: 'pending', label: 'Ap tann' },
  { value: 'completed', label: 'Fini' },
  { value: 'cancelled', label: 'Anile' }
];

export function TaskList({ 
  tasks, 
  onTaskUpdate, 
  onTaskDelete, 
  onTaskEdit, 
  onAddTask 
}: TaskListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.objective?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.location?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    const matchesCategory = filterCategory === 'all' || task.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    
    return matchesSearch && matchesPriority && matchesCategory && matchesStatus;
  });

  const getPriorityColor = (priority: string) => {
    const priorityObj = priorities.find(p => p.value === priority);
    return priorityObj?.color || 'bg-gray-500';
  };

  const getCategoryIcon = (category: string) => {
    const categoryObj = categories.find(c => c.value === category);
    return categoryObj?.icon || '📝';
  };

  const toggleTaskCompletion = (task: Task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    onTaskUpdate(task.id, { status: newStatus });
  };

  const getTasksByStatus = () => {
    return {
      pending: filteredTasks.filter(t => t.status === 'pending'),
      completed: filteredTasks.filter(t => t.status === 'completed'),
      cancelled: filteredTasks.filter(t => t.status === 'cancelled')
    };
  };

  const renderTaskCard = (task: Task) => {
    const isCompleted = task.status === 'completed';
    const isOverdue = task.scheduledDate && new Date(task.scheduledDate) < new Date() && !isCompleted;

    return (
      <Card key={task.id} className={cn(
        "cursor-pointer hover:shadow-md transition-shadow",
        isCompleted && "opacity-75",
        isOverdue && "border-red-200 bg-red-50"
      )}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Checkbox
              checked={isCompleted}
              onCheckedChange={() => toggleTaskCompletion(task)}
              className="mt-1"
            />
            
            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between">
                <h4 className={cn(
                  "font-medium",
                  isCompleted && "line-through text-muted-foreground"
                )}>
                  {task.title}
                </h4>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onTaskEdit(task)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onTaskDelete(task.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge className={`${getPriorityColor(task.priority)} text-white border-none`}>
                  <Flame className="h-3 w-3 mr-1" />
                  {priorities.find(p => p.value === task.priority)?.label}
                </Badge>
                
                <Badge variant="outline">
                  {getCategoryIcon(task.category)} {categories.find(c => c.value === task.category)?.label}
                </Badge>

                {task.duration && (
                  <Badge variant="outline">
                    <Clock className="h-3 w-3 mr-1" />
                    {task.duration}min
                  </Badge>
                )}

                {task.location && (
                  <Badge variant="outline">
                    <MapPin className="h-3 w-3 mr-1" />
                    {task.location}
                  </Badge>
                )}

                {task.objective && (
                  <Badge variant="outline">
                    <Target className="h-3 w-3 mr-1" />
                    {task.objective}
                  </Badge>
                )}

                {task.isRecurring && (
                  <Badge variant="outline">
                    <Repeat className="h-3 w-3 mr-1" />
                    Rekuran
                  </Badge>
                )}
              </div>

              {task.scheduledDate && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {format(new Date(task.scheduledDate), 'PPP')}
                    {task.time && ` nan ${task.time}`}
                  </span>
                  {isOverdue && (
                    <Badge variant="destructive" className="text-xs">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      An reta
                    </Badge>
                  )}
                </div>
              )}

              {task.tags && task.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {task.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderKanbanView = () => {
    const tasksByStatus = getTasksByStatus();

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-yellow-500" />
            Ap tann ({tasksByStatus.pending.length})
          </h3>
          <div className="space-y-3">
            {tasksByStatus.pending.map(renderTaskCard)}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Fini ({tasksByStatus.completed.length})
          </h3>
          <div className="space-y-3">
            {tasksByStatus.completed.map(renderTaskCard)}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Anile ({tasksByStatus.cancelled.length})
          </h3>
          <div className="space-y-3">
            {tasksByStatus.cancelled.map(renderTaskCard)}
          </div>
        </div>
      </div>
    );
  };

  const renderListView = () => {
    return (
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                {searchQuery || filterPriority !== 'all' || filterCategory !== 'all' || filterStatus !== 'all'
                  ? "Pa gen tach ki kòrèk ak filtre yo"
                  : "Pa gen tach yo"
                }
              </p>
              <Button onClick={onAddTask}>
                <Plus className="h-4 w-4 mr-2" />
                Ajoute Premye Tach
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredTasks.map(renderTaskCard)
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtre ak Rechèch
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                Lis
              </Button>
              <Button
                variant={viewMode === 'kanban' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('kanban')}
              >
                Kanban
              </Button>
              <Button onClick={onAddTask}>
                <Plus className="h-4 w-4 mr-2" />
                Nouvo Tach
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Chèche tach..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {priorities.map(priority => (
                  <SelectItem key={priority.value} value={priority.value}>
                    {priority.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statuses.map(status => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Task List */}
      <div>
        {viewMode === 'list' ? renderListView() : renderKanbanView()}
      </div>
    </div>
  );
}