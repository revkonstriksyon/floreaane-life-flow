import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Heart,
  Briefcase,
  Phone,
  Mail,
  MessageCircle,
  Calendar,
  Clock,
  UserPlus,
  Star,
  AlertCircle,
  Eye,
  Edit
} from "lucide-react";

const mockContacts = [
  {
    id: 1,
    firstName: "Marie",
    lastName: "Joseph",
    nickname: "Mari",
    email: "marie.joseph@email.com",
    phoneNumber: "+509 3456-7890",
    relationshipType: "family",
    relationshipLevel: "close",
    profilePictureUrl: null,
    birthdate: "1990-03-15",
    lastContactedAt: "2024-01-10",
    nextContactDue: "2024-01-20",
    contactFrequencyDays: 14,
    notes: "Sè m nan. Li toujou renmen kafe ak pwason",
    tags: ["family", "important"],
    likes: "Mizik, kafe, pwason griye",
    dislikes: "Bri, moun ki reta"
  },
  {
    id: 2,
    firstName: "Jean",
    lastName: "Pierre",
    nickname: "JP",
    email: "jean.pierre@company.com",
    phoneNumber: "+509 2345-6789",
    relationshipType: "colleague",
    relationshipLevel: "professional",
    profilePictureUrl: null,
    birthdate: null,
    lastContactedAt: "2024-01-05",
    nextContactDue: "2024-01-25",
    contactFrequencyDays: 30,
    notes: "Kòlèg nan travay. Ekspè nan teknoloji",
    tags: ["work", "tech"],
    likes: "Teknoloji, pwogramasyon",
    dislikes: "Randevou long"
  },
  {
    id: 3,
    firstName: "Stephanie",
    lastName: "Laurent",
    nickname: "Steph",
    email: "stephanie.laurent@gmail.com",
    phoneNumber: "+509 4567-8901",
    relationshipType: "friend",
    relationshipLevel: "close",
    profilePictureUrl: null,
    birthdate: "1995-07-22",
    lastContactedAt: "2023-12-20",
    nextContactDue: "2024-01-05",
    contactFrequencyDays: 21,
    notes: "Zanmi depi lekòl. Li renmen danse ak mizik",
    tags: ["friend", "music", "overdue"],
    likes: "Danse, mizik, sinema",
    dislikes: "Tan frèt"
  }
];

const relationshipTypes = {
  family: { label: "Fanmi", icon: Heart, color: "bg-red-100 text-red-800" },
  friend: { label: "Zanmi", icon: Users, color: "bg-blue-100 text-blue-800" },
  colleague: { label: "Kòlèg", icon: Briefcase, color: "bg-green-100 text-green-800" },
  client: { label: "Kliyan", icon: Star, color: "bg-yellow-100 text-yellow-800" },
  other: { label: "Lòt", icon: Users, color: "bg-gray-100 text-gray-800" }
};

const relationshipLevels = {
  close: { label: "Pre", color: "bg-green-500" },
  distant: { label: "Elwanye", color: "bg-yellow-500" },
  professional: { label: "Pwofesyonèl", color: "bg-blue-500" },
  following: { label: "Swiv de lwen", color: "bg-gray-500" }
};

export default function Contacts() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  const filteredContacts = mockContacts.filter(contact => {
    const matchesSearch = `${contact.firstName} ${contact.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contact.nickname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contact.notes.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || contact.relationshipType === filterType;
    return matchesSearch && matchesType;
  });

  const getContactStatus = (contact: any) => {
    const today = new Date();
    const nextDue = new Date(contact.nextContactDue);
    const daysDiff = Math.ceil((nextDue.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff < 0) return { status: "overdue", label: "An reta", color: "text-red-500" };
    if (daysDiff <= 3) return { status: "due", label: "Prèske rive", color: "text-yellow-500" };
    return { status: "good", label: "Bon", color: "text-green-500" };
  };

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
              <Button size="sm" className="bg-gradient-primary">
                <UserPlus className="h-4 w-4 mr-2" />
                Nouvo Kontak
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
                  <p className="text-sm text-muted-foreground">Total Kontak</p>
                  <p className="text-2xl font-bold">{mockContacts.length}</p>
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
                    {mockContacts.filter(c => getContactStatus(c).status === "overdue").length}
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
                    {mockContacts.filter(c => getContactStatus(c).status === "due").length}
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
                    {mockContacts.filter(c => c.relationshipType === "family").length}
                  </p>
                </div>
                <Heart className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <Tabs defaultValue="list" className="w-full">
            <div className="flex items-center justify-between mb-6">
              <TabsList>
                <TabsTrigger value="list">Lis</TabsTrigger>
                <TabsTrigger value="cards">Kat</TabsTrigger>
                <TabsTrigger value="radar">Radar Relasyon</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="list">
              <div className="space-y-4">
                {filteredContacts.map((contact) => {
                  const relType = relationshipTypes[contact.relationshipType as keyof typeof relationshipTypes];
                  const relLevel = relationshipLevels[contact.relationshipLevel as keyof typeof relationshipLevels];
                  const status = getContactStatus(contact);
                  const IconComponent = relType.icon;
                  
                  return (
                    <Card key={contact.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={contact.profilePictureUrl || ""} />
                              <AvatarFallback className="bg-primary/10">
                                {contact.firstName[0]}{contact.lastName?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-lg">
                                  {contact.firstName} {contact.lastName}
                                </h3>
                                {contact.nickname && (
                                  <Badge variant="outline" className="text-xs">
                                    "{contact.nickname}"
                                  </Badge>
                                )}
                              </div>
                              
                              <div className="flex items-center gap-2 mb-2">
                                <Badge className={relType.color}>
                                  <IconComponent className="h-3 w-3 mr-1" />
                                  {relType.label}
                                </Badge>
                                <div className={`w-2 h-2 rounded-full ${relLevel.color}`} title={relLevel.label}></div>
                                <span className={`text-sm font-medium ${status.color}`}>
                                  {status.label}
                                </span>
                              </div>
                              
                              <p className="text-sm text-muted-foreground mb-2">{contact.notes}</p>
                              
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                {contact.phoneNumber && (
                                  <div className="flex items-center gap-1">
                                    <Phone className="h-3 w-3" />
                                    <span>{contact.phoneNumber}</span>
                                  </div>
                                )}
                                {contact.email && (
                                  <div className="flex items-center gap-1">
                                    <Mail className="h-3 w-3" />
                                    <span>{contact.email}</span>
                                  </div>
                                )}
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  <span>Dènye kontak: {new Date(contact.lastContactedAt).toLocaleDateString('fr-FR')}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              <MessageCircle className="h-4 w-4 mr-2" />
                              Mesaj
                            </Button>
                            <Button variant="outline" size="sm">
                              <Phone className="h-4 w-4 mr-2" />
                              Rele
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="cards">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredContacts.map((contact) => {
                  const relType = relationshipTypes[contact.relationshipType as keyof typeof relationshipTypes];
                  const relLevel = relationshipLevels[contact.relationshipLevel as keyof typeof relationshipLevels];
                  const status = getContactStatus(contact);
                  const IconComponent = relType.icon;
                  
                  return (
                    <Card key={contact.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="text-center pb-3">
                        <Avatar className="h-16 w-16 mx-auto mb-3">
                          <AvatarImage src={contact.profilePictureUrl || ""} />
                          <AvatarFallback className="bg-primary/10 text-lg">
                            {contact.firstName[0]}{contact.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        
                        <CardTitle className="text-lg">
                          {contact.firstName} {contact.lastName}
                        </CardTitle>
                        
                        {contact.nickname && (
                          <p className="text-sm text-muted-foreground">"{contact.nickname}"</p>
                        )}
                        
                        <div className="flex items-center justify-center gap-2 mt-2">
                          <Badge className={relType.color}>
                            <IconComponent className="h-3 w-3 mr-1" />
                            {relType.label}
                          </Badge>
                          <div className={`w-2 h-2 rounded-full ${relLevel.color}`} title={relLevel.label}></div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          <p className="text-sm text-center">{contact.notes}</p>
                          
                          <div className="text-center">
                            <p className={`text-sm font-medium ${status.color}`}>
                              {status.label}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Pwochen kontak: {new Date(contact.nextContactDue).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                          
                          {contact.likes && (
                            <div>
                              <p className="text-xs font-medium text-muted-foreground mb-1">Renmen:</p>
                              <p className="text-sm text-green-600">{contact.likes}</p>
                            </div>
                          )}
                          
                          <div className="flex gap-2 pt-2">
                            <Button variant="outline" size="sm" className="flex-1">
                              <MessageCircle className="h-3 w-3 mr-1" />
                              Mesaj
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1">
                              <Phone className="h-3 w-3 mr-1" />
                              Rele
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
                      {mockContacts
                        .filter(c => getContactStatus(c).status === "overdue")
                        .map(contact => (
                          <div key={contact.id} className="flex items-center gap-3 p-2 bg-red-50 rounded-lg">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-red-100">
                                {contact.firstName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{contact.firstName} {contact.lastName}</p>
                              <p className="text-xs text-red-600">
                                {Math.abs(Math.ceil((new Date(contact.nextContactDue).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))} jou an reta
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
                      <Heart className="h-5 w-5 text-red-500" />
                      Relasyon Pi Pre
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {mockContacts
                        .filter(c => c.relationshipLevel === "close")
                        .map(contact => (
                          <div key={contact.id} className="flex items-center gap-3 p-2 bg-green-50 rounded-lg">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-green-100">
                                {contact.firstName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{contact.firstName} {contact.lastName}</p>
                              <p className="text-xs text-green-600">
                                {relationshipTypes[contact.relationshipType as keyof typeof relationshipTypes]?.label}
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
                      {mockContacts
                        .filter(c => c.relationshipType === "colleague" || c.relationshipType === "client")
                        .map(contact => (
                          <div key={contact.id} className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-blue-100">
                                {contact.firstName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{contact.firstName} {contact.lastName}</p>
                              <p className="text-xs text-blue-600">
                                {relationshipTypes[contact.relationshipType as keyof typeof relationshipTypes]?.label}
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
    </div>
  );
}