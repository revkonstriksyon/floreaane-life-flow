import { useState } from "react";
import { ResponsiveLayout } from "@/components/layout/ResponsiveLayout";
import { PullToRefresh, TouchOptimizedButton } from "@/components/mobile/TouchOptimized";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Finances() {
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useIsMobile();

  const handleRefresh = async () => {
    // TODO: Fetch financial data from Supabase
    setIsLoading(false);
  };

  const content = (
    <div className={cn("p-4", !isMobile && "p-6")}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Finans Mwen</h1>
        <p className="text-muted-foreground">Jere, planifye ak analize lajan ou</p>
      </div>

      <div className="grid gap-4">
        <div className={cn(
          "grid gap-4",
          isMobile ? "grid-cols-2" : "grid-cols-3"
        )}>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Balans</p>
                  <p className="text-2xl font-bold">$0.00</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Kòb ki antre</p>
                  <p className="text-2xl font-bold">$0.00</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Transakyon yo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Pa gen transakyon yo</p>
              <TouchOptimizedButton className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Ajoute Transakyon
              </TouchOptimizedButton>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <ResponsiveLayout currentPath="/finances">
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