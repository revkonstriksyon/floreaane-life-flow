
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, X, Clock, AlertTriangle, Info, CheckCircle, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Notification {
  id: string;
  type: 'deadline' | 'overdue' | 'birthday' | 'bill' | 'maintenance' | 'contact';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  read: boolean;
  action_url?: string;
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    generateNotifications();
  }, []);

  const generateNotifications = async () => {
    const generatedNotifications: Notification[] = [];
    const today = new Date();

    try {
      // Check for overdue tasks
      const { data: tasks } = await supabase
        .from('tasks')
        .select('*')
        .eq('status', 'pending');

      if (tasks) {
        tasks.forEach(task => {
          if (task.scheduled_date) {
            const taskDate = new Date(task.scheduled_date);
            const daysDiff = Math.ceil((today.getTime() - taskDate.getTime()) / (1000 * 60 * 60 * 24));
            
            if (daysDiff > 0) {
              generatedNotifications.push({
                id: `task-overdue-${task.id}`,
                type: 'overdue',
                title: 'Tach an reta',
                message: `"${task.title}" te dwe fini depi ${daysDiff} jou`,
                priority: 'high',
                created_at: new Date().toISOString(),
                read: false,
                action_url: '/agenda'
              });
            } else if (daysDiff === 0) {
              generatedNotifications.push({
                id: `task-due-${task.id}`,
                type: 'deadline',
                title: 'Tach pou jou a',
                message: `"${task.title}" dwe fini jou a`,
                priority: 'medium',
                created_at: new Date().toISOString(),
                read: false,
                action_url: '/agenda'
              });
            }
          }
        });
      }

      // Check for upcoming bills
      const { data: bills } = await supabase
        .from('bills')
        .select('*')
        .eq('status', 'pending');

      if (bills) {
        bills.forEach(bill => {
          if (bill.due_date) {
            const billDate = new Date(bill.due_date);
            const daysDiff = Math.ceil((billDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            
            if (daysDiff <= 3 && daysDiff >= 0) {
              generatedNotifications.push({
                id: `bill-due-${bill.id}`,
                type: 'bill',
                title: 'Faktè prèske rive',
                message: `"${bill.name}" dwe peye nan ${daysDiff} jou`,
                priority: daysDiff === 0 ? 'high' : 'medium',
                created_at: new Date().toISOString(),
                read: false,
                action_url: '/finances'
              });
            }
          }
        });
      }

      // Check for birthdays
      const { data: contacts } = await supabase
        .from('contacts')
        .select('*')
        .not('birthday', 'is', null);

      if (contacts) {
        contacts.forEach(contact => {
          if (contact.birthday) {
            const birthday = new Date(contact.birthday);
            const thisYearBirthday = new Date(today.getFullYear(), birthday.getMonth(), birthday.getDate());
            const daysDiff = Math.ceil((thisYearBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            
            if (daysDiff >= 0 && daysDiff <= 7) {
              generatedNotifications.push({
                id: `birthday-${contact.id}`,
                type: 'birthday',
                title: 'Anivèsè',
                message: `${contact.first_name} ${contact.last_name || ''} gen anivèsè ${daysDiff === 0 ? 'jou a' : `nan ${daysDiff} jou`}`,
                priority: 'low',
                created_at: new Date().toISOString(),
                read: false,
                action_url: '/contacts'
              });
            }
          }
        });
      }

      // Check for contacts that need follow-up
      const { data: contactsToFollow } = await supabase
        .from('contacts')
        .select('*')
        .not('last_contacted', 'is', null)
        .not('contact_frequency_days', 'is', null);

      if (contactsToFollow) {
        contactsToFollow.forEach(contact => {
          if (contact.last_contacted && contact.contact_frequency_days) {
            const lastContact = new Date(contact.last_contacted);
            const daysSince = Math.ceil((today.getTime() - lastContact.getTime()) / (1000 * 60 * 60 * 24));
            
            if (daysSince > contact.contact_frequency_days) {
              generatedNotifications.push({
                id: `contact-follow-${contact.id}`,
                type: 'contact',
                title: 'Kontak bezwen swiv',
                message: `Ou pa pale ak ${contact.first_name} depi ${daysSince} jou`,
                priority: 'medium',
                created_at: new Date().toISOString(),
                read: false,
                action_url: '/contacts'
              });
            }
          }
        });
      }

      setNotifications(generatedNotifications);
      setUnreadCount(generatedNotifications.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error generating notifications:', error);
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'deadline': return <Clock className="h-4 w-4" />;
      case 'overdue': return <AlertTriangle className="h-4 w-4" />;
      case 'birthday': return <Calendar className="h-4 w-4" />;
      case 'bill': return <AlertTriangle className="h-4 w-4" />;
      case 'contact': return <Info className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500">
            {unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <Card className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-hidden z-50 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Notifikasyon</CardTitle>
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                    Tout li
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="overflow-y-auto max-h-64 space-y-2">
            {notifications.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                <CheckCircle className="h-8 w-8 mx-auto mb-2" />
                <p>Pa gen notifikasyon</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    notification.read ? 'bg-muted/30' : 'bg-background border-primary/20'
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-1 ${getPriorityColor(notification.priority)}`}>
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{notification.title}</h4>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(notification.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    )}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
