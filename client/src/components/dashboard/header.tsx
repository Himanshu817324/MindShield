
import { Bell, RefreshCw, LogOut, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Header Component
export default function Header() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [isSyncing, setIsSyncing] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);

  const handleSyncData = async () => {
    try {
      setIsSyncing(true);
      
      // Invalidate and refetch all queries to sync data
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] }),
        queryClient.invalidateQueries({ queryKey: ["/api/privacy"] }),
        queryClient.invalidateQueries({ queryKey: ["/api/earnings"] }),
        queryClient.invalidateQueries({ queryKey: ["/api/permissions"] }),
      ]);

      // Refetch all data
      await Promise.all([
        queryClient.refetchQueries({ queryKey: ["/api/dashboard"] }),
        queryClient.refetchQueries({ queryKey: ["/api/privacy"] }),
        queryClient.refetchQueries({ queryKey: ["/api/earnings"] }),
        queryClient.refetchQueries({ queryKey: ["/api/permissions"] }),
      ]);

      toast({
        title: "Data Synced",
        description: "All data has been successfully synchronized.",
      });
    } catch (error) {
      toast({
        title: "Sync Failed",
        description: "Failed to sync data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    setLocation("/login");
  };

  const connectWallet = () => {
    setWalletConnected(!walletConnected);
    toast({
      title: walletConnected ? "Wallet Disconnected" : "Wallet Connected",
      description: walletConnected 
        ? "Your wallet has been disconnected." 
        : "Your wallet has been connected successfully.",
    });
  };

  return (
    <header className="bg-gray-800/30 backdrop-blur-sm border-b border-gray-700 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white" data-testid="text-page-title">
            Privacy Dashboard
          </h1>
          <p className="text-gray-400" data-testid="text-page-description">
            Monitor and monetize your digital footprint
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            size="icon"
            className="border-gray-600 text-gray-300 hover:text-blue-400 hover:border-blue-500/50"
            data-testid="button-notifications"
          >
            <Bell className="h-4 w-4" />
          </Button>
          
          <Button 
            onClick={handleSyncData}
            disabled={isSyncing}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0"
            data-testid="button-sync-data"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Syncing...' : 'Sync Data'}
          </Button>

          <Button
            onClick={connectWallet}
            className={`${
              walletConnected
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                : 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700'
            } text-white border-0`}
          >
            <Wallet className="w-4 h-4 mr-2" />
            {walletConnected ? 'Connected' : 'Connect Wallet'}
          </Button>
          
          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-gray-700/50">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                    {user?.username?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-gray-800/90 backdrop-blur-sm border-gray-700" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none text-white">{user?.username || 'User'}</p>
                  <p className="text-xs leading-none text-gray-400">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-700" />
              <DropdownMenuItem 
                onClick={handleLogout} 
                className="text-red-400 hover:bg-red-500/10 hover:text-red-300 focus:bg-red-500/10"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
