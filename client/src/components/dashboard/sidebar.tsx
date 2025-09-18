import { Shield, BarChart3, ShieldCheck, Coins, Settings, LogOut } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

export default function Sidebar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { path: "/dashboard", icon: BarChart3, label: "Dashboard", testId: "link-dashboard" },
    { path: "/privacy", icon: ShieldCheck, label: "Privacy Control", testId: "link-privacy-control" },
    { path: "/earnings", icon: Coins, label: "Earnings", testId: "link-earnings" },
    { path: "/settings", icon: Settings, label: "Settings", testId: "link-settings" },
  ];

  const handleNavClick = (path: string) => {
    // Navigate to the specific page
    window.location.href = path;
  };

  return (
    <aside className="w-64 bg-card border-r border-border shadow-sm">
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Shield className="text-primary-foreground text-sm" />
          </div>
          <span className="text-xl font-bold text-primary">MindShield</span>
        </div>
      </div>
      
      <nav className="p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path || (item.path === "/dashboard" && location === "/");
          
          return (
            <button
              key={item.path}
              onClick={() => handleNavClick(item.path)}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg w-full text-left transition-colors ${
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:bg-secondary"
              }`}
              data-testid={item.testId}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
      
      <div className="mt-auto p-4">
        <div className="bg-secondary rounded-lg p-3">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-primary-foreground font-semibold text-sm">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate" data-testid="text-username">
                {user?.username || 'User'}
              </p>
              <p className="text-xs text-muted-foreground truncate" data-testid="text-email">
                {user?.email || 'user@example.com'}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={logout}
            className="w-full text-xs"
            data-testid="button-logout"
          >
            <LogOut className="w-3 h-3 mr-1" />
            Logout
          </Button>
        </div>
      </div>
    </aside>
  );
}
