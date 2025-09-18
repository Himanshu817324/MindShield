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
import Privacy from "@/pages/privacy";
import Earnings from "@/pages/earnings";
import Settings from "@/pages/settings";
import Checkout from "@/pages/checkout";
import Login from "@/pages/login";
import Register from "@/pages/register";

function Router() {
  const { isAuthenticated } = useAuth();

  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      
      {/* Redirect root to dashboard if authenticated, otherwise to login */}
      <Route path="/">
        {isAuthenticated ? <Redirect to="/dashboard" /> : <Redirect to="/login" />}
      </Route>
      
      {/* Protected routes */}
      <Route path="/dashboard">
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      </Route>
      
      <Route path="/privacy">
        <ProtectedRoute>
          <Privacy />
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
