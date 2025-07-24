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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, 
  Search, 
  Filter, 
  UserPlus, 
  Heart, 
  Briefcase, 
  Users2, 
  AlertCircle,
  Clock,
  Phone,
  Mail,
  Calendar as CalendarIcon,
  MapPin,
  Tag,
  Plus,
  Edit,
  Trash2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLocation } from "wouter";
import { AIInsights } from "@/components/ai/AIInsights";
import { AIChat } from "@/components/ai/AIChat";

interface Contact {
  id: string;
  first_name: string;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  relationship_type: 'family' | 'friend' | 'colleague' | 'client' | 'acquaintance' | null;
  notes: string | null;
  birthday: string | null;
  last_contacted: string | null;
  contact_frequency_days: number | null;
  tags: string[] | null;
  address: string | null;
  company: string | null;
  position: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

const relationshipTypes = {
  family: { label: "Fanmi", icon: Heart, color: "bg-red-500" },
  friend: { label: "Zanmi", icon: Users2, color: "bg-green-500" },
  colleague: { label: "Kòlèg", icon: Briefcase, color: "bg-blue-500" },
  client: { label: "Kliyan", icon: Users, color: "bg-purple-500" },
  acquaintance: { label: "Konesans", icon: Users, color: "bg-gray-500" }
};

export default function Contacts() {
  const [, setLocation] = useLocation();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newContact, setNewContact] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    relationship_type: "",
    notes: "",
    birthday: "",
    company: "",
    position: "",
    address: "",
    contact_frequency_days: 30
  });

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('first_name', { ascending: true });

      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addContact = async () => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .insert([newContact])
        .select();

      if (error) throw error;

      setContacts([...contacts, ...(data || [])]);
      setNewContact({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        relationship_type: "",
        notes: "",
        birthday: "",
        company: "",
        position: "",
        address: "",
        contact_frequency_days: 30
      });
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Error adding contact:', error);
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = `${contact.first_name} ${contact.last_name || ''}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contact.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contact.notes?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || contact.relationship_type === filterType;
    return matchesSearch && matchesType;
  });

  const getContactStatus = (contact: Contact) => {
    if (!contact.last_contacted || !contact.contact_frequency_days) {
      return { status: "unknown", label: "Pa konnen", color: "text-gray-500" };
    }

    const today = new Date();
    const lastContact = new Date(contact.last_contacted);
    const daysSince = Math.ceil((today.getTime() - lastContact.getTime()) / (1000 * 60 * 60 * 24));

    if (daysSince > contact.contact_frequency_days) {
      return { status: "overdue", label: "An reta", color: "text-red-500" };
    }
    if (daysSince > contact.contact_frequency_days * 0.8) {
      return { status: "due", label: "Prèske rive", color: "text-yellow-500" };
    }
    return { status: "good", label: "Bon", color: "text-green-500" };
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex-1 overflow-auto flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Chaje kontak yo...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        currentPath="/contacts"
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-border/50 bg-card/30 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Relasyon & Koneksyon
              </h1>
              <p className="text-muted-foreground mt-1">
                Jere ak nourri relasyon ou yo
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechèch moun..."
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
                    <UserPlus className="h-4 w-4 mr-2" />
                    Nouvo Kontak
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Ajoute nouvo kontak</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="first_name">Prenmi non</Label>
                        <Input
                          id="first_name"
                          value={newContact.first_name}
                          onChange={(e) => setNewContact({...newContact, first_name: e.target.value})}
                          placeholder="Jean"
                        />
                      </div>
                      <div>
                        <Label htmlFor="last_name">Dezyèm non</Label>
                        <Input
                          id="last_name"
                          value={newContact.last_name}
                          onChange={(e) => setNewContact({...newContact, last_name: e.target.value})}
                          placeholder="Baptiste"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newContact.email}
                        onChange={(e) => setNewContact({...newContact, email: e.target.value})}
                        placeholder="jean@example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Telefòn</Label>
                      <Input
                        id="phone"
                        value={newContact.phone}
                        onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                        placeholder="+509 1234-5678"
                      />
                    </div>
                    <div>
                      <Label htmlFor="relationship_type">Kalite relasyon</Label>
                      <Select value={newContact.relationship_type} onValueChange={(value) => setNewContact({...newContact, relationship_type: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Chwazi kalite relasyon" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="family">Fanmi</SelectItem>
                          <SelectItem value="friend">Zanmi</SelectItem>
                          <SelectItem value="colleague">Kòlèg</SelectItem>
                          <SelectItem value="client">Kliyan</SelectItem>
                          <SelectItem value="acquaintance">Konesans</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="notes">Nòt</Label>
                      <Textarea
                        id="notes"
                        value={newContact.notes}
                        onChange={(e) => setNewContact({...newContact, notes: e.target.value})}
                        placeholder="Enfòmasyon sou moun nan..."
                      />
                    </div>
                    <Button onClick={addContact} className="w-full">
                      Ajoute kontak la
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
                  <p className="text-sm text-muted-foreground">Total Kontak</p>
                  <p className="text-2xl font-bold">{contacts.length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">An Reta</p>
                  <p className="text-2xl font-bold text-red-500">
                    {contacts.filter(c => getContactStatus(c).status === "overdue").length}
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Prèske Rive</p>
                  <p className="text-2xl font-bold text-yellow-500">
                    {contacts.filter(c => getContactStatus(c).status === "due").length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Fanmi</p>
                  <p className="text-2xl font-bold">
                    {contacts.filter(c => c.relationship_type === "family").length}
                  </p>
                </div>
                <Heart className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Insights */}
        <div className="p-6 pb-0">
          <AIInsights 
            data={contacts} 
            type="contacts" 
            title="Konsey AI pou Relasyon yo"
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <Tabs defaultValue="cards" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="cards">Kàt</TabsTrigger>
              <TabsTrigger value="list">Lis</TabsTrigger>
              <TabsTrigger value="radar">Radar</TabsTrigger>
            </TabsList>

            <TabsContent value="cards">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredContacts.map((contact) => {
                  const relType = relationshipTypes[contact.relationship_type as keyof typeof relationshipTypes];
                  const status = getContactStatus(contact);
                  const IconComponent = relType?.icon || Users;

                  return (
                    <Card key={contact.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="text-center pb-3">
                        <Avatar className="h-16 w-16 mx-auto mb-3">
                          <AvatarFallback className="bg-primary/10 text-lg">
                            {contact.first_name[0]}{contact.last_name?.[0] || ''}
                          </AvatarFallback>
                        </Avatar>

                        <CardTitle className="text-lg">
                          {contact.first_name} {contact.last_name || ''}
                        </CardTitle>

                        <div className="flex items-center justify-center gap-2">
                          <Badge variant="outline" className={`${relType?.color || 'bg-gray-500'} text-white border-none`}>
                            <IconComponent className="h-3 w-3 mr-1" />
                            {relType?.label || 'Konesans'}
                          </Badge>
                          <Badge variant="outline" className={status.color}>
                            {status.label}
                          </Badge>
                        </div>
                      </CardHeader>

                      <CardContent>
                        <div className="space-y-2 text-sm">
                          {contact.email && (
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <span>{contact.email}</span>
                            </div>
                          )}

                          {contact.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span>{contact.phone}</span>
                            </div>
                          )}

                          {contact.company && (
                            <div className="flex items-center gap-2">
                              <Briefcase className="h-4 w-4 text-muted-foreground" />
                              <span>{contact.company}</span>
                            </div>
                          )}

                          {contact.birthday && (
                            <div className="flex items-center gap-2">
                              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                              <span>{new Date(contact.birthday).toLocaleDateString()}</span>
                            </div>
                          )}

                          {contact.notes && (
                            <p className="text-muted-foreground text-xs mt-3 line-clamp-2">
                              {contact.notes}
                            </p>
                          )}
                        </div>

                        <div className="flex gap-2 mt-4">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Edit className="h-4 w-4 mr-1" />
                            Modifye
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="list">
              <div className="space-y-4">
                {filteredContacts.map((contact) => {
                  const relType = relationshipTypes[contact.relationship_type as keyof typeof relationshipTypes];
                  const status = getContactStatus(contact);
                  const IconComponent = relType?.icon || Users;

                  return (
                    <Card key={contact.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12">
                              <AvatarFallback className="bg-primary/10">
                                {contact.first_name[0]}{contact.last_name?.[0] || ''}
                              </AvatarFallback>
                            </Avatar>

                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-lg">
                                  {contact.first_name} {contact.last_name || ''}
                                </h3>
                                <Badge variant="outline" className={`${relType?.color || 'bg-gray-500'} text-white border-none text-xs`}>
                                  <IconComponent className="h-3 w-3 mr-1" />
                                  {relType?.label || 'Konesans'}
                                </Badge>
                              </div>

                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                {contact.email && (
                                  <span className="flex items-center gap-1">
                                    <Mail className="h-3 w-3" />
                                    {contact.email}
                                  </span>
                                )}
                                {contact.phone && (
                                  <span className="flex items-center gap-1">
                                    <Phone className="h-3 w-3" />
                                    {contact.phone}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={status.color}>
                              {status.label}
                            </Badge>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setLocation(`/contacts/${contact.id}`)}
                            >
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

            <TabsContent value="radar">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                      Bezwen Atansyon
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {contacts
                        .filter(c => getContactStatus(c).status === "overdue")
                        .map(contact => (
                          <div key={contact.id} className="flex items-center gap-3 p-2 bg-red-50 rounded-lg">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-red-100">
                                {contact.first_name[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{contact.first_name} {contact.last_name}</p>
                              <p className="text-xs text-red-600">
                                Bezwen kontak depi kèk tan
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-blue-500" />
                      Koneksyon Pwofesyonèl
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {contacts
                        .filter(c => c.relationship_type === "colleague" || c.relationship_type === "client")
                        .map(contact => (
                          <div key={contact.id} className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-blue-100">
                                {contact.first_name[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{contact.first_name} {contact.last_name}</p>
                              <p className="text-xs text-blue-600">
                                {relationshipTypes[contact.relationship_type as keyof typeof relationshipTypes]?.label}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CalendarIcon className="h-5 w-5 text-green-500" />
                      Anivèsè yo
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {contacts
                        .filter(c => c.birthday)
                        .sort((a, b) => {
                          const aMonth = new Date(a.birthday!).getMonth();
                          const bMonth = new Date(b.birthday!).getMonth();
                          return aMonth - bMonth;
                        })
                        .slice(0, 5)
                        .map(contact => (
                          <div key={contact.id} className="flex items-center gap-3 p-2 bg-green-50 rounded-lg">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-green-100">
                                {contact.first_name[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{contact.first_name} {contact.last_name}</p>
                              <p className="text-xs text-green-600">
                                {new Date(contact.birthday!).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* AI Chat */}
      <AIChat 
        context={`Mwen gen ${contacts.length} kontak total, ${contacts.filter(c => getContactStatus(c).status === "overdue").length} bezwen atansyon.`}
        suggestions={[
          "Ki moun mwen bezwen kontakte?",
          "Ki jan pou kenbe bon relasyon?",
          "Bay konsey pou devlope rezo mwen",
          "Ki moun ki bezwen pi plis atansyon?"
        ]}
      />
    </div>
  );
}