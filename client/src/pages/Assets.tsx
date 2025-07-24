import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Home, 
  Laptop, 
  Shirt, 
  Car, 
  Hammer, 
  Image, 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  DollarSign,
  Calendar,
  AlertTriangle,
  TrendingUp,
  Download,
  Upload,
  Bell,
  Shield,
  Eye,
  Edit,
  Trash2
} from "lucide-react";

const mockAssets = [
  {
    id: 1,
    name: "MacBook Pro 2023",
    category: "technology",
    currentValue: 2500,
    purchasePrice: 3000,
    purchaseDate: "2023-01-15",
    warrantyEndDate: "2024-01-15",
    location: "Biwo",
    description: "Laptop travay prensipal",
    imageUrl: null
  },
  {
    id: 2,
    name: "Kay Petion-Ville",
    category: "real_estate",
    currentValue: 85000,
    purchasePrice: 75000,
    purchaseDate: "2022-06-01",
    insuranceExpiryDate: "2024-06-01",
    location: "Petion-Ville",
    description: "Kay kote m rete",
    imageUrl: null
  },
  {
    id: 3,
    name: "Machin Honda Civic",
    category: "vehicles",
    currentValue: 18000,
    purchasePrice: 22000,
    purchaseDate: "2021-03-10",
    licenseExpiryDate: "2024-03-10",
    location: "Garaj",
    description: "Machin pèsonèl",
    imageUrl: null
  }
];

const categoryIcons = {
  real_estate: Home,
  technology: Laptop,
  clothing: Shirt,
  vehicles: Car,
  tools: Hammer,
  art: Image,
  documents: FileText
};

const categoryNames = {
  real_estate: "Byen Imobilye",
  technology: "Teknoloji",
  clothing: "Rad ak Aksèwa",
  vehicles: "Machin ak Transpò",
  tools: "Zouti Pwofesyonèl",
  art: "Atizay ak Koleksyon",
  documents: "Dosye ak Lisans"
};

export default function Assets() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredAssets = mockAssets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         asset.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || asset.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalValue = mockAssets.reduce((sum, asset) => sum + asset.currentValue, 0);
  const totalInvestment = mockAssets.reduce((sum, asset) => sum + asset.purchasePrice, 0);
  const valueChange = totalValue - totalInvestment;

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        currentPath="/assets"
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-border/50 bg-card/30 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Sa Mwen Posede
              </h1>
              <p className="text-muted-foreground mt-1">
                Jere ak swiv tout byen ou yo
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechèch byen..."
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
                <Plus className="h-4 w-4 mr-2" />
                Nouvo Byen
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
                  <p className="text-sm text-muted-foreground">Valè Total</p>
                  <p className="text-2xl font-bold">${totalValue.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Envestisman</p>
                  <p className="text-2xl font-bold">${totalInvestment.toLocaleString()}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Chanjman</p>
                  <p className={`text-2xl font-bold ${valueChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {valueChange >= 0 ? '+' : ''}${valueChange.toLocaleString()}
                  </p>
                </div>
                <TrendingUp className={`h-8 w-8 ${valueChange >= 0 ? 'text-green-500' : 'text-red-500'}`} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Byen</p>
                  <p className="text-2xl font-bold">{mockAssets.length}</p>
                </div>
                <Home className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

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
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Ekspòte
                </Button>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Enpòte
                </Button>
              </div>
            </div>

            <TabsContent value="grid">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAssets.map((asset) => {
                  const IconComponent = categoryIcons[asset.category as keyof typeof categoryIcons] || Home;
                  const valueChange = asset.currentValue - asset.purchasePrice;
                  
                  return (
                    <Card key={asset.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <IconComponent className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{asset.name}</CardTitle>
                              <Badge variant="outline" className="text-xs">
                                {categoryNames[asset.category as keyof typeof categoryNames]}
                              </Badge>
                            </div>
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
                      </CardHeader>
                      
                      <CardContent>
                        <div className="space-y-3">
                          <p className="text-sm text-muted-foreground">{asset.description}</p>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-muted-foreground">Valè Aktyèl</p>
                              <p className="font-semibold">${asset.currentValue.toLocaleString()}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground">Chanjman</p>
                              <p className={`font-semibold ${valueChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {valueChange >= 0 ? '+' : ''}${valueChange.toLocaleString()}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>Achte: {new Date(asset.purchaseDate).toLocaleDateString('fr-FR')}</span>
                          </div>
                          
                          {asset.warrantyEndDate && (
                            <div className="flex items-center gap-2 text-sm text-orange-500">
                              <AlertTriangle className="h-4 w-4" />
                              <span>Garanti fini: {new Date(asset.warrantyEndDate).toLocaleDateString('fr-FR')}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="list">
              <div className="space-y-4">
                {filteredAssets.map((asset) => {
                  const IconComponent = categoryIcons[asset.category as keyof typeof categoryIcons] || Home;
                  const valueChange = asset.currentValue - asset.purchasePrice;
                  
                  return (
                    <Card key={asset.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <IconComponent className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold">{asset.name}</h3>
                              <p className="text-sm text-muted-foreground">{asset.description}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-6">
                            <div className="text-center">
                              <p className="text-sm text-muted-foreground">Valè</p>
                              <p className="font-semibold">${asset.currentValue.toLocaleString()}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm text-muted-foreground">Chanjman</p>
                              <p className={`font-semibold ${valueChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {valueChange >= 0 ? '+' : ''}${valueChange.toLocaleString()}
                              </p>
                            </div>
                            <div className="flex items-center gap-1">
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
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="categories">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(categoryNames).map(([key, name]) => {
                  const IconComponent = categoryIcons[key as keyof typeof categoryIcons];
                  const categoryAssets = mockAssets.filter(asset => asset.category === key);
                  const categoryValue = categoryAssets.reduce((sum, asset) => sum + asset.currentValue, 0);
                  
                  return (
                    <Card key={key} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-6 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="p-4 bg-primary/10 rounded-full">
                            <IconComponent className="h-8 w-8 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{name}</h3>
                            <p className="text-sm text-muted-foreground">{categoryAssets.length} atik</p>
                            <p className="font-bold text-xl mt-2">${categoryValue.toLocaleString()}</p>
                          </div>
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