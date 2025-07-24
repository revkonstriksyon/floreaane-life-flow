
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  TrendingUp, 
  Lightbulb, 
  Target, 
  RefreshCw,
  Eye,
  EyeOff,
  Loader2
} from "lucide-react";
import { GeminiAI, AIResponse } from "@/lib/gemini";

interface AIInsightsProps {
  data: any[];
  type: 'tasks' | 'projects' | 'finances' | 'contacts' | 'assets' | 'notes';
  title?: string;
}

export function AIInsights({ data, type, title }: AIInsightsProps) {
  const [insights, setInsights] = useState<AIResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const generateInsights = async () => {
    if (data.length === 0) return;
    
    setIsLoading(true);
    try {
      let response: AIResponse;
      
      switch (type) {
        case 'tasks':
          response = await GeminiAI.getTaskSuggestions(data);
          break;
        case 'projects':
          response = await GeminiAI.getProjectSuggestions(data);
          break;
        case 'finances':
          response = await GeminiAI.getFinancialSuggestions(data);
          break;
        case 'contacts':
          response = await GeminiAI.getRelationshipSuggestions(data);
          break;
        case 'assets':
          response = await GeminiAI.getAssetSuggestions(data);
          break;
        case 'notes':
          response = await GeminiAI.getContentSuggestions(data);
          break;
        default:
          response = { text: "Pa gen konsey ki disponib" };
      }
      
      setInsights(response);
    } catch (error) {
      console.error('Error generating insights:', error);
      setInsights({ text: "Erè nan jenere konsey yo" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (data.length > 0) {
      generateInsights();
    }
  }, [data, type]);

  if (!isVisible) {
    return (
      <Button
        variant="outline"
        onClick={() => setIsVisible(true)}
        className="mb-4"
      >
        <Eye className="h-4 w-4 mr-2" />
        Montre Konsey AI
      </Button>
    );
  }

  const getIcon = () => {
    switch (type) {
      case 'tasks': return <Target className="h-5 w-5" />;
      case 'projects': return <TrendingUp className="h-5 w-5" />;
      case 'finances': return <TrendingUp className="h-5 w-5" />;
      case 'contacts': return <Brain className="h-5 w-5" />;
      case 'assets': return <Brain className="h-5 w-5" />;
      case 'notes': return <Lightbulb className="h-5 w-5" />;
      default: return <Brain className="h-5 w-5" />;
    }
  };

  const getTitle = () => {
    if (title) return title;
    
    switch (type) {
      case 'tasks': return 'Konsey pou Tach yo';
      case 'projects': return 'Konsey pou Pwojè yo';
      case 'finances': return 'Konsey Finansye';
      case 'contacts': return 'Konsey pou Relasyon';
      case 'assets': return 'Konsey pou Byen yo';
      case 'notes': return 'Ide Nouvo';
      default: return 'Konsey AI';
    }
  };

  return (
    <Card className="mb-6 border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            {getIcon()}
            {getTitle()}
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              AI
            </Badge>
          </CardTitle>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={generateInsights}
              disabled={isLoading || data.length === 0}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
            >
              <EyeOff className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>AI a ap analize done yo...</span>
          </div>
        ) : insights ? (
          <div className="space-y-3">
            <div className="text-sm leading-relaxed">
              {insights.text.split('\n').map((line, index) => (
                <p key={index} className={line.trim() ? 'mb-2' : 'mb-1'}>
                  {line}
                </p>
              ))}
            </div>
            {insights.suggestions && insights.suggestions.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2 border-t">
                {insights.suggestions.map((suggestion, index) => (
                  <Badge key={index} variant="secondary">
                    {suggestion}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        ) : data.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            Pa gen done pou analize. Ajoute kèk bagay yo pou jwenn konsey AI.
          </p>
        ) : (
          <p className="text-muted-foreground text-sm">
            Klike sou refresh pou jwenn konsey AI.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
