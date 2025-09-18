import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Web3Provider } from "@/contexts/Web3Context";
import ProtectedRoute from "@/components/ProtectedRoute";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Earnings from "@/pages/earnings";
import Settings from "@/pages/settings";
import Checkout from "@/pages/checkout";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Landing from "@/pages/landing";
import PrivacyEnhanced from "@/pages/privacy-enhanced";
import ConsentHistory from "@/pages/consent-history";
import FAQ from "@/pages/faq";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();
  
  console.log('🔄 Router: isAuthenticated =', isAuthenticated, 'isLoading =', isLoading);

  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/faq" component={FAQ} />
      
      {/* Landing page for non-authenticated users */}
      <Route path="/">
        {isAuthenticated ? <Redirect to="/dashboard" /> : <Landing />}
      </Route>
      
      {/* Protected routes */}
      <Route path="/dashboard">
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      </Route>
      
      <Route path="/privacy">
        <ProtectedRoute>
          <PrivacyEnhanced />
        </ProtectedRoute>
      </Route>
      
      <Route path="/consent-history">
        <ProtectedRoute>
          <ConsentHistory />
        </ProtectedRoute>
      </Route>
      
      <Route path="/earnings">
        <ProtectedRoute>
          <Earnings />
        </ProtectedRoute>
      </Route>
      
      <Route path="/settings">
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      </Route>
      
      <Route path="/checkout">
        <ProtectedRoute>
          <Checkout />
        </ProtectedRoute>
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Web3Provider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </Web3Provider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
