import { Shield, BarChart3, ShieldCheck, Coins, Settings } from "lucide-react";

export default function Sidebar() {
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
        <a 
          href="/" 
          className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-primary text-primary-foreground"
          data-testid="link-dashboard"
        >
          <BarChart3 className="w-5 h-5" />
          <span>Dashboard</span>
        </a>
        <a 
          href="#" 
          className="flex items-center space-x-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-secondary"
          data-testid="link-privacy-control"
        >
          <ShieldCheck className="w-5 h-5" />
          <span>Privacy Control</span>
        </a>
        <a 
          href="#" 
          className="flex items-center space-x-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-secondary"
          data-testid="link-earnings"
        >
          <Coins className="w-5 h-5" />
          <span>Earnings</span>
        </a>
        <a 
          href="#" 
          className="flex items-center space-x-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-secondary"
          data-testid="link-settings"
        >
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </a>
      </nav>
      
      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-secondary rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-semibold">AK</span>
            </div>
            <div>
              <p className="font-medium" data-testid="text-username">Arjun Kumar</p>
              <p className="text-sm text-muted-foreground" data-testid="text-email">arjun@example.com</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
