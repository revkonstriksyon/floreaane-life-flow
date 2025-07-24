import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Router, Route, Switch } from "wouter";
import Index from "./pages/Index";
import Agenda from "./pages/Agenda";
import Projects from "./pages/Projects";
import Assets from "./pages/Assets";
import Contacts from "./pages/Contacts";
import Finances from "./pages/Finances";
import Notes from "./pages/Notes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Toaster />
    <Sonner />
    <Router>
      <Switch>
        <Route path="/" component={Index} />
        <Route path="/agenda" component={Agenda} />
        <Route path="/projects" component={Projects} />
        <Route path="/assets" component={Assets} />
        <Route path="/contacts" component={Contacts} />
        <Route path="/finances" component={Finances} />
        <Route path="/notes" component={Notes} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  </QueryClientProvider>
);

export default App;
