import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Brain, Lightbulb, Zap, Users, Phone, BookOpen, Instagram } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { SocialMediaCaptionDialog } from "./SocialMediaCaptionDialog";

interface TimeSlotSuggestion {
  duration: number;
  activities: string[];
  reason: string;
  priority: 'high' | 'medium' | 'low';
}

interface SmartTimeSuggestionsProps {
  mood: string;
  availableTime: number;
  recentActivities: string[];
  userContext?: any;
}

const priorityColors = {
  high: "bg-red-500",
  medium: "bg-yellow-500", 
  low: "bg-green-500"
};

const priorityLabels = {
  high: "Ijan",
  medium: "Mwayen",
  low: "Pa ijan"
};

const getActivityIcon = (activity: string) => {
  const lowerActivity = activity.toLowerCase();
  if (lowerActivity.includes('rele') || lowerActivity.includes('telefòn')) return Phone;
  if (lowerActivity.includes('li') || lowerActivity.includes('etidye')) return BookOpen;
  if (lowerActivity.includes('instagram') || lowerActivity.includes('post')) return Instagram;
  if (lowerActivity.includes('ekip') || lowerActivity.includes('moun')) return Users;
  return Lightbulb;
};

export function SmartTimeSuggestions({ mood, availableTime, recentActivities, userContext }: SmartTimeSuggestionsProps) {
  const currentHour = new Date().getHours();
  
  const { data: suggestions, isLoading, error } = useQuery({
    queryKey: ['time-suggestions', mood, availableTime, currentHour],
    queryFn: async () => {
      const response = await fetch('/api/ai/time-suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mood,
          availableTime,
          currentHour,
          recentActivities,
          userContext
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get AI suggestions');
      }
      
      const data = await response.json();
      return data.suggestions as TimeSlotSuggestion[];
    },
    enabled: Boolean(mood && availableTime > 0),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (!mood || availableTime <= 0) {
    return null;
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary animate-pulse" />
            🤖 Sijesyon IA pou Tan Lib ou
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3 text-muted-foreground">IA ap kalkile sijesyon yo...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !suggestions || suggestions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            🤖 Sijesyon IA pou Tan Lib ou
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            Pa gen sijesyon ki disponib kounye a. Eseye ankò nan yon ti moman.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          🤖 Sijesyon IA pou Tan Lib ou
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Bati sou sa ou santi ({mood}), ak {availableTime} minit lib ou.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {suggestions.map((suggestion, index) => {
          const IconComponent = getActivityIcon(suggestion.activities[0]);
          
          return (
            <div
              key={index}
              className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <IconComponent className="h-5 w-5 text-primary" />
                  <Badge 
                    variant="outline" 
                    className={`${priorityColors[suggestion.priority]} text-white border-none`}
                  >
                    {priorityLabels[suggestion.priority]}
                  </Badge>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {suggestion.duration} min
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {suggestion.activities.map((activity, actIndex) => (
                    <span
                      key={actIndex}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                    >
                      {activity}
                    </span>
                  ))}
                </div>
                
                <p className="text-sm text-muted-foreground mt-2">
                  <Zap className="h-4 w-4 inline mr-1" />
                  {suggestion.reason}
                </p>
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button size="sm" className="flex-1">
                  Kòmanse Kounye a
                </Button>
                <Button variant="outline" size="sm">
                  Pwograme pou pi ta
                </Button>
              </div>
            </div>
          );
        })}
        
        {/* Special suggestions for social media */}
        <div className="mt-6 p-4 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20 rounded-lg border">
          <div className="flex items-center gap-2 mb-2">
            <Instagram className="h-5 w-5 text-pink-500" />
            <span className="font-medium text-sm">Sijesyon Espesyal</span>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Sonje ou pa poste sou REV depi 4 jou — ou vle IA ede w prepare 3 caption rapid?
          </p>
          <SocialMediaCaptionDialog brand="REV" daysSinceLastPost={4}>
            <Button 
              size="sm" 
              variant="outline" 
              className="border-pink-200 text-pink-700 hover:bg-pink-50"
            >
              <Instagram className="h-4 w-4 mr-2" />
              Jenere Caption yo
            </Button>
          </SocialMediaCaptionDialog>
        </div>
      </CardContent>
    </Card>
  );
}