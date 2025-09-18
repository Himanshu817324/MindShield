import { Shield, BarChart3, ShieldCheck, Coins, Settings, LogOut, History } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

export default function Sidebar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { path: "/dashboard", icon: BarChart3, label: "Dashboard", testId: "link-dashboard" },
    { path: "/privacy", icon: ShieldCheck, label: "Privacy Control", testId: "link-privacy-control" },
    { path: "/earnings", icon: Coins, label: "Earnings", testId: "link-earnings" },
    { path: "/consent-history", icon: History, label: "Consent History", testId: "link-consent-history" },
    { path: "/settings", icon: Settings, label: "Settings", testId: "link-settings" },
  ];

  const handleNavClick = (path: string) => {
    // Navigate to the specific page
    window.location.href = path;
  };

  return (
    <aside className="w-64 bg-gray-800/50 backdrop-blur-sm border-r border-gray-700 flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            MindShield
          </span>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path || (item.path === "/dashboard" && location === "/");
            
            return (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg w-full text-left transition-all duration-200 ${
                  isActive 
                    ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-blue-400" 
                    : "text-gray-300 hover:text-blue-400 hover:bg-gray-700/50"
                }`}
                data-testid={item.testId}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
      
      {/* User Section */}
      <div className="p-4 border-t border-gray-700">
        <div className="bg-gray-700/30 rounded-lg p-3 border border-gray-600/50">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-semibold text-sm">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate text-white" data-testid="text-username">
                {user?.username || 'User'}
              </p>
              <p className="text-xs text-gray-400 truncate" data-testid="text-email">
                {user?.email || 'user@example.com'}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={logout}
            className="w-full text-xs border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300"
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
