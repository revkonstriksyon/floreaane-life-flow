import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Router, Route, Switch } from "wouter";
import Index from "@/pages/Index";
import Projects from "@/pages/Projects";
import ProjectDetail from "@/pages/ProjectDetail";
import Agenda from "@/pages/Agenda";
import Assets from "@/pages/Assets";
import Contacts from "@/pages/Contacts";
import ContactDetail from "@/pages/ContactDetail";
import Notes from "@/pages/Notes";
import Finances from "@/pages/Finances";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
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
        <Route component={NotFound} />
      </Switch>
    </Router>
  </QueryClientProvider>
);

export default App;