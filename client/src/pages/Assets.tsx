import { useState, useEffect } from "react";
import { ResponsiveLayout } from "@/components/layout/ResponsiveLayout";
import { PullToRefresh, TouchOptimizedButton } from "@/components/mobile/TouchOptimized";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAssets, useCreateAsset } from "@/hooks/api/useAssets";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
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
import { AIInsights } from "@/components/ai/AIInsights";
import { AIChat } from "@/components/ai/AIChat";
import type { Asset } from "@shared/schema";

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
  const { userId } = useAuth();
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Use React Query hooks
  const { data: assets = [], isLoading, refetch } = useAssets(userId!);
  const createAssetMutation = useCreateAsset();

  const [newAsset, setNewAsset] = useState({
    name: "",
    category: "",
    purchasePrice: "",
    currentValue: "",
    purchaseDate: "",
    location: "",
    description: "",
    warrantyEndDate: "",
    insuranceExpiryDate: "",
    serialNumber: "",
    notes: ""
  });

  const handleRefresh = async () => {
    await refetch();
  };

  const addAsset = async () => {
    if (!userId) return;
    
    try {
      const assetData = {
        userId,
        name: newAsset.name.trim(),
        category: newAsset.category,
        purchasePrice: newAsset.purchasePrice ? parseFloat(newAsset.purchasePrice) : null,
        currentValue: newAsset.currentValue ? parseFloat(newAsset.currentValue) : null,
        purchaseDate: newAsset.purchaseDate ? new Date(newAsset.purchaseDate) : null,
        location: newAsset.location || null,
        description: newAsset.description || null,
        warrantyEndDate: newAsset.warrantyEndDate ? new Date(newAsset.warrantyEndDate) : null,
        insuranceExpiryDate: newAsset.insuranceExpiryDate ? new Date(newAsset.insuranceExpiryDate) : null,
        serialNumber: newAsset.serialNumber || null,
        notes: newAsset.notes || null,
      };

      await createAssetMutation.mutateAsync(assetData);
      
      setNewAsset({
        name: "",
        category: "",
        purchasePrice: "",
        currentValue: "",
        purchaseDate: "",
        location: "",
        description: "",
        warrantyEndDate: "",
        insuranceExpiryDate: "",
        serialNumber: "",
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

  const totalValue = assets.reduce((sum, asset) => sum + (asset.currentValue || asset.purchasePrice || 0), 0);
  const totalAssets = assets.length;
  const categoriesCount = new Set(assets.map(a => a.category).filter(Boolean)).size;

  const expiringWarranties = assets.filter(asset => {
    if (!asset.warrantyEndDate) return false;
    const expiryDate = new Date(asset.warrantyEndDate);
    const now = new Date();
    const monthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    return expiryDate <= monthFromNow;
  });

  const content = (
    <div className={cn("p-4 space-y-6", !isMobile && "p-6")}>
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold mb-2">Byen ak Asset yo</h1>
          <p className="text-muted-foreground">Jesyon ak suivi tou sa ou gen yo</p>
        </div>

        {/* Quick Stats */}
        <div className={cn(
          "grid gap-4",
          isMobile ? "grid-cols-2" : "grid-cols-4"
        )}>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{totalAssets}</p>
                <p className="text-sm text-muted-foreground">Total Asset</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">${totalValue.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Valè Total</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{categoriesCount}</p>
                <p className="text-sm text-muted-foreground">Kategori</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">{expiringWarranties.length}</p>
                <p className="text-sm text-muted-foreground">Garanti Expire</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Cherche asset..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tout Kategori</SelectItem>
              {Object.entries(categoryNames).map(([key, name]) => (
                <SelectItem key={key} value={key}>{name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <TouchOptimizedButton>
                <Plus className="h-4 w-4 mr-2" />
                Nouvo Asset
              </TouchOptimizedButton>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Ajoute yon nouvo asset</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Non asset la</Label>
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
                      {Object.entries(categoryNames).map(([key, name]) => (
                        <SelectItem key={key} value={key}>{name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="purchasePrice">Pri Achte</Label>
                    <Input
                      id="purchasePrice"
                      type="number"
                      value={newAsset.purchasePrice}
                      onChange={(e) => setNewAsset({...newAsset, purchasePrice: e.target.value})}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="purchaseDate">Dat Achte</Label>
                    <Input
                      id="purchaseDate"
                      type="date"
                      value={newAsset.purchaseDate}
                      onChange={(e) => setNewAsset({...newAsset, purchaseDate: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Deskripsyon</Label>
                  <Textarea
                    id="description"
                    value={newAsset.description}
                    onChange={(e) => setNewAsset({...newAsset, description: e.target.value})}
                    placeholder="Deskripsyon kout..."
                    rows={3}
                  />
                </div>
                <Button onClick={addAsset} className="w-full" disabled={createAssetMutation.isPending}>
                  {createAssetMutation.isPending ? 'Kap ajoute...' : 'Ajoute Asset'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Assets List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-full"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-2 bg-muted rounded"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredAssets.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredAssets.map((asset) => {
              const CategoryIcon = categoryIcons[asset.category as keyof typeof categoryIcons] || FileText;
              
              return (
                <Card key={asset.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-1 flex items-center gap-2">
                          <CategoryIcon className="h-5 w-5 text-muted-foreground" />
                          {asset.name}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {asset.description || 'Pa gen deskripsyon'}
                        </p>
                      </div>
                      <Badge variant="outline" className="ml-2">
                        {categoryNames[asset.category as keyof typeof categoryNames] || asset.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          Valè
                        </span>
                        <span className="font-medium">
                          ${(asset.currentValue || asset.purchasePrice || 0).toLocaleString()}
                        </span>
                      </div>
                      
                      {asset.location && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{asset.location}</span>
                        </div>
                      )}
                      
                      {asset.warrantyEndDate && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Shield className="h-4 w-4" />
                          <span>Garanti: {new Date(asset.warrantyEndDate).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <Home className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  {searchQuery || selectedCategory !== "all" ? "Pa gen asset ki kòrèk ak rechèch la" : "Pa gen asset yo"}
                </p>
                <TouchOptimizedButton onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajoute Premye Asset Ou
                </TouchOptimizedButton>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );

  return (
    <ResponsiveLayout currentPath="/assets">
      {isMobile ? (
        <PullToRefresh onRefresh={handleRefresh}>
          {content}
        </PullToRefresh>
      ) : (
        content
      )}
    </ResponsiveLayout>
  );
}
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

          {/* AI Insights */}
          <div className="mb-6">
            <AIInsights 
              data={assets} 
              type="assets" 
              title="Konsey AI pou Byen yo"
            />
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

      {/* AI Chat */}
      <AIChat 
        context={`Mwen gen ${assets.length} asset total ak valè ${totalValue.toLocaleString()} dola.`}
        suggestions={[
          "Ki bien ki bezwen pi plis atansyon?",
          "Ki jan pou pwoteje byen yo pi byen?",
          "Bay konsey sou asirans ak garanti",
          "Ki bien ki gen pi plis valè?"
        ]}
      />
    </div>
  );
}