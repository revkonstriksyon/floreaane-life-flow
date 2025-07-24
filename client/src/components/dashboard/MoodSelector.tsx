import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const moods = [
  { id: "depressed", label: "Tris", emoji: "😔", color: "bg-destructive" },
  { id: "tired", label: "Fatige", emoji: "😴", color: "bg-muted" },
  { id: "normal", label: "Nòmal", emoji: "😐", color: "bg-secondary" },
  { id: "inspired", label: "Enspire", emoji: "✨", color: "bg-warning" },
  { id: "excited", label: "Eksite", emoji: "🚀", color: "bg-accent" },
  { id: "happy", label: "Kontan", emoji: "😊", color: "bg-success" },
];

interface MoodSelectorProps {
  onMoodSelect?: (mood: string) => void;
  selectedMood?: string;
}

export function MoodSelector({ onMoodSelect, selectedMood: initialMood }: MoodSelectorProps) {
  const [selectedMood, setSelectedMood] = useState<string | null>(initialMood || null);
  const [note, setNote] = useState("");
  const { toast } = useToast();

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    if (onMoodSelect) {
      onMoodSelect(mood);
    }
  };

  const handleMoodSubmit = () => {
    if (!selectedMood) return;
    
    toast({
      title: "Mood Anrejistre ✨",
      description: `Ou santi w ${moods.find(m => m.id === selectedMood)?.label.toLowerCase()} jodi a!`,
    });
    
    if (onMoodSelect) {
      onMoodSelect(selectedMood);
    }
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">🧠</span>
          Kiman ou santi w jodi a?
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {moods.map((mood) => (
            <Button
              key={mood.id}
              variant={selectedMood === mood.id ? "default" : "outline"}
              size="sm"
              className={`flex flex-col items-center gap-1 h-auto py-3 ${
                selectedMood === mood.id ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => handleMoodSelect(mood.id)}
            >
              <span className="text-2xl">{mood.emoji}</span>
              <span className="text-xs">{mood.label}</span>
            </Button>
          ))}
        </div>
        
        <Textarea
          placeholder="Kisa ki fè w santi w konsa? (Opsyonèl)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="min-h-[80px] bg-background/50"
        />
        
        <Button 
          onClick={handleMoodSubmit}
          disabled={!selectedMood}
          className="w-full"
          variant="default"
        >
          Anrejistre Mood Mwen
        </Button>
      </CardContent>
    </Card>
  );
}