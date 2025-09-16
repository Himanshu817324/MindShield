import { Bell, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="bg-card border-b border-border p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-page-title">Privacy Dashboard</h1>
          <p className="text-muted-foreground" data-testid="text-page-description">
            Monitor and monetize your digital footprint
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            size="icon"
            data-testid="button-notifications"
          >
            <Bell className="h-4 w-4" />
          </Button>
          <Button 
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            data-testid="button-sync-data"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Sync Data
          </Button>
        </div>
      </div>
    </header>
  );
}
