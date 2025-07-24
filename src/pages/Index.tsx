import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { MoodSelector } from "@/components/dashboard/MoodSelector";
import { DayPreview } from "@/components/dashboard/DayPreview";
import { AISuggestions } from "@/components/dashboard/AISuggestions";
import { QuickStats } from "@/components/dashboard/QuickStats";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, RefreshCw, Plus } from "lucide-react";

const Index = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const currentDate = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gradient-bg flex">
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      
      <main className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          {/* Header */}
          <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Dashboard Prensipal</h1>
                <p className="text-muted-foreground flex items-center gap-2 mt-1">
                  <Calendar className="h-4 w-4" />
                  {currentDate}
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="bg-background/50">
                  Jodi a: 12 Avril 2024
                </Badge>
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Day
                </Button>
                <Button variant="hero" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvo
                </Button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <div className="p-6 space-y-6">
            {/* Quick Stats */}
            <QuickStats />

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Mood Selector */}
              <div className="xl:col-span-1">
                <MoodSelector />
              </div>

              {/* Day Preview */}
              <div className="lg:col-span-1 xl:col-span-2">
                <DayPreview />
              </div>

              {/* AI Suggestions */}
              <div className="lg:col-span-2 xl:col-span-3">
                <AISuggestions />
              </div>
            </div>

            {/* Mini Memory Card */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">💭</span>
                  Mini-Memwa Ou
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-accent p-4 rounded-lg">
                  <p className="text-accent-foreground font-medium text-center">
                    "Pa janm trayi vizyon ou pou plezi moun."
                  </p>
                </div>
                <Button variant="ghost" size="sm" className="w-full mt-3">
                  Chanje memwa sa
                </Button>
              </CardContent>
            </Card>

            {/* End of Day Reflection (if evening) */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50 border-l-4 border-l-warning">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">🌅</span>
                  Refleksyon Jounen an
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Kisa ou fyè de jodi a? Ki bagay ou ta ka fè pi byen demen?
                </p>
                <Button variant="outline" className="w-full">
                  Kòmanse refleksyon an
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
