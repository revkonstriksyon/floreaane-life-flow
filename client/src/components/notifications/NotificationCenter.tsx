import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
  Bell, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  X, 
  Settings, 
  Plus,
  Calendar,
  MessageSquare,
  Zap,
  Brain
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NotificationItem {
  id: string;
  type: 'reminder' | 'during' | 'followup' | 'special';
  title: string;
  message: string;
  scheduled_time: string;
  is_read: boolean;
  is_completed: boolean;
  related_task_id?: string;
  related_project_id?: string;
  priority: 'low' | 'medium' | 'high';
  created_at: string;
}

interface NotificationSettings {
  enable_reminders: boolean;
  reminder_minutes_before: number;
  enable_during_notifications: boolean;
  enable_followup_notifications: boolean;
  followup_delay_minutes: number;
  quiet_hours_start: string;
  quiet_hours_end: string;
}

const notificationTypes = {
  reminder: { label: "Rapèl", color: "bg-blue-500", icon: Clock },
  during: { label: "Pandan", color: "bg-yellow-500", icon: Bell },
  followup: { label: "Konfime", color: "bg-green-500", icon: CheckCircle },
  special: { label: "Espesyal", color: "bg-purple-500", icon: AlertTriangle }
};

const priorityColors = {
  low: "bg-gray-500",
  medium: "bg-yellow-500",
  high: "bg-red-500"
};

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      type: 'reminder',
      title: 'Randevou ak Doktè',
      message: 'Sonje randevou ou ak doktè a nan 3h aprèmidi',
      scheduled_time: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      is_read: false,
      is_completed: false,
      priority: 'high',
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      type: 'followup',
      title: 'Tcheke Pwojè Nèt la',
      message: 'Eske ou fin fè tâche ki te nan agenda ou a maten an?',
      scheduled_time: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
      is_read: false,
      is_completed: false,
      priority: 'medium',
      created_at: new Date().toISOString()
    }
  ]);
  const [newNotification, setNewNotification] = useState({
    title: "",
    message: "",
    type: "reminder",
    priority: "medium",
    scheduled_time: "",
    related_task_id: ""
  });
  const [settings, setSettings] = useState<NotificationSettings>({
    enable_reminders: true,
    reminder_minutes_before: 15,
    enable_during_notifications: true,
    enable_followup_notifications: true,
    followup_delay_minutes: 60,
    quiet_hours_start: "22:00",
    quiet_hours_end: "07:00"
  });
  const { toast } = useToast();

  // Mark notification as read
  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, is_read: true } : notif
      )
    );
  };

  // Mark notification as completed
  const markAsCompleted = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, is_completed: true } : notif
      )
    );
    toast({
      title: "Konfime!",
      description: "Notifikasyon an make kòm fini.",
    });
  };

  // Delete notification
  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
  };

  // Add new notification
  const addNotification = () => {
    if (!newNotification.title || !newNotification.scheduled_time) return;
    
    const notification: NotificationItem = {
      id: Date.now().toString(),
      ...newNotification,
      is_read: false,
      is_completed: false,
      created_at: new Date().toISOString()
    } as NotificationItem;

    setNotifications(prev => [...prev, notification]);
    setNewNotification({
      title: "",
      message: "",
      type: "reminder",
      priority: "medium",
      scheduled_time: "",
      related_task_id: ""
    });
    setIsOpen(false);
    toast({
      title: "Notifikasyon ajoute!",
      description: "Nouvo notifikasyon an kreye ak siksè.",
    });
  };

  // Check for due notifications
  useEffect(() => {
    const checkNotifications = () => {
      const now = new Date();
      const dueNotifications = notifications.filter(notif => 
        !notif.is_read && 
        new Date(notif.scheduled_time) <= now
      );

      dueNotifications.forEach(notif => {
        // Show browser notification if permission granted
        if (Notification.permission === 'granted') {
          new Notification(notif.title, {
            body: notif.message,
            icon: '/favicon.ico'
          });
        }

        // Auto-mark as read
        markAsRead(notif.id);
      });
    };

    const interval = setInterval(checkNotifications, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, [notifications]);

  // Request notification permission on component mount
  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const unreadCount = notifications.filter(n => !n.is_read).length;
  const pendingNotifications = notifications.filter(n => !n.is_completed);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="relative">
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              >
                {unreadCount}
              </Badge>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifikasyon yo ({unreadCount} nouvo)
              </DialogTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsSettingsOpen(true)}
                >
                  <Settings className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    setNewNotification({
                      title: "",
                      message: "",
                      type: "reminder",
                      priority: "medium", 
                      scheduled_time: "",
                      related_task_id: ""
                    });
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajoute
                </Button>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Add New Notification Form */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg">Nouvo Notifikasyon</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="notif-title">Tit</Label>
                    <Input
                      id="notif-title"
                      value={newNotification.title}
                      onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
                      placeholder="Tit notifikasyon an..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="notif-type">Tip</Label>
                    <Select 
                      value={newNotification.type} 
                      onValueChange={(value) => setNewNotification({...newNotification, type: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="reminder">Rapèl</SelectItem>
                        <SelectItem value="during">Pandan</SelectItem>
                        <SelectItem value="followup">Konfime</SelectItem>
                        <SelectItem value="special">Espesyal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="notif-message">Mesaj</Label>
                  <Textarea
                    id="notif-message"
                    value={newNotification.message}
                    onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
                    placeholder="Mesaj notifikasyon an..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="notif-time">Dat ak Lè</Label>
                    <Input
                      id="notif-time"
                      type="datetime-local"
                      value={newNotification.scheduled_time}
                      onChange={(e) => setNewNotification({...newNotification, scheduled_time: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="notif-priority">Priorite</Label>
                    <Select 
                      value={newNotification.priority} 
                      onValueChange={(value) => setNewNotification({...newNotification, priority: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Ba</SelectItem>
                        <SelectItem value="medium">Mwayen</SelectItem>
                        <SelectItem value="high">Wo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  onClick={addNotification} 
                  className="w-full"
                  disabled={!newNotification.title || !newNotification.scheduled_time}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajoute Notifikasyon
                </Button>
              </CardContent>
            </Card>

            {/* Notifications List */}
            <div className="space-y-3">
              {pendingNotifications.length > 0 ? (
                pendingNotifications.map((notification) => {
                  const TypeIcon = notificationTypes[notification.type as keyof typeof notificationTypes]?.icon || Bell;
                  
                  return (
                    <Card key={notification.id} className={`${!notification.is_read ? 'border-primary/50 bg-primary/5' : ''}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div className={`p-2 rounded-full ${notificationTypes[notification.type as keyof typeof notificationTypes]?.color || 'bg-gray-500'} text-white`}>
                              <TypeIcon className="h-4 w-4" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium">{notification.title}</h4>
                                <Badge 
                                  variant="outline" 
                                  className={`${priorityColors[notification.priority as keyof typeof priorityColors] || 'bg-gray-500'} text-white border-none text-xs`}
                                >
                                  {notification.priority}
                                </Badge>
                                <Badge variant="outline" className={`${notificationTypes[notification.type as keyof typeof notificationTypes]?.color || 'bg-gray-500'} text-white border-none text-xs`}>
                                  {notificationTypes[notification.type as keyof typeof notificationTypes]?.label || 'Default'}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(notification.scheduled_time).toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {!notification.is_completed && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => markAsCompleted(notification.id)}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => deleteNotification(notification.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Pa gen notifikasyon</p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Paramèt Notifikasyon
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="enable-reminders">Aktive Rapèl yo</Label>
              <Switch id="enable-reminders" checked={settings?.enable_reminders} />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="enable-during">Aktive Notifikasyon Pandan</Label>
              <Switch id="enable-during" checked={settings?.enable_during_notifications} />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="enable-followup">Aktive Notifikasyon Konfime</Label>
              <Switch id="enable-followup" checked={settings?.enable_followup_notifications} />
            </div>

            <div>
              <Label htmlFor="reminder-minutes">Rapèl Minit Avan</Label>
              <Input
                id="reminder-minutes"
                type="number"
                value={settings?.reminder_minutes_before || 15}
                placeholder="15"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quiet-start">Lè Silans Kòmanse</Label>
                <Input
                  id="quiet-start"
                  type="time"
                  value={settings?.quiet_hours_start || "22:00"}
                />
              </div>
              <div>
                <Label htmlFor="quiet-end">Lè Silans Fini</Label>
                <Input
                  id="quiet-end"
                  type="time"
                  value={settings?.quiet_hours_end || "07:00"}
                />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}