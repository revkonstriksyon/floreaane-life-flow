import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Router, Route, Switch } from "wouter";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "@/pages/Index";
import Projects from "@/pages/ProjectsSimple";
import ProjectDetail from "@/pages/ProjectDetailSimple";
import AIAssistant from "./pages/AIAssistantSimple";
import Agenda from "@/pages/AgendaSimple";
import Assets from "@/pages/Assets";
import Contacts from "@/pages/ContactsSimple";
import ContactDetail from "@/pages/ContactDetail";
import Notes from "@/pages/NotesSimple";
import Finances from "@/pages/FinancesSimple";
import Reports from "@/pages/ReportsSimple";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <AuthProvider>
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Sonner />
      <Router>
        <Switch>
          <Route path="/" component={Index} />
          <Route path="/projects" component={Projects} />
          <Route path="/projects/:id" component={ProjectDetail} />
          <Route path="/agenda" component={Agenda} />
          <Route path="/assets" component={Assets} />
          <Route path="/contacts" component={Contacts} />
          <Route path="/contacts/:id" component={ContactDetail} />
          <Route path="/notes" component={Notes} />
          <Route path="/finances" component={Finances} />
          <Route path="/reports" component={Reports} />
          <Route path="/ai-assistant" component={AIAssistant} />
          <Route component={NotFound} />
        </Switch>
      </Router>
    </QueryClientProvider>
  </AuthProvider>
);

export default App;