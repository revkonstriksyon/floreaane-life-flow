import { useState } from "react";
import { ResponsiveLayout } from "@/components/layout/ResponsiveLayout";
import { PullToRefresh, TouchOptimizedButton } from "@/components/mobile/TouchOptimized";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Plus, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Notes() {
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useIsMobile();

  const handleRefresh = async () => {
    setIsLoading(false);
  };

  const content = (
    <div className={cn("p-4", !isMobile && "p-6")}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Nòt yo</h1>
        <p className="text-muted-foreground">Ekri ak òganize nòt ou yo</p>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Nòt ou yo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Pa gen nòt yo</p>
              <TouchOptimizedButton className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Ekri Nòt
              </TouchOptimizedButton>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <ResponsiveLayout currentPath="/notes">
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