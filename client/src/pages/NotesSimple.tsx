import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Plus, Search, Edit, Trash2, FileText, MoreHorizontal, Calendar, Tag, Folder, Grid3X3, List } from "lucide-react";
import { ResponsiveLayout } from "@/components/layout/ResponsiveLayout";
import { cn } from "@/lib/utils";
import type { Note } from "@/types";

const MOCK_NOTES: Note[] = [
  {
    id: '1',
    title: 'Database Systems Week 4',
    content: 'Normalization is the process of ordering basic data structures to ensure that the basic data created is of good quality. Used to minimize data redundancy and data inconsistencies.',
    category: 'travay',
    user_id: 'user1',
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Exploration Ideas',
    content: 'Ticket App\nTravel Website\nDigital Marketing Website...',
    category: 'pèsonèl',
    user_id: 'user1',
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Grocery List',
    content: 'Cereal\nShampoo\nToothpaste\nApple\nCup Noodles...',
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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
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
      'pèsonèl': 'from-blue-400 to-blue-600',
      'travay': 'from-green-400 to-green-600',
      'edikasyon': 'from-purple-400 to-purple-600',
      'pwojè': 'from-orange-400 to-orange-600',
      'lòt': 'from-gray-400 to-gray-600'
    };
    return colors[category] || 'from-gray-400 to-gray-600';
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      'pèsonèl': '🏠',
      'travay': '💼',
      'edikasyon': '📚',
      'pwojè': '📋',
      'lòt': '📝'
    };
    return icons[category] || '📝';
  };

  const content = (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold">
                  FL
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Floyd Lawton</h1>
                <p className="text-gray-600">Tout Nòt yo</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Search className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Tabs */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="text-gray-900 font-semibold border-b-2 border-gray-900 rounded-none">
              Tout Nòt yo
            </Button>
            <Button variant="ghost" className="text-gray-500">
              Dosye yo
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="border-gray-200"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="border-gray-200"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-gray-200/50">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Chèche nan nòt yo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-200 bg-white/80 focus:border-purple-500"
              />
            </div>
            <div className="flex items-center gap-3">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48 border-gray-200 bg-white/80">
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
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
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
                        className="border-gray-200 focus:border-purple-500"
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
                        className="border-gray-200 focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Kategori</Label>
                      <Select
                        value={newNote.category || 'pèsonèl'}
                        onValueChange={(value) => setNewNote({...newNote, category: value})}
                      >
                        <SelectTrigger className="border-gray-200">
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
                    <Button onClick={addNote} className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
                      Sovgade Nòt
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Notes List */}
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chaje nòt yo...</p>
          </div>
        ) : (
          <div className={cn(
            "grid gap-4",
            viewMode === 'grid' ? "md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 max-w-4xl"
          )}>
            {filteredNotes.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <BookOpen className="h-24 w-24 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Pa gen nòt</h3>
                <p className="text-gray-600">Kòmanse ekri nòt ou yo!</p>
              </div>
            ) : (
              filteredNotes.map((note) => (
                <Card key={note.id} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:bg-white/90">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">{getCategoryIcon(note.category)}</span>
                          <Badge className={`bg-gradient-to-r ${getCategoryColor(note.category)} text-white border-none text-xs`}>
                            {categories.find(cat => cat.value === note.category)?.label || note.category}
                          </Badge>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(note.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        {note.title && (
                          <CardTitle className="text-lg mb-2 group-hover:text-purple-600 transition-colors">
                            {note.title}
                          </CardTitle>
                        )}
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
                    <div className="text-sm text-gray-700 leading-relaxed">
                      {note.content.length > 150 
                        ? note.content.substring(0, 150) + '...' 
                        : note.content}
                    </div>
                    <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                      <Tag className="h-3 w-3" />
                      <span>{note.category}</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Floating Action Button for Mobile */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg md:hidden"
              size="sm"
            >
              <Plus className="h-6 w-6" />
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>

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
                  className="border-gray-200 focus:border-purple-500"
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
                  className="border-gray-200 focus:border-purple-500"
                />
              </div>
              <div>
                <Label htmlFor="edit-category">Kategori</Label>
                <Select
                  value={editingNote.category}
                  onValueChange={(value) => setEditingNote({...editingNote, category: value})}
                >
                  <SelectTrigger className="border-gray-200">
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
              <Button onClick={updateNote} className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
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