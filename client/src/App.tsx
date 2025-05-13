import { Switch, Route, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "@/pages/dashboard";
import SalesFunnel from "@/pages/sales-funnel";
import Clients from "@/pages/clients";
import Calendar from "@/pages/calendar";
import Procedures from "@/pages/procedures";
import Reports from "@/pages/reports";
import Configuracoes from "@/pages/configuracoes";
import Login from "@/pages/login";
import NotFound from "@/pages/not-found";
import { useAuth } from "./providers/auth-provider";
import { Sidebar } from "./components/sidebar";
import { useEffect } from "react";

function App() {
  const { user, isLoading } = useAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !user && location !== "/login") {
      setLocation("/login");
    }

    // Redirect to dashboard if authenticated and at login page
    if (!isLoading && user && location === "/login") {
      setLocation("/");
    }
  }, [user, isLoading, location, setLocation]);

  // Show loading indicator
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-background">
        <div className="h-16 w-16 animate-spin rounded-full border-t-4 border-primary"></div>
      </div>
    );
  }

  // Main application layout for authenticated users
  if (user && location !== "/login") {
    return (
      <TooltipProvider>
        <div className="flex h-screen overflow-hidden bg-background">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <main className="flex-1 overflow-y-auto">
              <Switch>
                <Route path="/" component={Dashboard} />
                <Route path="/funil-vendas" component={SalesFunnel} />
                <Route path="/clientes" component={Clients} />
                <Route path="/agenda" component={Calendar} />
                <Route path="/procedimentos" component={Procedures} />
                <Route path="/relatorios" component={Reports} />
                <Route path="/configuracoes" component={Configuracoes} />
                <Route path="/ajuda" component={NotFound} />
                <Route component={NotFound} />
              </Switch>
            </main>
          </div>
        </div>
        <Toaster />
      </TooltipProvider>
    );
  }

  // Login route for unauthenticated users
  return (
    <TooltipProvider>
      <Switch>
        <Route path="/login" component={Login} />
        <Route component={Login} />
      </Switch>
      <Toaster />
    </TooltipProvider>
  );
}

export default App;
