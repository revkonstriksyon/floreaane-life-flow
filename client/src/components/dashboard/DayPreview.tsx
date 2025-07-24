import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, AlertCircle, MoreHorizontal } from "lucide-react";

const timeSlots = [
  {
    time: "Maten (6h-12h)",
    tasks: [
      { id: 1, title: "Meditasyon ak etirement", type: "routine", status: "pending", priority: "high" },
      { id: 2, title: "Bwè 2 vè dlo", type: "routine", status: "completed", priority: "medium" },
      { id: 3, title: "Ekri nan jounal mwen", type: "personal", status: "pending", priority: "medium" },
    ]
  },
  {
    time: "Midi (12h-17h)", 
    tasks: [
      { id: 4, title: "Reyinyon ak ekip la", type: "work", status: "pending", priority: "high" },
      { id: 5, title: "Kontinye pwojè FLOREAANE", type: "work", status: "pending", priority: "high" },
      { id: 6, title: "Rele manman m", type: "personal", status: "pending", priority: "medium" },
    ]
  },
  {
    time: "Aswè (17h-22h)",
    tasks: [
      { id: 7, title: "Prepare manje", type: "routine", status: "pending", priority: "medium" },
      { id: 8, title: "Li 30 minit", type: "personal", status: "pending", priority: "low" },
      { id: 9, title: "Refleksyon sou jounen an", type: "routine", status: "pending", priority: "medium" },
    ]
  }
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="h-4 w-4 text-success" />;
    case "pending":
      return <Clock className="h-4 w-4 text-warning" />;
    case "overdue":
      return <AlertCircle className="h-4 w-4 text-destructive" />;
    default:
      return <Clock className="h-4 w-4 text-muted-foreground" />;
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high": return "bg-destructive";
    case "medium": return "bg-warning";
    case "low": return "bg-success";
    default: return "bg-muted";
  }
};

export function DayPreview() {
  const [tasks, setTasks] = useState(timeSlots);

  const toggleTask = (slotIndex: number, taskId: number) => {
    setTasks(prev => prev.map((slot, i) => 
      i === slotIndex 
        ? {
            ...slot,
            tasks: slot.tasks.map(task => 
              task.id === taskId 
                ? { ...task, status: task.status === "completed" ? "pending" : "completed" }
                : task
            )
          }
        : slot
    ));
  };

  const totalTasks = tasks.reduce((acc, slot) => acc + slot.tasks.length, 0);
  const completedTasks = tasks.reduce((acc, slot) => 
    acc + slot.tasks.filter(task => task.status === "completed").length, 0
  );

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📅</span>
            Plan Jounen an
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-background/50">
              {completedTasks}/{totalTasks} fèt
            </Badge>
            <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-primary transition-all duration-500"
                style={{ width: `${(completedTasks / totalTasks) * 100}%` }}
              />
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {tasks.map((slot, slotIndex) => (
          <div key={slot.time} className="space-y-3">
            <h3 className="font-semibold text-sm text-accent flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {slot.time}
            </h3>
            <div className="space-y-2 pl-6">
              {slot.tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-background/30 hover:bg-background/50 transition-colors group"
                >
                  <button
                    onClick={() => toggleTask(slotIndex, task.id)}
                    className="flex-shrink-0"
                  >
                    {getStatusIcon(task.status)}
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${
                      task.status === "completed" 
                        ? "line-through text-muted-foreground" 
                        : "text-foreground"
                    }`}>
                      {task.title}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />
                    <Badge variant="secondary" className="text-xs">
                      {task.type}
                    </Badge>
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        <div className="pt-4 border-t border-border/50">
          <Button variant="outline" className="w-full">
            <span className="text-lg mr-2">➕</span>
            Ajoute nouvo aktivite
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}