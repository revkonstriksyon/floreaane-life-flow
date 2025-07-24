import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface TimeSlotSuggestion {
  duration: number;
  activities: string[];
  reason: string;
  priority: 'high' | 'medium' | 'low';
}

export interface ProjectInsight {
  status: string;
  nextActions: string[];
  blockers?: string[];
  recommendations: string[];
  estimatedCompletion?: string;
}

export interface WeeklyProgressSummary {
  completedTasks: number;
  pendingTasks: number;
  achievements: string[];
  areasForImprovement: string[];
  nextWeekPriorities: string[];
}

export async function generateTimeSlotSuggestions(
  mood: string,
  availableTime: number,
  currentHour: number,
  recentActivities: string[],
  userContext: any
): Promise<TimeSlotSuggestion[]> {
  try {
    const prompt = `
Gen kretyen ayisyen ki gen ${availableTime} minit lib kounye a (${currentHour}h). 
Mood yo: ${mood}
Aktivite ki fèk fini yo: ${recentActivities.join(', ')}

Bay 3 sijesyon pratik ak relevan nan kreyòl ayisyen pou ki jan yo ka sèvi ak tan sa a.
Konsèye aktivite ki ka ede yo nan devlopman pèsonèl ak pwofesyonèl yo.

Retounen repons lan nan fòma JSON sa a:
{
  "suggestions": [
    {
      "duration": ${availableTime},
      "activities": ["aktivite 1", "aktivite 2"],
      "reason": "poukisa sijesyon sa a bon",
      "priority": "high|medium|low"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            suggestions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  duration: { type: "number" },
                  activities: { type: "array", items: { type: "string" } },
                  reason: { type: "string" },
                  priority: { type: "string", enum: ["high", "medium", "low"] }
                },
                required: ["duration", "activities", "reason", "priority"]
              }
            }
          },
          required: ["suggestions"]
        }
      },
      contents: prompt,
    });

    const result = JSON.parse(response.text || '{"suggestions": []}');
    return result.suggestions;
  } catch (error) {
    console.error('Error generating time slot suggestions:', error);
    return [];
  }
}

export async function analyzeProjectProgress(
  project: any,
  tasks: any[],
  recentActivity: any[]
): Promise<ProjectInsight> {
  try {
    const prompt = `
Analize pwojè sa a nan kreyòl ayisyen:
Pwojè: ${project.name}
Deskripsyon: ${project.shortDescription || 'Pa gen deskripsyon'}
Estati: ${project.status}
Pwogrè: ${project.progress}%
Kantite tâche: ${tasks.length}
Tâche ki fini: ${tasks.filter(t => t.status === 'completed').length}

Aktivite resan yo: ${recentActivity.slice(0, 5).map(a => a.description || a.title).join(', ')}

Bay analiz ak rekòmandasyon nan kreyòl ayisyen. Retounen nan fòma JSON sa a:
{
  "status": "kijan pwojè a ye kounye a",
  "nextActions": ["aksyon 1", "aksyon 2", "aksyon 3"],
  "blockers": ["blokaj 1", "blokaj 2"],
  "recommendations": ["rekòmandasyon 1", "rekòmandasyon 2"],
  "estimatedCompletion": "konbyen tan ki rete"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            status: { type: "string" },
            nextActions: { type: "array", items: { type: "string" } },
            blockers: { type: "array", items: { type: "string" } },
            recommendations: { type: "array", items: { type: "string" } },
            estimatedCompletion: { type: "string" }
          },
          required: ["status", "nextActions", "recommendations"]
        }
      },
      contents: prompt,
    });

    return JSON.parse(response.text || '{"status": "Pa ka analize", "nextActions": [], "recommendations": []}');
  } catch (error) {
    console.error('Error analyzing project progress:', error);
    return {
      status: "Erè nan analiz",
      nextActions: [],
      recommendations: []
    };
  }
}

export async function generateWeeklyProgressSummary(
  completedTasks: any[],
  projects: any[],
  mood_entries: any[]
): Promise<WeeklyProgressSummary> {
  try {
    const prompt = `
Bay yon rezime semèn nan nan kreyòl ayisyen pou itilizatè a:

Tâche ki fini yo semèn sa a: ${completedTasks.length}
Pwojè yo: ${projects.map(p => `${p.name} (${p.progress}%)`).join(', ')}
Mood semèn nan: ${mood_entries.map(m => m.mood).join(', ')}

Retounen analiz ak konsèy nan fòma JSON sa a:
{
  "completedTasks": ${completedTasks.length},
  "pendingTasks": 0,
  "achievements": ["reyèlman sa yo te reyèlize"],
  "areasForImprovement": ["sa yo ka améyore"],
  "nextWeekPriorities": ["sa yo dwe konsantre sou yo semèn kap vini an"]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            completedTasks: { type: "number" },
            pendingTasks: { type: "number" },
            achievements: { type: "array", items: { type: "string" } },
            areasForImprovement: { type: "array", items: { type: "string" } },
            nextWeekPriorities: { type: "array", items: { type: "string" } }
          },
          required: ["completedTasks", "pendingTasks", "achievements", "areasForImprovement", "nextWeekPriorities"]
        }
      },
      contents: prompt,
    });

    return JSON.parse(response.text || '{"completedTasks": 0, "pendingTasks": 0, "achievements": [], "areasForImprovement": [], "nextWeekPriorities": []}');
  } catch (error) {
    console.error('Error generating weekly summary:', error);
    return {
      completedTasks: 0,
      pendingTasks: 0,
      achievements: [],
      areasForImprovement: [],
      nextWeekPriorities: []
    };
  }
}

export async function generateSocialMediaCaptions(
  brand: string,
  recentPosts: string[],
  daysSinceLastPost: number
): Promise<string[]> {
  try {
    const prompt = `
Gen ${daysSinceLastPost} jou depi dènye post sou ${brand}. 
Dènye post yo te ye: ${recentPosts.join(', ')}

Kreye 3 caption rapid nan kreyòl ayisyen ki ka angaje ak konsèy yo bay pou moun yo:
- Yon caption motivasyon 
- Yon caption ak kesyon pou angajman
- Yon caption ak konsèy pratik

Retounen nan fòma JSON:
{
  "captions": ["caption 1", "caption 2", "caption 3"]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            captions: { type: "array", items: { type: "string" } }
          },
          required: ["captions"]
        }
      },
      contents: prompt,
    });

    const result = JSON.parse(response.text || '{"captions": []}');
    return result.captions;
  } catch (error) {
    console.error('Error generating social media captions:', error);
    return [];
  }
}