import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const stats = [
  {
    label: "Pwojè Aktif",
    value: "7",
    change: "+2",
    trend: "up",
    subtitle: "nan devlopman",
    color: "text-primary"
  },
  {
    label: "Tach Jodi a",
    value: "12",
    change: "75%",
    trend: "up", 
    subtitle: "konplete",
    color: "text-success"
  },
  {
    label: "Balans",
    value: "₵ 2,450",
    change: "-₵ 120",
    trend: "down",
    subtitle: "mwa sa",
    color: "text-warning"
  },
  {
    label: "Kontak",
    value: "3",
    change: "0",
    trend: "neutral",
    subtitle: "dwe kontakte",
    color: "text-accent"
  }
];

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case "up":
      return <TrendingUp className="h-3 w-3 text-success" />;
    case "down":
      return <TrendingDown className="h-3 w-3 text-destructive" />;
    default:
      return <Minus className="h-3 w-3 text-muted-foreground" />;
  }
};

export function QuickStats() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/70 transition-all">
          <CardContent className="p-4">
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground font-medium">
                {stat.label}
              </p>
              
              <div className="flex items-end justify-between">
                <h3 className={`text-xl font-bold ${stat.color}`}>
                  {stat.value}
                </h3>
                <div className="flex items-center gap-1">
                  {getTrendIcon(stat.trend)}
                  <span className={`text-xs font-medium ${
                    stat.trend === "up" ? "text-success" :
                    stat.trend === "down" ? "text-destructive" :
                    "text-muted-foreground"
                  }`}>
                    {stat.change}
                  </span>
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground">
                {stat.subtitle}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}