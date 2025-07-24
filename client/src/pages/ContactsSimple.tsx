import { useState } from "react";
import { ResponsiveLayout } from "@/components/layout/ResponsiveLayout";
import { PullToRefresh, TouchOptimizedButton } from "@/components/mobile/TouchOptimized";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserPlus, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Contacts() {
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useIsMobile();

  const handleRefresh = async () => {
    setIsLoading(false);
  };

  const content = (
    <div className={cn("p-4", !isMobile && "p-6")}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Kontak yo</h1>
        <p className="text-muted-foreground">Jere ak òganize kontak ou yo</p>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Kontak ou yo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Phone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Pa gen kontak yo</p>
              <TouchOptimizedButton className="mt-4">
                <UserPlus className="h-4 w-4 mr-2" />
                Ajoute Kontak
              </TouchOptimizedButton>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <ResponsiveLayout currentPath="/contacts">
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