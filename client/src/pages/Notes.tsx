
import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BookOpen, 
  Search, 
  Filter, 
  Plus,
  Star,
  StarOff,
  Edit,
  Trash2,
  Tag,
  Calendar,
  FileText,
  Lightbulb,
  Heart,
  Briefcase,
  Target,
  Book,
  Zap,
  Camera,
  Music,
  Bookmark
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Note {
  id: string;
  title: string;
  content: string;
  category: string | null;
  tags: string[] | null;
  is_favorite: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
}

const categories = {
  general: { label: "Jeneral", icon: FileText },
  ideas: { label: "Ide", icon: Lightbulb },
  personal: { label: "Pèsonèl", icon: Heart },
  work: { label: "Travay", icon: Briefcase },
  goals: { label: "Objektif", icon: Target },
  learning: { label: "Aprann", icon: Book },
  inspiration: { label: "Enspiyasyon", icon: Zap },
  memories: { label: "Memwa", icon: Camera },
  quotes: { label: "Sitasyon", icon: Bookmark },
  music: { label: "Mizik", icon: Music }
};

export default function Notes() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    category: "",
    tags: "",
    is_favorite: false
  });

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addNote = async () => {
    try {
      const noteData = {
        ...newNote,
        tags: newNote.tags ? newNote.tags.split(',').map(tag => tag.trim()) : []
      };

      const { data, error } = await supabase
        .from('notes')
        .insert([noteData])
        .select();

      if (error) throw error;

      setNotes([...notes, ...(data || [])]);
      setNewNote({
        title: "",
        content: "",
        category: "",
        tags: "",
        is_favorite: false
      });
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const toggleFavorite = async (noteId: string, currentFavorite: boolean) => {
    try {
      const { error } = await supabase
        .from('notes')
        .update({ is_favorite: !currentFavorite })
        .eq('id', noteId);

      if (error) throw error;

      setNotes(notes.map(note => 
        note.id === noteId ? { ...note, is_favorite: !currentFavorite } : note
      ));
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || note.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const favoriteNotes = notes.filter(note => note.is_favorite);
  const recentNotes = notes.slice(0, 5);

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex-1 overflow-auto flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Chaje nòt yo...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-border/50 bg-card/30 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Nòt & Ide
              </h1>
              <p className="text-muted-foreground mt-1">
                Kenbe ak òganize panse ou yo
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Chèche nòt..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtre
              </Button>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-gradient-primary">
                    <Plus className="h-4 w-4 mr-2" />
                    Nouvo Nòt
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Ajoute nouvo nòt</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Tit nòt la</Label>
                      <Input
                        id="title"
                        value={newNote.title}
                        onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                        placeholder="Egzanp: Ide pwojè nouvo"
                      />
                    </div>
                    <div>
                      <Label htmlFor="content">Kontni</Label>
                      <Textarea
                        id="content"
                        value={newNote.content}
                        onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                        placeholder="Ekri nòt ou a isit la..."
                        rows={5}
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Kategori</Label>
                      <Select value={newNote.category} onValueChange={(value) => setNewNote({...newNote, category: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Chwazi kategori" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">Jeneral</SelectItem>
                          <SelectItem value="ideas">Ide</SelectItem>
                          <SelectItem value="personal">Pèsonèl</SelectItem>
                          <SelectItem value="work">Travay</SelectItem>
                          <SelectItem value="goals">Objektif</SelectItem>
                          <SelectItem value="learning">Aprann</SelectItem>
                          <SelectItem value="inspiration">Enspiyasyon</SelectItem>
                          <SelectItem value="memories">Memwa</SelectItem>
                          <SelectItem value="quotes">Sitasyon</SelectItem>
                          <SelectItem value="music">Mizik</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="tags">Tag yo (separe ak vigil)</Label>
                      <Input
                        id="tags"
                        value={newNote.tags}
                        onChange={(e) => setNewNote({...newNote, tags: e.target.value})}
                        placeholder="enpotan, travay, ide"
                      />
                    </div>
                    <Button onClick={addNote} className="w-full">
                      Ajoute nòt la
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Nòt</p>
                  <p className="text-2xl font-bold">{notes.length}</p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Favori</p>
                  <p className="text-2xl font-bold">{favoriteNotes.length}</p>
                </div>
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Kategori</p>
                  <p className="text-2xl font-bold">
                    {new Set(notes.map(n => n.category).filter(Boolean)).size}
                  </p>
                </div>
                <Tag className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Semèn nan</p>
                  <p className="text-2xl font-bold">
                    {notes.filter(note => {
                      const weekAgo = new Date();
                      weekAgo.setDate(weekAgo.getDate() - 7);
                      return new Date(note.created_at) > weekAgo;
                    }).length}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <Tabs defaultValue="grid" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="grid">Grid</TabsTrigger>
              <TabsTrigger value="list">Lis</TabsTrigger>
              <TabsTrigger value="categories">Kategori</TabsTrigger>
              <TabsTrigger value="favorites">Favori</TabsTrigger>
            </TabsList>

            <TabsContent value="grid">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNotes.map((note) => {
                  const category = categories[note.category as keyof typeof categories];
                  const IconComponent = category?.icon || FileText;
                  
                  return (
                    <Card key={note.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <IconComponent className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <CardTitle className="text-lg line-clamp-1">{note.title}</CardTitle>
                              {note.category && (
                                <p className="text-sm text-muted-foreground">
                                  {category?.label || note.category}
                                </p>
                              )}
                            </div>
                          </div>
                          <button 
                            onClick={() => toggleFavorite(note.id, note.is_favorite)}
                            className="text-muted-foreground hover:text-yellow-500"
                          >
                            {note.is_favorite ? 
                              <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" /> : 
                              <StarOff className="h-5 w-5" />
                            }
                          </button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                          {note.content}
                        </p>
                        
                        {note.tags && note.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-4">
                            {note.tags.slice(0, 3).map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {note.tags.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{note.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{new Date(note.updated_at).toLocaleDateString()}</span>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="list">
              <div className="space-y-4">
                {filteredNotes.map((note) => {
                  const category = categories[note.category as keyof typeof categories];
                  const IconComponent = category?.icon || FileText;
                  
                  return (
                    <Card key={note.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4 flex-1">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <IconComponent className="h-5 w-5 text-primary" />
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-lg">{note.title}</h3>
                                {note.category && (
                                  <Badge variant="outline" className="text-xs">
                                    {category?.label || note.category}
                                  </Badge>
                                )}
                              </div>
                              
                              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                {note.content}
                              </p>
                              
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span>{new Date(note.updated_at).toLocaleDateString()}</span>
                                {note.tags && note.tags.length > 0 && (
                                  <div className="flex gap-1">
                                    {note.tags.slice(0, 2).map((tag, index) => (
                                      <Badge key={index} variant="secondary" className="text-xs">
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => toggleFavorite(note.id, note.is_favorite)}
                              className="text-muted-foreground hover:text-yellow-500"
                            >
                              {note.is_favorite ? 
                                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" /> : 
                                <StarOff className="h-4 w-4" />
                              }
                            </button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4 mr-1" />
                              Modifye
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="categories">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(categories).map(([key, category]) => {
                  const categoryNotes = notes.filter(note => note.category === key);
                  const IconComponent = category.icon;
                  
                  return (
                    <Card key={key} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-6 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="p-4 bg-primary/10 rounded-full">
                            <IconComponent className="h-8 w-8 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{category.label}</h3>
                            <p className="text-sm text-muted-foreground">
                              {categoryNotes.length} nòt
                            </p>
                          </div>
                          
                          {categoryNotes.length > 0 && (
                            <div className="w-full text-left">
                              <p className="text-xs text-muted-foreground mb-2">Dènye nòt:</p>
                              <div className="space-y-1">
                                {categoryNotes.slice(0, 3).map(note => (
                                  <p key={note.id} className="text-sm line-clamp-1">
                                    {note.title}
                                  </p>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="favorites">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteNotes.map((note) => {
                  const category = categories[note.category as keyof typeof categories];
                  const IconComponent = category?.icon || FileText;
                  
                  return (
                    <Card key={note.id} className="hover:shadow-md transition-shadow border-yellow-200">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                              <IconComponent className="h-5 w-5 text-yellow-600" />
                            </div>
                            <div>
                              <CardTitle className="text-lg line-clamp-1">{note.title}</CardTitle>
                              {note.category && (
                                <p className="text-sm text-muted-foreground">
                                  {category?.label || note.category}
                                </p>
                              )}
                            </div>
                          </div>
                          <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                          {note.content}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{new Date(note.updated_at).toLocaleDateString()}</span>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              
              {favoriteNotes.length === 0 && (
                <div className="text-center py-12">
                  <Star className="h-24 w-24 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Pa gen nòt favori</h3>
                  <p className="text-muted-foreground">Klike sou zetwal la pou ajoute nòt nan favori yo.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
