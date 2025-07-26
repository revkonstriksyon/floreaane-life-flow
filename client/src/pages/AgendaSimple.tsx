import { useState, useEffect } from "react";
import { ResponsiveLayout } from "@/components/layout/ResponsiveLayout";
import { PullToRefresh, TouchOptimizedButton } from "@/components/mobile/TouchOptimized";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarView } from "@/components/agenda/CalendarView";
import { TaskForm } from "@/components/agenda/TaskForm";
import { TaskList } from "@/components/agenda/TaskList";
import { ProductivityStats } from "@/components/agenda/ProductivityStats";
import { AlternativeViews } from "@/components/agenda/AlternativeViews";
import { QuickActions } from "@/components/agenda/QuickActions";
import { AIInsights } from "@/components/ai/AIInsights";
import { AIChat } from "@/components/ai/AIChat";
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from "@/hooks/api/useTasks";
import { useProjects } from "@/hooks/api/useProjects";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import type { Task, InsertTask } from "@shared/schema";

export default function Agenda() {
  const { userId } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState<'day' | 'week' | 'month'>('week');
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [initialDate, setInitialDate] = useState<Date | undefined>();
  const [initialHour, setInitialHour] = useState<number | undefined>();
  const isMobile = useIsMobile();

  // Use React Query hooks
  const { data: tasks = [], refetch: refetchTasks } = useTasks(userId!);
  const { data: projects = [] } = useProjects(userId!);
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();

  const handleRefresh = async () => {
    await refetchTasks();
    setIsLoading(false);
  };

  const handleCreateTask = async (taskData: InsertTask) => {
    try {
      await createTaskMutation.mutateAsync(taskData);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      await updateTaskMutation.mutateAsync({ id: taskId, task: updates });
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTaskMutation.mutateAsync(taskId);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleTaskClick = (task: Task) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  const handleTimeSlotClick = (date: Date, hour: number) => {
    setInitialDate(date);
    setInitialHour(hour);
    setIsTaskFormOpen(true);
  };

  const handleAddTask = () => {
    setEditingTask(null);
    setInitialDate(selectedDate);
    setInitialHour(undefined);
    setIsTaskFormOpen(true);
  };

  const handleCreateNote = (note: any) => {
    // TODO: Implement note creation
    console.log('Creating note:', note);
  };

  const handleSetReminder = (reminder: any) => {
    // TODO: Implement reminder creation
    console.log('Setting reminder:', reminder);
  };

  const content = (
    <div className={cn("p-4", !isMobile && "p-6")}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Ajenda & Tach</h1>
        <p className="text-muted-foreground">Òganize ak jere tan ou chak jou</p>
      </div>

      <Tabs defaultValue="calendar" className="w-full">
        <TabsList className={cn(
          "grid w-full",
          isMobile ? "grid-cols-3" : "grid-cols-6"
        )}>
          <TabsTrigger value="calendar">📅 Kalandriye</TabsTrigger>
          <TabsTrigger value="tasks">✅ Tach yo</TabsTrigger>
          <TabsTrigger value="stats">📊 Estatistik</TabsTrigger>
          {!isMobile && <TabsTrigger value="views">🎯 Vue yo</TabsTrigger>}
          {!isMobile && <TabsTrigger value="actions">⚡ Aksyon</TabsTrigger>}
          {!isMobile && <TabsTrigger value="ai">🤖 AI</TabsTrigger>}
        </TabsList>

        <TabsContent value="calendar" className="space-y-4">
          <CalendarView
            tasks={tasks}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            onTaskClick={handleTaskClick}
            onTimeSlotClick={handleTimeSlotClick}
            view={calendarView}
            onViewChange={setCalendarView}
          />
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <TaskList
            tasks={tasks}
            onTaskUpdate={handleUpdateTask}
            onTaskDelete={handleDeleteTask}
            onTaskEdit={handleTaskClick}
            onAddTask={handleAddTask}
          />
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <ProductivityStats
            tasks={tasks}
            selectedDate={selectedDate}
          />
        </TabsContent>

        <TabsContent value="views" className="space-y-4">
          <AlternativeViews
            tasks={tasks}
            projects={projects}
            selectedDate={selectedDate}
          />
        </TabsContent>

        <TabsContent value="actions" className="space-y-4">
          <QuickActions
            onCreateTask={handleCreateTask}
            onCreateNote={handleCreateNote}
            onSetReminder={handleSetReminder}
          />
        </TabsContent>

        <TabsContent value="ai" className="space-y-4">
          <AIInsights 
            data={tasks} 
            type="tasks" 
            title="Konsey AI pou Tach yo"
          />
          
          <AIChat 
            context={`Mwen gen ${tasks.length} tach total, ${tasks.filter(t => t.status === 'completed').length} fini.`}
            suggestions={[
              "Ki jan pou òganize tach yo pi byen?",
              "Ki tach ki pi ijan jodi a?",
              "Bay konsey pou amelyore pwodiktivite",
              "Planifye semèn kap vini an"
            ]}
          />
        </TabsContent>
      </Tabs>

      {/* Task Form Dialog */}
      <TaskForm
        isOpen={isTaskFormOpen}
        onClose={() => {
          setIsTaskFormOpen(false);
          setEditingTask(null);
          setInitialDate(undefined);
          setInitialHour(undefined);
        }}
        onSubmit={handleCreateTask}
        initialDate={initialDate}
        initialHour={initialHour}
        editingTask={editingTask}
      />
    </div>
  );

  return (
    <ResponsiveLayout currentPath="/agenda">
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