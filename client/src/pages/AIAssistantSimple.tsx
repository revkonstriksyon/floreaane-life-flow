import { useState } from "react";
import { ResponsiveLayout } from "@/components/layout/ResponsiveLayout";
import { PullToRefresh, TouchOptimizedButton } from "@/components/mobile/TouchOptimized";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Bot, MessageSquare, Send, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AIAssistant() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const isMobile = useIsMobile();

  const handleRefresh = async () => {
    setIsLoading(false);
  };

  const content = (
    <div className={cn("p-4", !isMobile && "p-6")}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Asistan AI</h1>
        <p className="text-muted-foreground">Pale ak asistan AI ou a</p>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Konvèsasyon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Kòmanse yon konvèsasyon ak AI a</p>
            </div>
            
            <div className="flex gap-2 mt-4">
              <Input
                placeholder="Tape mesaj ou a..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1"
              />
              <TouchOptimizedButton>
                <Send className="h-4 w-4" />
              </TouchOptimizedButton>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <ResponsiveLayout currentPath="/ai-assistant">
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