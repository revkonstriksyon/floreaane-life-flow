import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lightbulb, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";

interface AIInsightsProps {
  data?: any[];
  type?: string;
  title?: string;
  insights?: Array<{
    type: 'success' | 'warning' | 'info' | 'trend';
    title: string;
    description: string;
    action?: string;
  }>;
}

export function AIInsights({ data = [], type, title = "Insight IA", insights }: AIInsightsProps) {
  const defaultInsights = [
    {
      type: 'trend' as const,
      title: 'Pwodiktivite w ap ogmante',
      description: 'Ou konplete 23% plis tach pase semèn pase',
      action: 'Kontinye konsa'
    },
    {
      type: 'warning' as const,
      title: 'Kèk pwojè an reta',
      description: '3 pwojè ki gen deadline nan 7 jou kap vini yo',
      action: 'Gade pwojè yo'
    },
    {
      type: 'info' as const,
      title: 'Nouvo opòtinite',
      description: 'Ou ka otomatize 40% nan tach repete w yo',
      action: 'Aprann plis'
    }
  ];

  const insightsToShow = insights && insights.length > 0 ? insights : defaultInsights;

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'trend': return <TrendingUp className="h-4 w-4 text-blue-500" />;
      default: return <Lightbulb className="h-4 w-4 text-purple-500" />;
    }
  };

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'success': return 'default' as const;
      case 'warning': return 'destructive' as const;
      case 'trend': return 'secondary' as const;
      default: return 'outline' as const;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {insightsToShow.map((insight, index) => (
          <div key={index} className="flex items-start space-x-3 p-3 rounded-lg border">
            {getIcon(insight.type)}
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-medium">{insight.title}</h4>
                <Badge variant={getBadgeVariant(insight.type)}>
                  {insight.type}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {insight.description}
              </p>
              {insight.action && (
                <Button variant="ghost" size="sm" className="h-6 text-xs">
                  {insight.action}
                </Button>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}