import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Clock, Heart, Lightbulb, MessageCircle } from "lucide-react";

const suggestions = [
  {
    id: 1,
    type: "time",
    title: "Ou gen 45 min lib",
    description: "Ou ta renmen rele manman w, li yon chapit sou kominikasyon, oswa repanse caption Instagram pwochen post ou?",
    options: ["Rele manman m", "Li yon ti kras", "Travay sou kontni"],
    icon: Clock,
    priority: "medium"
  },
  {
    id: 2,
    type: "content",
    title: "Kontni ou reta",
    description: "Sonje ou pa poste sou rezo sosyal depi 4 jou — ou vle IA ede w prepare 3 caption rapid?",
    options: ["Kreye caption yo", "Planifye kontni semèn nan", "Ignore pou kounye a"],
    icon: MessageCircle,
    priority: "high"
  },
  {
    id: 3,
    type: "wellness",
    title: "Swen tèt ou",
    description: "Ou pa t dòmi ase yè swa — ou ta pito medite 10 min, oswa fè yon ti kafe ak zanmi?",
    options: ["Meditasyon rapid", "Rele yon zanmi", "Fè yon ti repo"],
    icon: Heart,
    priority: "high"
  },
  {
    id: 4,
    type: "productivity",
    title: "Optimize jounen ou",
    description: "M wè ou gen 3 reyinyon jodi a. Ou vle m prepare yon agenda ak kesyon yo dwe poze?",
    options: ["Prepare agenda yo", "Rezime objektif yo", "Mete rapèl yo"],
    icon: Lightbulb,
    priority: "medium"
  }
];

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high": return "border-l-destructive bg-destructive/5";
    case "medium": return "border-l-warning bg-warning/5";
    case "low": return "border-l-success bg-success/5";
    default: return "border-l-muted bg-muted/5";
  }
};

export function AISuggestions() {
  const [dismissedSuggestions, setDismissedSuggestions] = useState<number[]>([]);

  const handleAction = (suggestionId: number, action: string) => {
    console.log(`Action: ${action} for suggestion ${suggestionId}`);
    // TODO: Implement action logic
    setDismissedSuggestions(prev => [...prev, suggestionId]);
  };

  const dismissSuggestion = (suggestionId: number) => {
    setDismissedSuggestions(prev => [...prev, suggestionId]);
  };

  const activeSuggestions = suggestions.filter(s => !dismissedSuggestions.includes(s.id));

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-accent" />
          Sijesyon IA pou ou
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeSuggestions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Ou up-to-date! IA a ap gade si li ka ede w.</p>
          </div>
        ) : (
          activeSuggestions.map((suggestion) => {
            const Icon = suggestion.icon;
            return (
              <div
                key={suggestion.id}
                className={`p-4 rounded-lg border-l-4 ${getPriorityColor(suggestion.priority)} transition-all hover:shadow-card`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-background/50">
                    <Icon className="h-4 w-4 text-accent" />
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">{suggestion.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {suggestion.type}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {suggestion.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      {suggestion.options.map((option, index) => (
                        <Button
                          key={index}
                          variant={index === 0 ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleAction(suggestion.id, option)}
                          className="text-xs"
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => dismissSuggestion(suggestion.id)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    ✕
                  </Button>
                </div>
              </div>
            );
          })
        )}
        
        {activeSuggestions.length > 0 && (
          <div className="pt-2 border-t border-border/50">
            <Button variant="ghost" size="sm" className="w-full text-xs">
              <Sparkles className="h-4 w-4 mr-2" />
              Refresh sijesyon yo
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}