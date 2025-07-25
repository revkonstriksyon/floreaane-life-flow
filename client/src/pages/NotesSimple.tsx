import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Plus, Search, Edit, Trash2, FileText } from "lucide-react";
import { ResponsiveLayout } from "@/components/layout/ResponsiveLayout";
import type { Note } from "@/types";

const MOCK_NOTES: Note[] = [
  {
    id: '1',
    title: 'Ide Pwojè',
    content: 'Kreye yon aplikasyon pou jere kominote a',
    category: 'travay',
    user_id: 'user1',
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Resèt kafe',
    content: '2 ti kiyè kafè\n1 ti kiyè sik\nYo pou melanje ak yon ti jan dlo cho',
    category: 'pèsonèl',
    user_id: 'user1',
    created_at: new Date().toISOString()
  }
];

export default function NotesSimple() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [newNote, setNewNote] = useState<Partial<Note>>({
    title: '',
    content: '',
    category: 'pèsonèl'
  });

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setNotes(MOCK_NOTES);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addNote = async () => {
    try {
      const noteWithId = {
        ...newNote,
        id: Math.random().toString(),
        user_id: 'current-user',
        created_at: new Date().toISOString()
      } as Note;

      setNotes([noteWithId, ...notes]);
      setNewNote({ title: '', content: '', category: 'pèsonèl' });
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const updateNote = async () => {
    if (!editingNote) return;
    
    try {
      const updatedNotes = notes.map(note =>
        note.id === editingNote.id ? { ...editingNote, updated_at: new Date().toISOString() } : note
      );
      setNotes(updatedNotes);
      setEditingNote(null);
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const deleteNote = async (noteId: string) => {
    try {
      setNotes(notes.filter(note => note.id !== noteId));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || note.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { value: "all", label: "Tout" },
    { value: "pèsonèl", label: "Pèsonèl" },
    { value: "travay", label: "Travay" },
    { value: "edikasyon", label: "Edikasyon" },
    { value: "pwojè", label: "Pwojè" },
    { value: "lòt", label: "Lòt" }
  ];

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'pèsonèl': 'bg-blue-500',
      'travay': 'bg-green-500',
      'edikasyon': 'bg-purple-500',
      'pwojè': 'bg-orange-500',
      'lòt': 'bg-gray-500'
    };
    return colors[category] || 'bg-gray-500';
  };

  const content = (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Nòt yo</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouvo Nòt
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Nouvo Nòt</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Tit (opsyonèl)</Label>
                <Input
                  id="title"
                  value={newNote.title || ''}
                  onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                  placeholder="Tit nòt la..."
                />
              </div>
              <div>
                <Label htmlFor="content">Kontni</Label>
                <Textarea
                  id="content"
                  value={newNote.content || ''}
                  onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                  placeholder="Ekri nòt ou a..."
                  rows={8}
                />
              </div>
              <div>
                <Label htmlFor="category">Kategori</Label>
                <Select
                  value={newNote.category || 'pèsonèl'}
                  onValueChange={(value) => setNewNote({...newNote, category: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.filter(cat => cat.value !== 'all').map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={addNote} className="w-full">
                Sovgade Nòt
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Chèche nan nòt yo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Chaje nòt yo...</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredNotes.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <BookOpen className="h-24 w-24 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Pa gen nòt</h3>
              <p className="text-muted-foreground">Kòmanse ekri nòt ou yo!</p>
            </div>
          ) : (
            filteredNotes.map((note) => (
              <Card key={note.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {note.title && (
                        <CardTitle className="text-lg mb-2">{note.title}</CardTitle>
                      )}
                      <Badge className={`${getCategoryColor(note.category)} text-white border-none`}>
                        {categories.find(cat => cat.value === note.category)?.label || note.category}
                      </Badge>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingNote(note)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteNote(note.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    {note.content.length > 200 
                      ? note.content.substring(0, 200) + '...' 
                      : note.content}
                  </div>
                  <div className="mt-3 text-xs text-muted-foreground">
                    {new Date(note.created_at).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingNote} onOpenChange={() => setEditingNote(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Modifye Nòt</DialogTitle>
          </DialogHeader>
          {editingNote && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-title">Tit (opsyonèl)</Label>
                <Input
                  id="edit-title"
                  value={editingNote.title || ''}
                  onChange={(e) => setEditingNote({...editingNote, title: e.target.value})}
                  placeholder="Tit nòt la..."
                />
              </div>
              <div>
                <Label htmlFor="edit-content">Kontni</Label>
                <Textarea
                  id="edit-content"
                  value={editingNote.content}
                  onChange={(e) => setEditingNote({...editingNote, content: e.target.value})}
                  placeholder="Ekri nòt ou a..."
                  rows={8}
                />
              </div>
              <div>
                <Label htmlFor="edit-category">Kategori</Label>
                <Select
                  value={editingNote.category}
                  onValueChange={(value) => setEditingNote({...editingNote, category: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.filter(cat => cat.value !== 'all').map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={updateNote} className="w-full">
                Sovgade Chanjman yo
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );

  return <ResponsiveLayout>{content}</ResponsiveLayout>;
}