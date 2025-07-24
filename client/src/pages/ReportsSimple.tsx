import { useState } from "react";
import { ResponsiveLayout } from "@/components/layout/ResponsiveLayout";
import { PullToRefresh, TouchOptimizedButton } from "@/components/mobile/TouchOptimized";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Download, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Reports() {
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useIsMobile();

  const handleRefresh = async () => {
    setIsLoading(false);
  };

  const content = (
    <div className={cn("p-4", !isMobile && "p-6")}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Rapò yo</h1>
        <p className="text-muted-foreground">Analize ak wè pwogre ou</p>
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
                  <p className="text-sm text-muted-foreground">Pwodiktivite</p>
                  <p className="text-2xl font-bold">0%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Aktivite</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
                <Activity className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Rapò Detaye
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Pa gen rapò yo disponib</p>
              <TouchOptimizedButton className="mt-4">
                <Download className="h-4 w-4 mr-2" />
                Jenere Rapò
              </TouchOptimizedButton>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <ResponsiveLayout currentPath="/reports">
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