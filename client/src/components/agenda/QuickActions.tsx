import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Mic, 
  Paperclip, 
  Bell, 
  Plus,
  FileText,
  Calendar,
  Clock,
  Zap,
  MessageSquare,
  Upload
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { InsertTask } from "@shared/schema";

interface QuickActionsProps {
  onCreateTask: (task: InsertTask) => void;
  onCreateNote: (note: any) => void;
  onSetReminder: (reminder: any) => void;
}

export function QuickActions({ onCreateTask, onCreateNote, onSetReminder }: QuickActionsProps) {
  const [isVoiceDialogOpen, setIsVoiceDialogOpen] = useState(false);
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
  const [isReminderDialogOpen, setIsReminderDialogOpen] = useState(false);
  const [voiceInput, setVoiceInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [reminderText, setReminderText] = useState('');
  const [reminderTime, setReminderTime] = useState('');
  const { toast } = useToast();

  // Mock voice recognition (in real app, would use Web Speech API)
  const startVoiceRecognition = () => {
    setIsListening(true);
    
    // Simulate voice recognition
    setTimeout(() => {
      setVoiceInput("Rele Dominique demen 3è aprèmidi");
      setIsListening(false);
      toast({
        title: "Vwa rekonèt!",
        description: "Tach ou a kreye otomatikman.",
      });
    }, 2000);
  };

  const processVoiceCommand = () => {
    // Simple parsing of voice commands
    const command = voiceInput.toLowerCase();
    
    if (command.includes('rele') || command.includes('call')) {
      const name = extractName(command);
      const time = extractTime(command);
      
      const task: InsertTask = {
        userId: 'default-user-id',
        title: `Rele ${name}`,
        category: 'sosyal',
        priority: 'medium',
        status: 'pending',
        scheduledDate: time ? new Date(time) : new Date(),
        time: time ? format(new Date(time), 'HH:mm') : null,
        duration: 15
      };
      
      onCreateTask(task);
      setVoiceInput('');
      setIsVoiceDialogOpen(false);
      
      toast({
        title: "Tach kreye!",
        description: `Tach "${task.title}" ajoute nan ajenda ou.`,
      });
    }
  };

  const extractName = (command: string): string => {
    // Simple name extraction
    const words = command.split(' ');
    const nameIndex = words.findIndex(word => word === 'rele' || word === 'call');
    return nameIndex !== -1 && nameIndex + 1 < words.length ? words[nameIndex + 1] : 'moun lan';
  };

  const extractTime = (command: string): string | null => {
    // Simple time extraction
    if (command.includes('demen')) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow.toISOString();
    }
    return null;
  };

  const createQuickNote = () => {
    if (!noteContent.trim()) return;
    
    const note = {
      title: `Nòt rapid - ${new Date().toLocaleDateString()}`,
      content: noteContent,
      category: 'rapid',
      userId: 'default-user-id'
    };
    
    onCreateNote(note);
    setNoteContent('');
    setIsNoteDialogOpen(false);
    
    toast({
      title: "Nòt sove!",
      description: "Nòt rapid ou a anrejistre.",
    });
  };

  const createReminder = () => {
    if (!reminderText.trim() || !reminderTime) return;
    
    const reminder = {
      text: reminderText,
      time: reminderTime,
      type: 'reminder'
    };
    
    onSetReminder(reminder);
    setReminderText('');
    setReminderTime('');
    setIsReminderDialogOpen(false);
    
    toast({
      title: "Rapèl kreye!",
      description: "Ou ap resevwa yon notifikasyon.",
    });
  };

  const quickActionButtons = [
    {
      icon: Mic,
      label: "Vwa",
      description: "Kreye tach ak vwa",
      action: () => setIsVoiceDialogOpen(true),
      color: "bg-blue-500"
    },
    {
      icon: FileText,
      label: "Nòt Rapid",
      description: "Ekri yon nòt rapid",
      action: () => setIsNoteDialogOpen(true),
      color: "bg-green-500"
    },
    {
      icon: Bell,
      label: "Rapèl",
      description: "Mete yon rapèl",
      action: () => setIsReminderDialogOpen(true),
      color: "bg-orange-500"
    },
    {
      icon: Calendar,
      label: "Randevou",
      description: "Planifye yon randevou",
      action: () => {
        const task: InsertTask = {
          userId: 'default-user-id',
          title: 'Nouvo randevou',
          category: 'travay',
          priority: 'medium',
          status: 'pending',
          duration: 60
        };
        onCreateTask(task);
      },
      color: "bg-purple-500"
    },
    {
      icon: Zap,
      label: "Aksyon Rapid",
      description: "Tach 5 minit",
      action: () => {
        const task: InsertTask = {
          userId: 'default-user-id',
          title: 'Aksyon rapid',
          category: 'pèsonèl',
          priority: 'low',
          status: 'pending',
          duration: 5
        };
        onCreateTask(task);
      },
      color: "bg-yellow-500"
    },
    {
      icon: Upload,
      label: "Atache Fichye",
      description: "Ajoute dokiman",
      action: () => {
        toast({
          title: "Fonksyon ap vini",
          description: "Atachman fichye ap disponib byento.",
        });
      },
      color: "bg-indigo-500"
    }
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Aksyon Rapid
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {quickActionButtons.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-20 flex flex-col gap-2 hover:shadow-md transition-shadow"
                onClick={action.action}
              >
                <div className={`p-2 rounded-full ${action.color} text-white`}>
                  <action.icon className="h-4 w-4" />
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium">{action.label}</div>
                  <div className="text-xs text-muted-foreground">{action.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Voice Command Dialog */}
      <Dialog open={isVoiceDialogOpen} onOpenChange={setIsVoiceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mic className="h-5 w-5" />
              Kreye Tach ak Vwa
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center py-8">
              {isListening ? (
                <div className="space-y-4">
                  <div className="animate-pulse">
                    <Mic className="h-16 w-16 text-red-500 mx-auto" />
                  </div>
                  <p className="text-lg font-medium">Kap koute...</p>
                  <div className="flex justify-center">
                    <div className="flex space-x-1">
                      <div className="w-2 h-8 bg-red-500 rounded animate-pulse"></div>
                      <div className="w-2 h-6 bg-red-400 rounded animate-pulse" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-10 bg-red-500 rounded animate-pulse" style={{animationDelay: '0.2s'}}></div>
                      <div className="w-2 h-4 bg-red-400 rounded animate-pulse" style={{animationDelay: '0.3s'}}></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <Mic className="h-16 w-16 text-muted-foreground mx-auto" />
                  <p className="text-muted-foreground">
                    Di sa ou vle fè. Egzanp: "Rele Dominique demen 3è aprèmidi"
                  </p>
                  <Button onClick={startVoiceRecognition}>
                    Kòmanse Pale
                  </Button>
                </div>
              )}
            </div>

            {voiceInput && (
              <div className="space-y-4">
                <div>
                  <Label>Sa ou te di:</Label>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm">{voiceInput}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={processVoiceCommand} className="flex-1">
                    Kreye Tach
                  </Button>
                  <Button variant="outline" onClick={() => setVoiceInput('')}>
                    Eseye Ankò
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Quick Note Dialog */}
      <Dialog open={isNoteDialogOpen} onOpenChange={setIsNoteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Nòt Rapid
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="note-content">Kontni</Label>
              <Textarea
                id="note-content"
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Ekri nòt ou a rapid..."
                rows={4}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={createQuickNote} className="flex-1">
                Sove Nòt
              </Button>
              <Button variant="outline" onClick={() => setIsNoteDialogOpen(false)}>
                Anile
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reminder Dialog */}
      <Dialog open={isReminderDialogOpen} onOpenChange={setIsReminderDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Mete Rapèl
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="reminder-text">Sa pou raple</Label>
              <Input
                id="reminder-text"
                value={reminderText}
                onChange={(e) => setReminderText(e.target.value)}
                placeholder="Egzanp: Achte manje"
              />
            </div>
            <div>
              <Label htmlFor="reminder-time">Lè</Label>
              <Input
                id="reminder-time"
                type="datetime-local"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={createReminder} className="flex-1">
                Kreye Rapèl
              </Button>
              <Button variant="outline" onClick={() => setIsReminderDialogOpen(false)}>
                Anile
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}