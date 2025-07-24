
import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Bot, 
  MessageSquare, 
  Brain,
  Lightbulb,
  Target,
  Users,
  DollarSign,
  FileText,
  Calendar,
  Database,
  Send,
  Loader2,
  Sparkles,
  Zap,
  Clock,
  Bell,
  Settings
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { GeminiAI } from "@/lib/gemini";

interface DatabaseData {
  tasks: any[];
  projects: any[];
  contacts: any[];
  transactions: any[];
  assets: any[];
  notes: any[];
}

interface ConversationMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  context?: string;
}

export default function AIAssistant() {
  const [dbData, setDbData] = useState<DatabaseData>({
    tasks: [],
    projects: [],
    contacts: [],
    transactions: [],
    assets: [],
    notes: []
  });
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedContext, setSelectedContext] = useState("general");
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [tasksResult, projectsResult, contactsResult, transactionsResult, assetsResult, notesResult] = await Promise.all([
        supabase.from('tasks').select('*').limit(50),
        supabase.from('projects').select('*').limit(20),
        supabase.from('contacts').select('*').limit(30),
        supabase.from('transactions').select('*').limit(100),
        supabase.from('assets').select('*').limit(50),
        supabase.from('notes').select('*').limit(50)
      ]);

      setDbData({
        tasks: tasksResult.data || [],
        projects: projectsResult.data || [],
        contacts: contactsResult.data || [],
        transactions: transactionsResult.data || [],
        assets: assetsResult.data || [],
        notes: notesResult.data || []
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsDataLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ConversationMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date(),
      context: selectedContext
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      let contextData = "";
      let aiResponse;

      switch (selectedContext) {
        case "tasks":
          contextData = `Tach yo: ${JSON.stringify(dbData.tasks.slice(0, 10), null, 2)}`;
          aiResponse = await GeminiAI.getTaskSuggestions(dbData.tasks);
          break;
        case "projects":
          contextData = `Pwojè yo: ${JSON.stringify(dbData.projects.slice(0, 5), null, 2)}`;
          aiResponse = await GeminiAI.getProjectSuggestions(dbData.projects);
          break;
        case "contacts":
          contextData = `Kontak yo: ${JSON.stringify(dbData.contacts.slice(0, 10), null, 2)}`;
          aiResponse = await GeminiAI.getRelationshipSuggestions(dbData.contacts);
          break;
        case "finances":
          contextData = `Tranzaksyon yo: ${JSON.stringify(dbData.transactions.slice(0, 15), null, 2)}`;
          aiResponse = await GeminiAI.getFinancialSuggestions(dbData.transactions);
          break;
        case "assets":
          contextData = `Byen yo: ${JSON.stringify(dbData.assets.slice(0, 10), null, 2)}`;
          aiResponse = await GeminiAI.getAssetSuggestions(dbData.assets);
          break;
        case "notes":
          contextData = `Nòt yo: ${JSON.stringify(dbData.notes.slice(0, 10), null, 2)}`;
          aiResponse = await GeminiAI.getContentSuggestions(dbData.notes);
          break;
        default:
          contextData = `Done yo: Tach: ${dbData.tasks.length}, Pwojè: ${dbData.projects.length}, Kontak: ${dbData.contacts.length}`;
          aiResponse = await GeminiAI.getGeneralAdvice(`${contextData}\n\nKeksyon: ${input}`);
      }

      const aiMessage: ConversationMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse.text,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: ConversationMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "Padon, mwen pa ka reponn kounye a. Eseye ankò.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    { label: "Rezime jou a", action: "Bay m yon rezime sou sa m gen pou fè jou a", icon: Clock },
    { label: "Priyorite yo", action: "Ki sa ki pi ijan nan tout bagay mwen gen pou fè?", icon: Target },
    { label: "Rapèl yo", action: "Ki rapèl mwen bezwen pou semèn nan?", icon: Bell },
    { label: "Analiz finansye", action: "Ki jan depans mwen ye dènye mwa a?", icon: DollarSign },
    { label: "Kontak pou rele", action: "Ki moun mwen bezwen kontakte?", icon: Users },
    { label: "Pwojè ki reta", action: "Ki pwojè ki bezwen atansyon?", icon: Zap }
  ];

  if (isDataLoading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <main className="flex-1 overflow-auto flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Prepare asistan AI a...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-border/50 bg-card/30 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent flex items-center gap-2">
                <Bot className="h-7 w-7 text-primary" />
                Asistan AI Entelijan
              </h1>
              <p className="text-muted-foreground mt-1">
                Gid pèsonèl ou ak aksè nan tout done yo
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Select value={selectedContext} onValueChange={setSelectedContext}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">Jeneral</SelectItem>
                  <SelectItem value="tasks">Tach yo</SelectItem>
                  <SelectItem value="projects">Pwojè yo</SelectItem>
                  <SelectItem value="contacts">Kontak yo</SelectItem>
                  <SelectItem value="finances">Finans</SelectItem>
                  <SelectItem value="assets">Byen yo</SelectItem>
                  <SelectItem value="notes">Nòt yo</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Konfigire
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Target className="h-6 w-6 mx-auto mb-2 text-blue-500" />
              <p className="text-sm text-muted-foreground">Tach</p>
              <p className="text-xl font-bold">{dbData.tasks.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Lightbulb className="h-6 w-6 mx-auto mb-2 text-green-500" />
              <p className="text-sm text-muted-foreground">Pwojè</p>
              <p className="text-xl font-bold">{dbData.projects.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="h-6 w-6 mx-auto mb-2 text-purple-500" />
              <p className="text-sm text-muted-foreground">Kontak</p>
              <p className="text-xl font-bold">{dbData.contacts.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <DollarSign className="h-6 w-6 mx-auto mb-2 text-emerald-500" />
              <p className="text-sm text-muted-foreground">Tranzaksyon</p>
              <p className="text-xl font-bold">{dbData.transactions.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Database className="h-6 w-6 mx-auto mb-2 text-orange-500" />
              <p className="text-sm text-muted-foreground">Byen</p>
              <p className="text-xl font-bold">{dbData.assets.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <FileText className="h-6 w-6 mx-auto mb-2 text-pink-500" />
              <p className="text-sm text-muted-foreground">Nòt</p>
              <p className="text-xl font-bold">{dbData.notes.length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Aksyon Rapid
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {quickActions.map((action, index) => {
                    const IconComponent = action.icon;
                    return (
                      <Button
                        key={index}
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => setInput(action.action)}
                      >
                        <IconComponent className="h-4 w-4 mr-2" />
                        {action.label}
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Chat Interface */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Konvèsasyon ak AI
                  <Badge variant="outline" className="ml-auto">
                    {selectedContext === "general" ? "Jeneral" : 
                     selectedContext === "tasks" ? "Tach yo" :
                     selectedContext === "projects" ? "Pwojè yo" :
                     selectedContext === "contacts" ? "Kontak yo" :
                     selectedContext === "finances" ? "Finans" :
                     selectedContext === "assets" ? "Byen yo" : "Nòt yo"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 flex flex-col h-96">
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.length === 0 && (
                      <div className="text-center py-12">
                        <Bot className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                        <h3 className="text-lg font-semibold mb-2">Bonjou! Mwen se asistan ou</h3>
                        <p className="text-muted-foreground">
                          Mwen gen aksè nan tout done ou yo. Ki sa ou vle konnen oswa fè?
                        </p>
                      </div>
                    )}

                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        {message.type === 'ai' && (
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Bot className="h-4 w-4 text-primary" />
                          </div>
                        )}
                        
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            message.type === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          <p className="text-xs opacity-70 mt-2">
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>

                        {message.type === 'user' && (
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-medium">Ou</span>
                          </div>
                        )}
                      </div>
                    ))}

                    {isLoading && (
                      <div className="flex gap-3 justify-start">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Bot className="h-4 w-4 text-primary" />
                        </div>
                        <div className="bg-muted p-3 rounded-lg">
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Tape kesyon ou oswa aksyon ou vle fè..."
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!input.trim() || isLoading}
                      size="sm"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
