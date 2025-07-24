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
  Shield
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Asset {
  id: string;
  name: string;
  category: string | null;
  current_value: number | null;
  purchase_price: number | null;
  purchase_date: string | null;
  warranty_end_date: string | null;
  insurance_expiry_date: string | null;
  license_expiry_date: string | null;
  location: string | null;
  description: string | null;
  image_url: string | null;
  user_id: string;
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
  created_at: string;
  updated_at: string;
}

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
      const assetData = {
        ...newAsset,
        purchase_price: newAsset.purchase_price || null,
        current_value: newAsset.current_value || null,
        purchase_date: newAsset.purchase_date || null,
        warranty_end_date: newAsset.warranty_end_date || null,
        insurance_expiry_date: newAsset.insurance_expiry_date || null
      };

      const { data, error } = await supabase
        .from('assets')
        .insert([assetData])
        .select();


  if (isLoading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex-1 overflow-auto flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Chaje byen yo...</p>
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
                Byen & Enventè
              </h1>
              <p className="text-muted-foreground mt-1">
                Jere ak swiv tout bien ou yo
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Chèche byen..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tout Kategori</SelectItem>
                  <SelectItem value="real_estate">Tè ak Kay</SelectItem>
                  <SelectItem value="technology">Teknoloji</SelectItem>
                  <SelectItem value="clothing">Rad</SelectItem>
                  <SelectItem value="vehicles">Vèkil</SelectItem>
                  <SelectItem value="tools">Zouti</SelectItem>
                  <SelectItem value="art">Ò ak dekorasyon</SelectItem>
                  <SelectItem value="documents">Dokiman</SelectItem>
                </SelectContent>
              </Select>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-gradient-primary">
                    <Plus className="h-4 w-4 mr-2" />
                    Nouvo Byen
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Ajoute nouvo byen</DialogTitle>
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
                          <SelectItem value="real_estate">Tè ak Kay</SelectItem>
                          <SelectItem value="technology">Teknoloji</SelectItem>
                          <SelectItem value="clothing">Rad</SelectItem>
                          <SelectItem value="vehicles">Vèkil</SelectItem>
                          <SelectItem value="tools">Zouti</SelectItem>
                          <SelectItem value="art">Ò ak dekorasyon</SelectItem>
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
                          placeholder="1000"
                        />
                      </div>
                      <div>
                        <Label htmlFor="current_value">Valè kounye a ($)</Label>
                        <Input
                          id="current_value"
                          type="number"
                          value={newAsset.current_value}
                          onChange={(e) => setNewAsset({...newAsset, current_value: parseFloat(e.target.value) || 0})}
                          placeholder="800"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="description">Deskripsyon</Label>
                      <Textarea
                        id="description"
                        value={newAsset.description}
                        onChange={(e) => setNewAsset({...newAsset, description: e.target.value})}
                        placeholder="Detalye sou bien an..."
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Kote li ye</Label>
                      <Input
                        id="location"
                        value={newAsset.location}
                        onChange={(e) => setNewAsset({...newAsset, location: e.target.value})}
                        placeholder="Kay, biwo, depo..."
                      />
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
                      <Label htmlFor="serial_number">Nimewo seri</Label>
                      <Input
                        id="serial_number"
                        value={newAsset.serial_number}
                        onChange={(e) => setNewAsset({...newAsset, serial_number: e.target.value})}
                        placeholder="ABC123456"
                      />
                    </div>
                    <Button onClick={addAsset} className="w-full">
                      Ajoute bien an
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
                  <p className="text-sm text-muted-foreground">Total Byen</p>
                  <p className="text-2xl font-bold">{totalAssets}</p>
                </div>
                <Home className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Valè Total</p>
                  <p className="text-2xl font-bold text-green-500">${totalValue.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Kategori</p>
                  <p className="text-2xl font-bold">{categoriesCount}</p>
                </div>
                <FileText className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Garanti ki Fini</p>
                  <p className="text-2xl font-bold text-orange-500">{expiringWarranties}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-500" />
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
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            </TabsList>

            <TabsContent value="grid">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAssets.map((asset) => {
                  const IconComponent = categoryIcons[asset.category || 'documents'] || FileText;
                  const isWarrantyExpiring = asset.warranty_end_date && 
                    new Date(asset.warranty_end_date) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

                  return (
                    <Card key={asset.id} className={`hover:shadow-md transition-shadow ${isWarrantyExpiring ? 'border-orange-200' : ''}`}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <IconComponent className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <CardTitle className="text-lg line-clamp-1">{asset.name}</CardTitle>
                              <p className="text-sm text-muted-foreground">
                                {asset.category?.replace('_', ' ').toUpperCase() || 'LÒTL'}
                              </p>
                            </div>
                          </div>
                          {isWarrantyExpiring && (
                            <AlertTriangle className="h-5 w-5 text-orange-500" />
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        {asset.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                            {asset.description}
                          </p>
                        )}

                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            {asset.current_value && (
                              <div>
                                <span className="text-muted-foreground">Valè:</span>
                                <p className="font-semibold text-green-600">${asset.current_value.toLocaleString()}</p>
                              </div>
                            )}
                            {asset.purchase_price && (
                              <div>
                                <span className="text-muted-foreground">Pri acha:</span>
                                <p className="font-semibold">${asset.purchase_price.toLocaleString()}</p>
                              </div>
                            )}
                          </div>

                          {asset.location && (
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span>{asset.location}</span>
                            </div>
                          )}

                          {asset.purchase_date && (
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>Achte: {new Date(asset.purchase_date).toLocaleDateString()}</span>
                            </div>
                          )}

                          {asset.warranty_end_date && (
                            <div className={`flex items-center gap-2 text-sm ${isWarrantyExpiring ? 'text-orange-600' : ''}`}>
                              <Shield className="h-4 w-4" />
                              <span>Garanti: {new Date(asset.warranty_end_date).toLocaleDateString()}</span>
                            </div>
                          )}

                          {asset.serial_number && (
                            <div className="text-xs text-muted-foreground">
                              SN: {asset.serial_number}
                            </div>
                          )}
                        </div>

                        <div className="flex justify-between mt-4">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            Wè
                          </Button>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Camera className="h-4 w-4" />
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
                {filteredAssets.map((asset) => {
                  const IconComponent = categoryIcons[asset.category || 'documents'] || FileText;
                  const isWarrantyExpiring = asset.warranty_end_date && 
                    new Date(asset.warranty_end_date) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

                  return (
                    <Card key={asset.id} className={`hover:shadow-md transition-shadow ${isWarrantyExpiring ? 'border-orange-200' : ''}`}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="p-3 bg-primary/10 rounded-lg">
                              <IconComponent className="h-6 w-6 text-primary" />
                            </div>

                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-lg">{asset.name}</h3>
                                {isWarrantyExpiring && (
                                  <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">
                                    Garanti ap fini
                                  </Badge>
                                )}
                              </div>

                              <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
                                {asset.description || 'Pa gen deskripsyon'}
                              </p>

                              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                                {asset.current_value && (
                                  <div className="flex items-center gap-1">
                                    <DollarSign className="h-4 w-4" />
                                    <span>${asset.current_value.toLocaleString()}</span>
                                  </div>
                                )}
                                {asset.location && (
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    <span>{asset.location}</span>
                                  </div>
                                )}
                                {asset.purchase_date && (
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    <span>{new Date(asset.purchase_date).toLocaleDateString()}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              Wè
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
                {Object.entries(categoryIcons).map(([key, IconComponent]) => {
                  const categoryAssets = assets.filter(asset => asset.category === key);
                  const categoryValue = categoryAssets.reduce((sum, asset) => 
                    sum + (asset.current_value || asset.purchase_price || 0), 0);

                  const categoryLabels: Record<string, string> = {
                    real_estate: "Tè ak Kay",
                    technology: "Teknoloji",
                    clothing: "Rad",
                    vehicles: "Vèkil",
                    tools: "Zouti",
                    art: "Ò ak dekorasyon",
                    documents: "Dokiman"
                  };

                  return (
                    <Card key={key} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-6 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="p-4 bg-primary/10 rounded-full">
                            <IconComponent className="h-8 w-8 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{categoryLabels[key]}</h3>
                            <p className="text-sm text-muted-foreground">
                              {categoryAssets.length} atikl
                            </p>
                            <p className="text-lg font-bold text-green-600 mt-2">
                              ${categoryValue.toLocaleString()}
                            </p>
                          </div>

                          {categoryAssets.length > 0 && (
                            <div className="w-full text-left">
                              <p className="text-xs text-muted-foreground mb-2">Dènye yo:</p>
                              <div className="space-y-1">
                                {categoryAssets.slice(0, 3).map(asset => (
                                  <p key={asset.id} className="text-sm line-clamp-1">
                                    {asset.name}
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

            <TabsContent value="maintenance">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    Maintenance ak Garanti
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {assets
                      .filter(asset => asset.warranty_end_date || asset.insurance_expiry_date)
                      .map((asset) => {
                        const warrantyExpiring = asset.warranty_end_date && 
                          new Date(asset.warranty_end_date) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
                        const insuranceExpiring = asset.insurance_expiry_date && 
                          new Date(asset.insurance_expiry_date) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

                        return (
                          <div key={asset.id} className={`p-4 rounded-lg border ${
                            warrantyExpiring || insuranceExpiring ? 'bg-orange-50 border-orange-200' : 'bg-muted/50'
                          }`}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <AlertTriangle className={`h-5 w-5 ${
                                  warrantyExpiring || insuranceExpiring ? 'text-orange-500' : 'text-muted-foreground'
                                }`} />
                                <div>
                                  <h3 className="font-medium">{asset.name}</h3>
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
                          </div>
                        );
                      })}

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
    const warrantDate = new Date(asset.warranty_end_date);
    const today = new Date();
    const monthFromNow = new Date();
    monthFromNow.setMonth(today.getMonth() + 1);
    return warrantDate <= monthFromNow && warrantDate >= today;
  }).length;;

  const addAsset = async () => {
    try {
      const { data, error } = await supabase
        .from('assets')
        .insert([newAsset])
        .select();

      if (error) throw error;

      setAssets([...assets, ...(data || [])]);
      setNewAsset({
        name: "",
        category: "",
        estimated_value: 0,
        purchase_date: "",
        condition: "",
        location: "",
        description: "",
        warranty_expiry: "",
        insurance_expiry: ""
      });
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Error adding asset:', error);
    }
  };

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || asset.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalValue = assets.reduce((sum, asset) => sum + (asset.estimated_value || 0), 0);
  const categoryIcons = {
    property: Home,
    technology: Laptop,
    transport: Car,
    tools: Wrench,
    personal: Shirt,
    documents: FileText,
    art: ImageIcon,
    jewelry: Watch,
    electronics: Smartphone
  };

  const filteredAssetsSearch = assets.filter(asset =>
    asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalValueOld = assets.reduce((sum, asset) => sum + (asset.current_value || 0), 0);
  const totalPurchaseValue = assets.reduce((sum, asset) => sum + (asset.purchase_price || 0), 0);
  const valueChange = totalValueOld - totalPurchaseValue;

  const getPriorityColor = (dueDate: string | null) => {
    if (!dueDate) return "bg-muted text-muted-foreground";

    const today = new Date();
    const due = new Date(dueDate);
    const daysUntilDue = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilDue < 30) return "bg-destructive/10 text-destructive border-destructive/20";
    if (daysUntilDue < 90) return "bg-warning/10 text-warning border-warning/20";
    return "bg-green-500/10 text-green-500 border-green-500/20";
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar collapsed={sidebarCollapsed} onToggle={setSidebarCollapsed} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            <p className="mt-4">Ap chèche byen yo...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex-1 overflow-auto flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Chaje byen yo...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar collapsed={sidebarCollapsed} onToggle={setSidebarCollapsed} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold">Jesyon Byen</h1>
              <p className="text-muted-foreground">Sivèy ak jeré tout byen ou yo</p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajoute Byen
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Ajoute nouvo byen</DialogTitle>
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
                        <SelectItem value="property">Byen imobilye</SelectItem>
                        <SelectItem value="technology">Teknoloji</SelectItem>
                        <SelectItem value="transport">Transpò</SelectItem>
                        <SelectItem value="tools">Zouti</SelectItem>
                        <SelectItem value="personal">Pèsonèl</SelectItem>
                        <SelectItem value="electronics">Elektronik</SelectItem>
                        <SelectItem value="jewelry">Bijou</SelectItem>
                        <SelectItem value="documents">Dokiman</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="value">Valè estimatif ($)</Label>
                    <Input
```text
                      id="value"
                      type="number"
                      value={newAsset.estimated_value}
                      onChange={(e) => setNewAsset({...newAsset, estimated_value: parseFloat(e.target.value) || 0})}
                      placeholder="1500"
                    />
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
                    <Label htmlFor="condition">Kondisyon</Label>
                    <Select value={newAsset.condition} onValueChange={(value) => setNewAsset({...newAsset, condition: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chwazi kondisyon" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excellent">Eksèlan</SelectItem>
                        <SelectItem value="good">Bon</SelectItem>
                        <SelectItem value="fair">Akseptab</SelectItem>
                        <SelectItem value="poor">Move</SelectItem>
                      </SelectContent>
                    </Select>
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
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filtre
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Valè Total</p>
                    <p className="text-2xl font-bold">${totalValue.toLocaleString()}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-primary" />
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
                    <p className="text-2xl font-bold">{assets.length}</p>
                  </div>
                  <Home className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Alèt</p>
                    <p className="text-2xl font-bold">
                      {assets.filter(asset => {
                        const today = new Date();
                        return (asset.warranty_end_date && new Date(asset.warranty_end_date) < new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)) ||
                               (asset.insurance_expiry_date && new Date(asset.insurance_expiry_date) < new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)) ||
                               (asset.license_expiry_date && new Date(asset.license_expiry_date) < new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000));
                      }).length}
                    </p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>
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
                {filteredAssetsSearch.map((asset) => {
                  const IconComponent = categoryIcons[asset.category || 'documents'] || FileText;

                  return (
                    <Card key={asset.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <IconComponent className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{asset.name}</CardTitle>
                              <p className="text-sm text-muted-foreground">
                                {categoryNames[asset.category || 'documents'] || 'Dokiman'}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-1">
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
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Valè Kounye a:</span>
                            <span className="font-semibold">${asset.current_value?.toLocaleString() || '0'}</span>
                          </div>

                          {asset.location && (
                            <div className="flex items-center gap-2 text-sm">
                              <Home className="h-4 w-4 text-muted-foreground" />
                              <span>{asset.location}</span>
                            </div>
                          )}

                          {asset.purchase_date && (
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>Achte: {new Date(asset.purchase_date).toLocaleDateString('fr-FR')}</span>
                            </div>
                          )}

                          {asset.warranty_end_date && (
                            <div className="flex items-center gap-2 text-sm text-orange-500">
                              <AlertTriangle className="h-4 w-4" />
                              <span>Garanti fini: {new Date(asset.warranty_end_date).toLocaleDateString('fr-FR')}</span>
                            </div>
                          )}
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
                  const categoryAssets = assets.filter(asset => asset.category === key);
                  const categoryValue = categoryAssets.reduce((sum, asset) => sum + (asset.current_value || 0), 0);

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