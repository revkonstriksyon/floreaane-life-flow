
import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowLeft, 
  Edit, 
  Save, 
  Phone, 
  Mail, 
  MapPin,
  Calendar,
  Plus,
  MessageCircle,
  AlertTriangle,
  User
} from "lucide-react";
// TODO: Migrate to new API hooks

interface Contact {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  relationship: string | null;
  category: string | null;
  notes: string | null;
  birthday: string | null;
  created_at: string;
}

interface ContactNote {
  id: string;
  content: string;
  created_at: string;
  contact_id: string;
}

export default function ContactDetail() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const [contact, setContact] = useState<Contact | null>(null);
  const [contactNotes, setContactNotes] = useState<ContactNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContact, setEditedContact] = useState<Partial<Contact>>({});
  const [newNote, setNewNote] = useState('');
  const [isAddNoteDialogOpen, setIsAddNoteDialogOpen] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchContactData();
    }
  }, [params.id]);

  const fetchContactData = async () => {
    try {
      const [contactResult, notesResult] = await Promise.all([
        supabase.from('contacts').select('*').eq('id', params.id).single(),
        supabase.from('notes').select('*').eq('contact_id', params.id).order('created_at', { ascending: false })
      ]);

      if (contactResult.error) throw contactResult.error;
      
      setContact(contactResult.data);
      setContactNotes(notesResult.data || []);
      setEditedContact(contactResult.data);
    } catch (error) {
      console.error('Error fetching contact data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveContact = async () => {
    try {
      const { error } = await supabase
        .from('contacts')
        .update(editedContact)
        .eq('id', params.id);

      if (error) throw error;

      setContact({ ...contact!, ...editedContact });
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving contact:', error);
    }
  };

  const addNote = async () => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .insert([{
          title: 'Note pou ' + contact?.name,
          content: newNote,
          category: 'contact',
          contact_id: params.id
        }])
        .select();

      if (error) throw error;

      setContactNotes([...(data || []), ...contactNotes]);
      setNewNote('');
      setIsAddNoteDialogOpen(false);
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex-1 overflow-auto flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Chaje detay kontak...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex-1 overflow-auto flex items-center justify-center">
          <div className="text-center">
            <AlertTriangle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Kontak pa jwenn</h2>
            <p className="text-muted-foreground mb-4">Kontak sa a pa egziste.</p>
            <Button onClick={() => setLocation("/contacts")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retounen nan kontak yo
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setLocation("/contacts")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retounen
              </Button>
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src="" />
                  <AvatarFallback>
                    {contact.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-3xl font-bold">{contact.name}</h1>
                  {contact.relationship && (
                    <Badge variant="secondary">{contact.relationship}</Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button onClick={saveContact}>
                    <Save className="h-4 w-4 mr-2" />
                    Sovgade
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Anile
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Modifye
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Contact Info */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Enfòmasyon Kontak</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Non</Label>
                        <Input
                          id="name"
                          value={editedContact.name || ''}
                          onChange={(e) => setEditedContact({...editedContact, name: e.target.value})}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="email">Imel</Label>
                          <Input
                            id="email"
                            type="email"
                            value={editedContact.email || ''}
                            onChange={(e) => setEditedContact({...editedContact, email: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Telefòn</Label>
                          <Input
                            id="phone"
                            value={editedContact.phone || ''}
                            onChange={(e) => setEditedContact({...editedContact, phone: e.target.value})}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="address">Adrès</Label>
                        <Input
                          id="address"
                          value={editedContact.address || ''}
                          onChange={(e) => setEditedContact({...editedContact, address: e.target.value})}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="relationship">Relasyon</Label>
                          <Select
                            value={editedContact.relationship || ''}
                            onValueChange={(value) => setEditedContact({...editedContact, relationship: value})}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="family">Fanmi</SelectItem>
                              <SelectItem value="friend">Zanmi</SelectItem>
                              <SelectItem value="colleague">Kòlèg</SelectItem>
                              <SelectItem value="client">Klyan</SelectItem>
                              <SelectItem value="other">Lòt</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="birthday">Dat fèt</Label>
                          <Input
                            id="birthday"
                            type="date"
                            value={editedContact.birthday || ''}
                            onChange={(e) => setEditedContact({...editedContact, birthday: e.target.value})}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="notes">Nòt</Label>
                        <Textarea
                          id="notes"
                          value={editedContact.notes || ''}
                          onChange={(e) => setEditedContact({...editedContact, notes: e.target.value})}
                          rows={3}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {contact.email && (
                          <div className="flex items-center gap-3 p-3 border rounded-lg">
                            <Mail className="h-5 w-5 text-blue-500" />
                            <div>
                              <p className="text-sm text-muted-foreground">Imel</p>
                              <p className="font-medium">{contact.email}</p>
                            </div>
                          </div>
                        )}
                        {contact.phone && (
                          <div className="flex items-center gap-3 p-3 border rounded-lg">
                            <Phone className="h-5 w-5 text-green-500" />
                            <div>
                              <p className="text-sm text-muted-foreground">Telefòn</p>
                              <p className="font-medium">{contact.phone}</p>
                            </div>
                          </div>
                        )}
                      </div>
                      {contact.address && (
                        <div className="flex items-center gap-3 p-3 border rounded-lg">
                          <MapPin className="h-5 w-5 text-red-500" />
                          <div>
                            <p className="text-sm text-muted-foreground">Adrès</p>
                            <p className="font-medium">{contact.address}</p>
                          </div>
                        </div>
                      )}
                      {contact.birthday && (
                        <div className="flex items-center gap-3 p-3 border rounded-lg">
                          <Calendar className="h-5 w-5 text-purple-500" />
                          <div>
                            <p className="text-sm text-muted-foreground">Dat fèt</p>
                            <p className="font-medium">{new Date(contact.birthday).toLocaleDateString()}</p>
                          </div>
                        </div>
                      )}
                      {contact.notes && (
                        <div>
                          <h3 className="font-semibold text-sm text-muted-foreground mb-2">Nòt</h3>
                          <p className="p-3 bg-muted rounded-lg">{contact.notes}</p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Notes */}
              <Card className="mt-6">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Nòt yo ({contactNotes.length})</CardTitle>
                    <Dialog open={isAddNoteDialogOpen} onOpenChange={setIsAddNoteDialogOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <Plus className="h-4 w-4 mr-2" />
                          Ajoute Nòt
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Nouvo Nòt</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="note-content">Kontni</Label>
                            <Textarea
                              id="note-content"
                              value={newNote}
                              onChange={(e) => setNewNote(e.target.value)}
                              rows={4}
                              placeholder="Ekri nòt ou a..."
                            />
                          </div>
                          <Button onClick={addNote} className="w-full">
                            Ajoute Nòt
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {contactNotes.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        Pa gen nòt pou kontak sa a
                      </p>
                    ) : (
                      contactNotes.map((note) => (
                        <div key={note.id} className="p-3 border rounded-lg">
                          <p className="text-sm">{note.content}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {new Date(note.created_at).toLocaleString()}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Aksyon Rapid</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {contact.phone && (
                    <Button variant="outline" className="w-full justify-start">
                      <Phone className="h-4 w-4 mr-2" />
                      Rele
                    </Button>
                  )}
                  {contact.email && (
                    <Button variant="outline" className="w-full justify-start">
                      <Mail className="h-4 w-4 mr-2" />
                      Voye Imel
                    </Button>
                  )}
                  <Button variant="outline" className="w-full justify-start">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Voye Mesaj
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Estatistik</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Nòt yo</span>
                      <span className="font-semibold">{contactNotes.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Depi</span>
                      <span className="font-semibold">
                        {new Date(contact.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
