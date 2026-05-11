import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/i18n/LanguageContext";
import NotFound from "@/pages/not-found";

import Dashboard from "@/pages/dashboard";
import Incidents from "@/pages/incidents";
import Roadblocks from "@/pages/roadblocks";
import Events from "@/pages/events";
import Parking from "@/pages/parking";
import Control from "@/pages/control";
import LiveTrafficMap from "@/pages/live-traffic-map";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/incidents" component={Incidents} />
      <Route path="/roadblocks" component={Roadblocks} />
      <Route path="/events" component={Events} />
      <Route path="/parking" component={Parking} />
      <Route path="/control" component={Control} />
      <Route path="/live-map" component={LiveTrafficMap} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <LanguageProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </LanguageProvider>
  );
}

export default App;
