import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Instagram, Copy, RefreshCw, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface SocialMediaCaptionDialogProps {
  brand?: string;
  daysSinceLastPost?: number;
  children: React.ReactNode;
}

export function SocialMediaCaptionDialog({ 
  brand = "REV", 
  daysSinceLastPost = 4, 
  children 
}: SocialMediaCaptionDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCaption, setSelectedCaption] = useState("");
  const { toast } = useToast();

  const { data: captions, isLoading, refetch } = useQuery({
    queryKey: ['social-media-captions', brand, daysSinceLastPost],
    queryFn: async () => {
      const response = await fetch('/api/ai/social-media-captions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          brand,
          recentPosts: [],
          daysSinceLastPost
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate captions');
      }
      
      const data = await response.json();
      return data.captions as string[];
    },
    enabled: isOpen,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Kopi nan clipboard!",
        description: "Caption an kopi ak siksè.",
      });
    } catch (error) {
      toast({
        title: "Erè",
        description: "Pa t kapab kopi caption an.",
        variant: "destructive",
      });
    }
  };

  const captionTypes = [
    { label: "Motivasyon", color: "bg-blue-500", icon: "💪" },
    { label: "Angajman", color: "bg-green-500", icon: "❓" },
    { label: "Konsèy", color: "bg-purple-500", icon: "💡" }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Instagram className="h-5 w-5 text-pink-500" />
            Caption Instagram pou {brand}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            {daysSinceLastPost} jou depi dènye post - IA ap ede w prepare caption yo rapid
          </p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-3 text-muted-foreground">IA ap kreye caption yo...</span>
            </div>
          ) : captions && captions.length > 0 ? (
            <div className="space-y-4">
              {captions.map((caption, index) => (
                <Card key={index} className="relative">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <Badge 
                        variant="outline" 
                        className={`${captionTypes[index]?.color || 'bg-gray-500'} text-white border-none`}
                      >
                        {captionTypes[index]?.icon} {captionTypes[index]?.label || 'Caption'}
                      </Badge>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(caption)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedCaption(caption)}
                        >
                          Modifye
                        </Button>
                      </div>
                    </div>
                    
                    <Textarea
                      value={selectedCaption === caption ? selectedCaption : caption}
                      onChange={(e) => {
                        if (selectedCaption === caption) {
                          setSelectedCaption(e.target.value);
                        }
                      }}
                      className="min-h-[100px] resize-none border-none bg-transparent p-0 focus-visible:ring-0"
                      readOnly={selectedCaption !== caption}
                    />
                    
                    <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
                      <span>{caption.length} karaktè</span>
                      <div className="flex items-center gap-2">
                        <Instagram className="h-4 w-4" />
                        <span>Pare pou poste</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Pa ka jenere caption yo kounye a. Eseye ankò.</p>
            </div>
          )}

          <div className="flex justify-between items-center pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => refetch()}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Jenere Nouvo
            </Button>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Fèmen
              </Button>
              <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
                <Sparkles className="h-4 w-4 mr-2" />
                Poste Kounye a
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}