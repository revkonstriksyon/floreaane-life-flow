import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Target, 
  Flame,
  ChevronLeft,
  ChevronRight,
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, addDays, subDays } from "date-fns";
import type { Task } from "@shared/schema";

interface CalendarViewProps {
  tasks: Task[];
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  onTaskClick: (task: Task) => void;
  onTimeSlotClick: (date: Date, hour: number) => void;
  view: 'day' | 'week' | 'month';
  onViewChange: (view: 'day' | 'week' | 'month') => void;
}

const timeSlots = Array.from({ length: 24 }, (_, i) => i);

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'urgent': return 'bg-red-500';
    case 'high': return 'bg-orange-500';
    case 'medium': return 'bg-yellow-500';
    case 'low': return 'bg-green-500';
    default: return 'bg-gray-500';
  }
};

const getCategoryColor = (category: string) => {
  const colors: { [key: string]: string } = {
    'travay': 'bg-blue-500',
    'pèsonèl': 'bg-purple-500',
    'sosyal': 'bg-pink-500',
    'administratif': 'bg-gray-500',
    'sante': 'bg-green-500',
    'edikasyon': 'bg-indigo-500'
  };
  return colors[category] || 'bg-gray-500';
};

export function CalendarView({ 
  tasks, 
  selectedDate, 
  onDateSelect, 
  onTaskClick, 
  onTimeSlotClick,
  view,
  onViewChange 
}: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(selectedDate);

  useEffect(() => {
    setCurrentDate(selectedDate);
  }, [selectedDate]);

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => 
      task.scheduledDate && isSameDay(new Date(task.scheduledDate), date)
    );
  };

  const getTasksForHour = (date: Date, hour: number) => {
    return tasks.filter(task => {
      if (!task.scheduledDate || !task.time) return false;
      const taskDate = new Date(task.scheduledDate);
      const taskHour = parseInt(task.time.split(':')[0]);
      return isSameDay(taskDate, date) && taskHour === hour;
    });
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    let newDate;
    switch (view) {
      case 'day':
        newDate = direction === 'next' ? addDays(currentDate, 1) : subDays(currentDate, 1);
        break;
      case 'week':
        newDate = direction === 'next' ? addDays(currentDate, 7) : subDays(currentDate, 7);
        break;
      case 'month':
        newDate = direction === 'next' 
          ? new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
          : new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        break;
      default:
        newDate = currentDate;
    }
    setCurrentDate(newDate);
    onDateSelect(newDate);
  };

  const renderDayView = () => {
    const dayTasks = getTasksForDate(currentDate);
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {format(currentDate, 'EEEE, MMMM d, yyyy')}
          </h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => navigateDate('prev')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigateDate('next')}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2 max-h-96 overflow-y-auto">
          {timeSlots.map(hour => {
            const hourTasks = getTasksForHour(currentDate, hour);
            const timeString = `${hour.toString().padStart(2, '0')}:00`;
            
            return (
              <div 
                key={hour}
                className="flex items-center gap-4 p-2 border rounded-lg hover:bg-muted/50 cursor-pointer"
                onClick={() => onTimeSlotClick(currentDate, hour)}
              >
                <div className="w-16 text-sm text-muted-foreground font-mono">
                  {timeString}
                </div>
                <div className="flex-1 min-h-[40px] flex flex-wrap gap-2">
                  {hourTasks.map(task => (
                    <div
                      key={task.id}
                      className="flex items-center gap-2 p-2 bg-card border rounded cursor-pointer hover:shadow-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onTaskClick(task);
                      }}
                    >
                      <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`} />
                      <span className="text-sm font-medium">{task.title}</span>
                      {task.duration && (
                        <Badge variant="outline" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {task.duration}min
                        </Badge>
                      )}
                      {task.location && (
                        <Badge variant="outline" className="text-xs">
                          <MapPin className="h-3 w-3 mr-1" />
                          {task.location}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const weekStart = startOfWeek(currentDate);
    const weekEnd = endOfWeek(currentDate);
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
          </h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => navigateDate('prev')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigateDate('next')}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {weekDays.map(day => {
            const dayTasks = getTasksForDate(day);
            const isToday = isSameDay(day, new Date());
            const isSelected = isSameDay(day, currentDate);

            return (
              <Card 
                key={day.toISOString()}
                className={cn(
                  "cursor-pointer hover:shadow-md transition-shadow",
                  isToday && "ring-2 ring-primary",
                  isSelected && "bg-primary/5"
                )}
                onClick={() => onDateSelect(day)}
              >
                <CardHeader className="p-3">
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">
                      {format(day, 'EEE')}
                    </div>
                    <div className="text-lg font-semibold">
                      {format(day, 'd')}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <div className="space-y-1">
                    {dayTasks.slice(0, 3).map(task => (
                      <div
                        key={task.id}
                        className="text-xs p-1 bg-muted rounded truncate cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          onTaskClick(task);
                        }}
                      >
                        <div className="flex items-center gap-1">
                          <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />
                          <span>{task.title}</span>
                        </div>
                      </div>
                    ))}
                    {dayTasks.length > 3 && (
                      <div className="text-xs text-muted-foreground text-center">
                        +{dayTasks.length - 3} plis
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  const renderMonthView = () => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {format(currentDate, 'MMMM yyyy')}
          </h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => navigateDate('prev')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigateDate('next')}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Calendar
          mode="single"
          selected={currentDate}
          onSelect={(date) => date && onDateSelect(date)}
          className="rounded-md border"
          components={{
            DayContent: ({ date }) => {
              const dayTasks = getTasksForDate(date);
              return (
                <div className="relative w-full h-full">
                  <div>{format(date, 'd')}</div>
                  {dayTasks.length > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 flex justify-center">
                      <div className="w-1 h-1 bg-primary rounded-full" />
                    </div>
                  )}
                </div>
              );
            }
          }}
        />
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Kalandriye
          </CardTitle>
          <Tabs value={view} onValueChange={(v) => onViewChange(v as 'day' | 'week' | 'month')}>
            <TabsList>
              <TabsTrigger value="day">Jou</TabsTrigger>
              <TabsTrigger value="week">Semèn</TabsTrigger>
              <TabsTrigger value="month">Mwa</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        {view === 'day' && renderDayView()}
        {view === 'week' && renderWeekView()}
        {view === 'month' && renderMonthView()}
      </CardContent>
    </Card>
  );
}