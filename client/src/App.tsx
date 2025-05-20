import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import AITrainer from "@/pages/ai-trainer";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import MobileNav from "@/components/layout/mobile-nav";
import { useState } from "react";

function Router() {
  return (
    <Switch>
      {/* Add pages below */}
      <Route path="/ai-trainer" component={AITrainer} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <div className="flex flex-col h-screen">
          <Header onMenuClick={toggleMobileMenu} />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar isOpen={mobileMenuOpen} />
            <main className="flex-1 flex flex-col bg-neutral-100 overflow-hidden">
              <Router />
            </main>
          </div>
          <MobileNav />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
