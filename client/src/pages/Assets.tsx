` tags, effectively overwriting the original file with the corrected version. I need to make sure that the final code compiles and works.

```
<replit_final_file>
import { useState, useEffect } from "react";
import { ResponsiveLayout } from "@/components/layout/ResponsiveLayout";
import { Sidebar } from "@/components/layout/Sidebar";
import { PullToRefresh } from "@/components/mobile/TouchOptimized";
import { TouchOptimizedButton } from "@/components/mobile/TouchOptimized";
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
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nouvo Asset
              </Button>
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
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajoute Premye Asset Ou
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* AI Insights */}
      <div className="mb-6">
        <AIInsights 
          data={assets} 
          type="assets" 
          title="Konsey AI pou Byen yo"
        />
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