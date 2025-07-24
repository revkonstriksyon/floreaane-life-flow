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
  Home, 
  Laptop, 
  Car, 
  Wrench,
  Image as ImageIcon,
  FileText,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  AlertTriangle,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Smartphone,
  Camera,
  Shirt,
  Watch,
  Building,
  Key,
  Shield,
  MapPin
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Asset {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  category: string | null;
  purchase_price: number | null;
  current_value: number | null;
  purchase_date: string | null;
  location: string | null;
  serial_number: string | null;
  warranty_end_date: string | null;
  insurance_expiry_date: string | null;
  license_expiry_date: string | null;
  image_url: string | null;
  notes: string | null;
  created_at: string | null;
  updated_at: string | null;
}

const categoryNames: Record<string, string> = {
  real_estate: "Kay ak Tè",
  technology: "Teknoloji", 
  clothing: "Rad",
  vehicles: "Machin",
  tools: "Zouti",
  art: "Atis",
  documents: "Dokiman"
};

const categoryIcons: Record<string, any> = {
  real_estate: Home,
  technology: Laptop,
  clothing: Shirt,
  vehicles: Car,
  tools: Wrench,
  art: ImageIcon,
  documents: FileText
};

export default function Assets() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newAsset, setNewAsset] = useState({
    name: "",
    category: "",
    purchase_price: 0,
    current_value: 0,
    purchase_date: "",
    location: "",
    description: "",
    warranty_end_date: "",
    insurance_expiry_date: "",
    serial_number: "",
    notes: ""
  });

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const { data, error } = await supabase
        .from('assets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAssets(data || []);
    } catch (error) {
      console.error('Error fetching assets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addAsset = async () => {
    try {
      const { data, error } = await supabase
        .from('assets')
        .insert([{
          ...newAsset,
          user_id: 'user-placeholder' // This would come from auth in a real app
        }])
        .select();

      if (error) throw error;

      setAssets([...(data || []), ...assets]);
      setNewAsset({
        name: "",
        category: "",
        purchase_price: 0,
        current_value: 0,
        purchase_date: "",
        location: "",
        description: "",
        warranty_end_date: "",
        insurance_expiry_date: "",
        serial_number: "",
        notes: ""
      });
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Error adding asset:', error);
    }
  };

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         asset.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || asset.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalValue = assets.reduce((sum, asset) => sum + (asset.current_value || asset.purchase_price || 0), 0);
  const totalAssets = assets.length;
  const categoriesCount = new Set(assets.map(a => a.category).filter(Boolean)).size;

  const expiringWarranties = assets.filter(asset => {
    if (!asset.warranty_end_date) return false;
    const expiryDate = new Date(asset.warranty_end_date);
    const now = new Date();
    const monthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    return expiryDate <= monthFromNow;
  });

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Byen ak Asset yo</h1>
              <p className="text-muted-foreground">Jesyon ak suivi tou sa ou gen yo</p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajoute Bien
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Ajoute yon nouvo bien</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Non byen an</Label>
                    <Input
                      id="name"
                      value={newAsset.name}
                      onChange={(e) => setNewAsset({...newAsset, name: e.target.value})}
                      placeholder="Egzanp: MacBook Pro"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Kategori</Label>
                    <Select value={newAsset.category} onValueChange={(value) => setNewAsset({...newAsset, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chwazi kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="real_estate">Kay ak Tè</SelectItem>
                        <SelectItem value="technology">Teknoloji</SelectItem>
                        <SelectItem value="vehicles">Machin</SelectItem>
                        <SelectItem value="tools">Zouti</SelectItem>
                        <SelectItem value="clothing">Rad</SelectItem>
                        <SelectItem value="art">Atis</SelectItem>
                        <SelectItem value="documents">Dokiman</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="purchase_price">Pri acha ($)</Label>
                      <Input
                        id="purchase_price"
                        type="number"
                        value={newAsset.purchase_price}
                        onChange={(e) => setNewAsset({...newAsset, purchase_price: parseFloat(e.target.value) || 0})}
                        placeholder="1500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="current_value">Valè kounye a ($)</Label>
                      <Input
                        id="current_value"
                        type="number"
                        value={newAsset.current_value}
                        onChange={(e) => setNewAsset({...newAsset, current_value: parseFloat(e.target.value) || 0})}
                        placeholder="1200"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="purchase_date">Dat acha</Label>
                    <Input
                      id="purchase_date"
                      type="date"
                      value={newAsset.purchase_date}
                      onChange={(e) => setNewAsset({...newAsset, purchase_date: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Kote li ye</Label>
                    <Input
                      id="location"
                      value={newAsset.location}
                      onChange={(e) => setNewAsset({...newAsset, location: e.target.value})}
                      placeholder="Kay la, biwo a..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Deskripsyon</Label>
                    <Textarea
                      id="description"
                      value={newAsset.description}
                      onChange={(e) => setNewAsset({...newAsset, description: e.target.value})}
                      placeholder="Ti deskripsyon sou byen an..."
                    />
                  </div>
                  <Button onClick={addAsset} className="w-full">
                    Ajoute byen an
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Asset yo</p>
                    <p className="text-3xl font-bold">{totalAssets}</p>
                  </div>
                  <Building className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Valè Total</p>
                    <p className="text-3xl font-bold">${totalValue.toLocaleString()}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Kategori yo</p>
                    <p className="text-3xl font-bold">{categoriesCount}</p>
                  </div>
                  <Key className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Chèche bien yo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtè pa kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tout kategori yo</SelectItem>
                {Object.entries(categoryNames).map(([key, name]) => (
                  <SelectItem key={key} value={key}>{name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="assets" className="space-y-6">
            <TabsList>
              <TabsTrigger value="assets">Asset yo</TabsTrigger>
              <TabsTrigger value="categories">Kategori yo</TabsTrigger>
              <TabsTrigger value="warranties">Garanti yo</TabsTrigger>
            </TabsList>

            <TabsContent value="assets">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAssets.map((asset) => {
                  const IconComponent = categoryIcons[asset.category as keyof typeof categoryIcons] || Building;
                  const currentValue = asset.current_value || asset.purchase_price || 0;
                  
                  return (
                    <Card key={asset.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <IconComponent className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold">{asset.name}</h3>
                              {asset.category && (
                                <Badge variant="secondary" className="text-xs">
                                  {categoryNames[asset.category] || asset.category}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Valè:</span>
                            <span className="font-medium">${currentValue.toLocaleString()}</span>
                          </div>
                          {asset.location && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              <span>{asset.location}</span>
                            </div>
                          )}
                          {asset.purchase_date && (
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Achte:</span>
                              <span>{new Date(asset.purchase_date).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                        
                        {asset.description && (
                          <div className="mt-4 pt-4 border-t">
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {asset.description}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}

                {filteredAssets.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <Building className="h-24 w-24 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Pa gen asset</h3>
                    <p className="text-muted-foreground">Kòmanse pa ajoute premye asset ou a.</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="categories">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(categoryNames).map(([key, name]) => {
                  const IconComponent = categoryIcons[key as keyof typeof categoryIcons];
                  const categoryAssets = assets.filter(asset => asset.category === key);
                  const categoryValue = categoryAssets.reduce((sum, asset) => sum + (asset.current_value || asset.purchase_price || 0), 0);

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

            <TabsContent value="warranties">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Garanti ak Asirans
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {assets.filter(asset => asset.warranty_end_date || asset.insurance_expiry_date).map((asset) => (
                      <div key={asset.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Shield className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">{asset.name}</h4>
                            <div className="text-sm text-muted-foreground">
                              {asset.warranty_end_date && (
                                <p>Garanti: {new Date(asset.warranty_end_date).toLocaleDateString()}</p>
                              )}
                              {asset.insurance_expiry_date && (
                                <p>Asirans: {new Date(asset.insurance_expiry_date).toLocaleDateString()}</p>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Aktyèlize
                        </Button>
                      </div>
                    ))}

                    {assets.filter(asset => asset.warranty_end_date || asset.insurance_expiry_date).length === 0 && (
                      <div className="text-center py-12">
                        <Shield className="h-24 w-24 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Pa gen garanti nan sistèm nan</h3>
                        <p className="text-muted-foreground">Ajoute enfòmasyon garanti ak asirans pou bien ou yo.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}