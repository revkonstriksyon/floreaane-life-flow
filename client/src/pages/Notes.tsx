import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Tag,
  Link2,
  Calendar,
  Eye,
  Edit,
  Trash2,
  Star,
  Brain,
  Mic,
  Image,
  Paperclip,
  Hash,
  Lock,
  BookOpen,
  Lightbulb,
  Music,
  Briefcase,
  Heart
} from "lucide-react";

const mockNotes = [
  {
    id: 1,
    title: "Ide pou nouvo kontni rap 🎤",
    content: "M t ap panse a 'tout m te vle, se pa sa m resevwa' kòm hook. Pou couple la m ka jwe ak metafò sou lavil ak dezilizyon...",
    category: "kreativite",
    tags: ["lyrics", "ide", "freestyle"],
    linkedProjectId: "mixtape-2025",
    sourcePage: "projects",
    format: "text",
    isPrivate: false,
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T14:20:00Z"
  },
  {
    id: 2,
    title: "Nòt Sou Kont GMS 🚗",
    content: "Verifikasyon sou rent fèk fini, gen 3 machin ki poko peye jiska 15 jiyè. Bezwen suiv yo pi pre pou pa gen pwoblèm ak cashflow.",
    category: "travay",
    tags: ["GMS", "lokasyon", "swiv", "important"],
    linkedProjectId: null,
    sourcePage: "finances",
    format: "text",
    isPrivate: false,
    createdAt: "2024-01-14T09:15:00Z",
    updatedAt: "2024-01-14T16:45:00Z"
  },
  {
    id: 3,
    title: "Refeksyon Espirityèl - Pasyans",
    content: "Jodi a m aprann yon bagay: pasyans se yon fòs, se pa yon feblès. Lè w ap tann, ou ap prepare. Lè w ap prepare, ou ap devni pi fò.",
    category: "pèsonèl",
    tags: ["espirityèl", "refleksyon", "kwasans"],
    linkedProjectId: null,
    sourcePage: "dashboard",
    format: "text",
    isPrivate: true,
    createdAt: "2024-01-13T20:30:00Z",
    updatedAt: "2024-01-13T20:45:00Z"
  },
  {
    id: 4,
    title: "Plan Renovasyon Kay",
    content: "- Kòmanse ak chanm lan\n- Chanje kouran ak plonbri\n- Penti ak dekorasyon\n- Bidjè: $15,000 maksimòm",
    category: "travay",
    tags: ["konstriksyon", "plan", "bidjè"],
    linkedProjectId: "kay-renovasyon",
    sourcePage: "projects",
    format: "markdown",
    isPrivate: false,
    createdAt: "2024-01-12T11:00:00Z",
    updatedAt: "2024-01-15T08:30:00Z"
  }
];

const categories = {
  pèsonèl: { label: "Pèsonèl", icon: Heart, color: "bg-red-100 text-red-800" },
  travay: { label: "Travay", icon: Briefcase, color: "bg-blue-100 text-blue-800" },  
  kreativite: { label: "Kreativite", icon: Lightbulb, color: "bg-yellow-100 text-yellow-800" },
  mizik: { label: "Mizik", icon: Music, color: "bg-purple-100 text-purple-800" },
  ide: { label: "Ide Biznis", icon: Brain, color: "bg-green-100 text-green-800" },
  espirityèl: { label: "Espirityèl", icon: BookOpen, color: "bg-indigo-100 text-indigo-800" }
};

export default function Notes() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTag, setSelectedTag] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    category: "pèsonèl",
    tags: "",
    isPrivate: false
  });

  const filteredNotes = mockNotes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || note.category === selectedCategory;
    const matchesTag = !selectedTag || note.tags.includes(selectedTag);
    return matchesSearch && matchesCategory && matchesTag;
  });

  const allTags = Array.from(new Set(mockNotes.flatMap(note => note.tags)));

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const createNote = () => {
    // This would typically make an API call
    console.log("Creating note:", newNote);
    setIsCreating(false);
    setNewNote({
      title: "",
      content: "",
      category: "pèsonèl",
      tags: "",
      isPrivate: false
    });
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        currentPath="/notes"
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-border/50 bg-card/30 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Nòt & Memwa
              </h1>
              <p className="text-muted-foreground mt-1">
                Konsève ak òganize tout lide ou yo
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechèch nòt..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtre
              </Button>
              <Button size="sm" className="bg-gradient-primary" onClick={() => setIsCreating(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nouvo Nòt
              </Button>
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
                  <p className="text-2xl font-bold">{mockNotes.length}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Kategori</p>
                  <p className="text-2xl font-bold">{Object.keys(categories).length}</p>
                </div>
                <Tag className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tags</p>
                  <p className="text-2xl font-bold">{allTags.length}</p>
                </div>
                <Hash className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Prive</p>
                  <p className="text-2xl font-bold">
                    {mockNotes.filter(note => note.isPrivate).length}
                  </p>
                </div>
                <Lock className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Create Note Modal */}
        {isCreating && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-2xl mx-4">
              <CardHeader>
                <CardTitle>Nouvo Nòt</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Tit nòt la..."
                  value={newNote.title}
                  onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                />
                
                <Textarea
                  placeholder="Ekri nòt ou..."
                  value={newNote.content}
                  onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                  rows={6}
                />
                
                <div className="flex gap-4">
                  <select 
                    value={newNote.category}
                    onChange={(e) => setNewNote({...newNote, category: e.target.value})}
                    className="px-3 py-2 border rounded-md"
                  >
                    {Object.entries(categories).map(([key, cat]) => (
                      <option key={key} value={key}>{cat.label}</option>
                    ))}
                  </select>
                  
                  <Input
                    placeholder="Tags (separe ak virgul)"
                    value={newNote.tags}
                    onChange={(e) => setNewNote({...newNote, tags: e.target.value})}
                    className="flex-1"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newNote.isPrivate}
                    onChange={(e) => setNewNote({...newNote, isPrivate: e.target.checked})}
                  />
                  <label className="text-sm">Nòt prive</label>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreating(false)}>
                    Anile
                  </Button>
                  <Button onClick={createNote}>
                    Kreye Nòt
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <Tabs defaultValue="grid" className="w-full">
            <div className="flex items-center justify-between mb-6">
              <TabsList>
                <TabsTrigger value="grid">Grid</TabsTrigger>
                <TabsTrigger value="list">Lis</TabsTrigger>
                <TabsTrigger value="categories">Kategori</TabsTrigger>
              </TabsList>
              
              <div className="flex items-center gap-2">
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-1 border rounded text-sm"
                >
                  <option value="all">Tout Kategori</option>
                  {Object.entries(categories).map(([key, cat]) => (
                    <option key={key} value={key}>{cat.label}</option>
                  ))}
                </select>
                
                <select 
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className="px-3 py-1 border rounded text-sm"
                >
                  <option value="">Tout Tags</option>
                  {allTags.map(tag => (
                    <option key={tag} value={tag}>#{tag}</option>
                  ))}
                </select>
              </div>
            </div>

            <TabsContent value="grid">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNotes.map((note) => {
                  const category = categories[note.category as keyof typeof categories];
                  const IconComponent = category?.icon || FileText;
                  
                  return (
                    <Card key={note.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2 flex-1">
                            <IconComponent className="h-5 w-5 text-primary" />
                            <CardTitle className="text-lg line-clamp-1">{note.title}</CardTitle>
                            {note.isPrivate && <Lock className="h-4 w-4 text-red-500" />}
                          </div>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge className={category?.color || "bg-gray-100"}>
                            {category?.label || note.category}
                          </Badge>
                          {note.linkedProjectId && (
                            <Badge variant="outline" className="text-xs">
                              <Link2 className="h-3 w-3 mr-1" />
                              Lye
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      
                      <CardContent>
                        <div className="space-y-3">
                          <p className="text-sm text-muted-foreground line-clamp-3">
                            {note.content}
                          </p>
                          
                          <div className="flex flex-wrap gap-1">
                            {note.tags.slice(0, 3).map(tag => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                #{tag}
                              </Badge>
                            ))}
                            {note.tags.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{note.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(note.updatedAt)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {note.format === "markdown" && (
                                <Badge variant="outline" className="text-xs">MD</Badge>
                              )}
                              {note.sourcePage && (
                                <span className="text-xs">{note.sourcePage}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="list">
              <div className="space-y-3">
                {filteredNotes.map((note) => {
                  const category = categories[note.category as keyof typeof categories];
                  const IconComponent = category?.icon || FileText;
                  
                  return (
                    <Card key={note.id} className="hover:shadow-sm transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <IconComponent className="h-5 w-5 text-primary" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold truncate">{note.title}</h3>
                              {note.isPrivate && <Lock className="h-4 w-4 text-red-500 flex-shrink-0" />}
                              <Badge className={`${category?.color || "bg-gray-100"} flex-shrink-0`}>
                                {category?.label || note.category}
                              </Badge>
                            </div>
                            
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                              {note.content}
                            </p>
                            
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>{formatDate(note.updatedAt)}</span>
                              </div>
                              
                              <div className="flex gap-1">
                                {note.tags.slice(0, 2).map(tag => (
                                  <span key={tag} className="text-primary">#{tag}</span>
                                ))}
                                {note.tags.length > 2 && (
                                  <span>+{note.tags.length - 2}</span>
                                )}
                              </div>
                              
                              {note.linkedProjectId && (
                                <div className="flex items-center gap-1">
                                  <Link2 className="h-3 w-3" />
                                  <span>Lye ak pwojè</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <Button variant="ghost" size="sm">
                              <Brain className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
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

            <TabsContent value="categories">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(categories).map(([key, category]) => {
                  const categoryNotes = mockNotes.filter(note => note.category === key);
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
                                {categoryNotes.slice(0, 2).map(note => (
                                  <p key={note.id} className="text-xs truncate">
                                    • {note.title}
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
          </Tabs>
        </div>
      </div>
    </div>
  );
}