
import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
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
  tools: Hammer,
  art: Image,
  documents: FileText
};

export default function Assets() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('assets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching assets:', error);
        return;
      }

      setAssets(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAssets = assets.filter(asset =>
    asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalValue = assets.reduce((sum, asset) => sum + (asset.current_value || 0), 0);
  const totalPurchaseValue = assets.reduce((sum, asset) => sum + (asset.purchase_price || 0), 0);
  const valueChange = totalValue - totalPurchaseValue;

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
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Ajoute Byen
            </Button>
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
                {filteredAssets.map((asset) => {
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
