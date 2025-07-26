import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Clock, 
  MapPin, 
  Target, 
  Flame, 
  Repeat, 
  Plus,
  X,
  Calendar,
  Lightbulb
} from "lucide-react";
import type { InsertTask } from "@shared/schema";

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: InsertTask) => void;
  initialDate?: Date;
  initialHour?: number;
  editingTask?: any;
}

const priorities = [
  { value: 'low', label: 'Ba', color: 'bg-green-500' },
  { value: 'medium', label: 'Mwayen', color: 'bg-yellow-500' },
  { value: 'high', label: 'Wo', color: 'bg-orange-500' },
  { value: 'urgent', label: 'Ijan', color: 'bg-red-500' }
];

const categories = [
  { value: 'travay', label: 'Travay', icon: '💼' },
  { value: 'pèsonèl', label: 'Pèsonèl', icon: '🏠' },
  { value: 'sosyal', label: 'Sosyal', icon: '👥' },
  { value: 'administratif', label: 'Administratif', icon: '📋' },
  { value: 'sante', label: 'Sante', icon: '🏥' },
  { value: 'edikasyon', label: 'Edikasyon', icon: '📚' }
];

const recurringPatterns = [
  { value: 'daily', label: 'Chak jou' },
  { value: 'weekly', label: 'Chak semèn' },
  { value: 'monthly', label: 'Chak mwa' },
  { value: 'custom', label: 'Kustom' }
];

export function TaskForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialDate, 
  initialHour,
  editingTask 
}: TaskFormProps) {
  const [formData, setFormData] = useState({
    title: editingTask?.title || '',
    time: editingTask?.time || (initialHour ? `${initialHour.toString().padStart(2, '0')}:00` : ''),
    duration: editingTask?.duration || 30,
    priority: editingTask?.priority || 'medium',
    category: editingTask?.category || 'pèsonèl',
    location: editingTask?.location || '',
    objective: editingTask?.objective || '',
    scheduledDate: editingTask?.scheduledDate 
      ? new Date(editingTask.scheduledDate).toISOString().split('T')[0]
      : initialDate?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
    isRecurring: editingTask?.isRecurring || false,
    recurringPattern: editingTask?.recurringPattern || null,
    tags: editingTask?.tags || [],
    isComplex: false,
    subtasks: [] as string[],
    dependencies: [] as string[]
  });

  const [newTag, setNewTag] = useState('');
  const [newSubtask, setNewSubtask] = useState('');
  const [activeTab, setActiveTab] = useState('basic');

  const handleSubmit = () => {
    const taskData: InsertTask = {
      userId: 'default-user-id', // This should come from auth context
      title: formData.title,
      time: formData.time || null,
      duration: formData.duration,
      priority: formData.priority,
      category: formData.category,
      status: 'pending',
      location: formData.location || null,
      objective: formData.objective || null,
      scheduledDate: formData.scheduledDate ? new Date(formData.scheduledDate) : null,
      isRecurring: formData.isRecurring,
      recurringPattern: formData.isRecurring ? formData.recurringPattern : null,
      tags: formData.tags.length > 0 ? formData.tags : null
    };

    onSubmit(taskData);
    onClose();
    
    // Reset form
    setFormData({
      title: '',
      time: '',
      duration: 30,
      priority: 'medium',
      category: 'pèsonèl',
      location: '',
      objective: '',
      scheduledDate: new Date().toISOString().split('T')[0],
      isRecurring: false,
      recurringPattern: null,
      tags: [],
      isComplex: false,
      subtasks: [],
      dependencies: []
    });
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addSubtask = () => {
    if (newSubtask.trim()) {
      setFormData(prev => ({
        ...prev,
        subtasks: [...prev.subtasks, newSubtask.trim()]
      }));
      setNewSubtask('');
    }
  };

  const removeSubtask = (index: number) => {
    setFormData(prev => ({
      ...prev,
      subtasks: prev.subtasks.filter((_, i) => i !== index)
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingTask ? 'Modifye Tach' : 'Nouvo Tach'}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Enfòmasyon</TabsTrigger>
            <TabsTrigger value="advanced">Avanse</TabsTrigger>
            <TabsTrigger value="ai">AI Sijesyon</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div>
              <Label htmlFor="title">Tit Tach *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Egzanp: Rele doktè a"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Dat</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.scheduledDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, scheduledDate: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="time">Lè</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="duration">Durasyon (minit)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 30 }))}
                  min="5"
                  step="5"
                />
              </div>
              <div>
                <Label htmlFor="priority">Priyorite</Label>
                <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priorities.map(priority => (
                      <SelectItem key={priority.value} value={priority.value}>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${priority.color}`} />
                          <Flame className="h-3 w-3" />
                          {priority.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="category">Kategori</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      <div className="flex items-center gap-2">
                        <span>{category.icon}</span>
                        {category.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location">📍 Lokasyon</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Egzanp: Biwo a, Kay la"
                />
              </div>
              <div>
                <Label htmlFor="objective">🎯 Objektif</Label>
                <Input
                  id="objective"
                  value={formData.objective}
                  onChange={(e) => setFormData(prev => ({ ...prev, objective: e.target.value }))}
                  placeholder="Egzanp: Fè randevou"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="recurring"
                checked={formData.isRecurring}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isRecurring: checked }))}
              />
              <Label htmlFor="recurring" className="flex items-center gap-2">
                <Repeat className="h-4 w-4" />
                Tach Rekuran
              </Label>
            </div>

            {formData.isRecurring && (
              <div>
                <Label>Patern Rekurans</Label>
                <Select 
                  value={formData.recurringPattern?.type || 'daily'} 
                  onValueChange={(value) => setFormData(prev => ({ 
                    ...prev, 
                    recurringPattern: { type: value, interval: 1 }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {recurringPatterns.map(pattern => (
                      <SelectItem key={pattern.value} value={pattern.value}>
                        {pattern.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Switch
                id="complex"
                checked={formData.isComplex}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isComplex: checked }))}
              />
              <Label htmlFor="complex">🧩 Tach Konplèks (ak etap yo)</Label>
            </div>

            {formData.isComplex && (
              <div>
                <Label>Etap yo (Subtasks)</Label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={newSubtask}
                      onChange={(e) => setNewSubtask(e.target.value)}
                      placeholder="Ajoute yon etap..."
                      onKeyPress={(e) => e.key === 'Enter' && addSubtask()}
                    />
                    <Button type="button" onClick={addSubtask} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-1">
                    {formData.subtasks.map((subtask, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                        <span className="text-sm">{subtask}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSubtask(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div>
              <Label>Tags</Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Ajoute yon tag..."
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  />
                  <Button type="button" onClick={addTag} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="cursor-pointer">
                      {tag}
                      <X 
                        className="h-3 w-3 ml-1" 
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ai" className="space-y-4">
            <div className="text-center py-8">
              <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">🧠 Sijesyon AI</h3>
              <p className="text-muted-foreground mb-4">
                AI ap ede w optimize tach ou yo ak sijesyon entèlijan
              </p>
              
              <div className="space-y-3 text-left">
                <div className="p-3 bg-blue-50 rounded-lg border">
                  <h4 className="font-medium text-blue-800">🔁 Auto-replanning</h4>
                  <p className="text-sm text-blue-600">
                    Si ou rate yon tach, AI ap replanifye l otomatikman
                  </p>
                </div>
                
                <div className="p-3 bg-green-50 rounded-lg border">
                  <h4 className="font-medium text-green-800">💡 Sijesyon Entèlijan</h4>
                  <p className="text-sm text-green-600">
                    AI ka rekòmande pi bon lè pou fè yon travay
                  </p>
                </div>
                
                <div className="p-3 bg-purple-50 rounded-lg border">
                  <h4 className="font-medium text-purple-800">📬 Souvenans Entèlijan</h4>
                  <p className="text-sm text-purple-600">
                    "Ou pa janm fè plan pou repo w...", "Mank follow-up ak kliyan sa"
                  </p>
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground mt-4">
                Fonksyonalite sa yo ap disponib nan pwochèn vèsyon an
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Anile
          </Button>
          <Button onClick={handleSubmit} disabled={!formData.title.trim()}>
            {editingTask ? 'Sove Chanjman' : 'Kreye Tach'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}