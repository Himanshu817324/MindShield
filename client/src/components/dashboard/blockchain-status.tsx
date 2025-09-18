import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, File, Fuel, Wallet, AlertCircle, Database, Zap, Lock, Copy, ExternalLink, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useWeb3 } from "@/contexts/Web3Context";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";

const CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000' as string; // Will be updated after deployment

export default function BlockchainStatus() {
  const { toast } = useToast();
  const { account, connectWallet, isConnected, isLoading: walletLoading, error: walletError } = useWeb3();
  const [refreshing, setRefreshing] = useState(false);

  // Get blockchain earnings
  const { data: blockchainEarnings } = useQuery({
    queryKey: ["/api/blockchain/earnings", account],
    enabled: !!account,
  });

  // Get blockchain licenses
  const { data: blockchainLicenses } = useQuery({
    queryKey: ["/api/blockchain/licenses", account],
    enabled: !!account,
  });

  const grantAccessMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/blockchain/grant-access", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Access granted on blockchain successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to grant access on blockchain",
        variant: "destructive",
      });
    },
  });

  const revokeAccessMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/blockchain/revoke-access", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Access revoked on blockchain successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to revoke access on blockchain",
        variant: "destructive",
      });
    },
  });

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
      // If there's an error, it will be displayed in the UI, no need for toast
    } catch (error: any) {
      // Only show toast for unexpected errors, not MetaMask not installed
      if (!error.message?.includes('MetaMask is not installed')) {
        toast({
          title: "Error",
          description: error.message || "Failed to connect wallet",
          variant: "destructive",
        });
      }
    }
  };

  const handleGrantAccess = async () => {
    if (!account) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet first.",
        variant: "destructive",
      });
      return;
    }

    // Example: Grant access to a company
    const companyAddress = "0x1234567890123456789012345678901234567890"; // This would come from a form
    const dataTypes = "location,behavior,preferences";
    const monthlyPayment = "0.1"; // 0.1 ETH
    const durationMonths = 12;

    grantAccessMutation.mutate({
      companyAddress,
      dataTypes,
      monthlyPayment,
      durationMonths,
      walletAddress: account,
    });
  };

  const handleRevokeAccess = async () => {
    if (!account) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet first.",
        variant: "destructive",
      });
      return;
    }

    // Example: Revoke access from a company
    const companyAddress = "0x1234567890123456789012345678901234567890"; // This would come from a form

    revokeAccessMutation.mutate({
      companyAddress,
      walletAddress: account,
    });
  };

  const handlePayUser = () => {
    toast({
      title: "Process Payment",
      description: "Smart contract payment function would be called here.",
    });
  };

  const refresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    toast({
      title: "Copied",
      description: "Address copied to clipboard",
    });
  };

  return (
    <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Database className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white">Blockchain Status</h3>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={refresh}
              disabled={refreshing}
              className="border-gray-600 text-gray-300 hover:text-cyan-400 hover:border-cyan-500/50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            {isConnected ? (
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-sm text-green-400 font-medium">Connected</span>
              </div>
            ) : (
              <Button
                onClick={handleConnectWallet}
                disabled={walletLoading}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0"
              >
                <Wallet className="w-4 h-4 mr-2" />
                <span>{walletLoading ? "Connecting..." : "Connect Wallet"}</span>
              </Button>
            )}
          </div>
        </div>

        {!isConnected ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-300 mb-4 text-lg font-medium">
              Connect your wallet to interact with the blockchain
            </p>
            {walletError && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-sm text-red-400 mb-3">
                  <strong>Wallet Error:</strong> {walletError}
                </p>
                <div className="text-xs text-red-300 space-y-2 text-left">
                  <p>You can still use other app features without a wallet. Install MetaMask to unlock blockchain features.</p>
                  <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded">
                    <p className="font-medium text-blue-300 mb-2">Why We Need Your Wallet:</p>
                    <ul className="text-blue-400 space-y-1">
                      <li>• Prove data ownership and control access</li>
                      <li>• Receive transparent payments for your data</li>
                      <li>• Execute smart contracts automatically</li>
                      <li>• Keep immutable records on blockchain</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
            <Button 
              onClick={handleConnectWallet} 
              disabled={walletLoading}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0"
            >
              {walletLoading ? "Connecting..." : "Connect Wallet"}
            </Button>
          </div>
        ) : (
          <>
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Wallet className="w-5 h-5 text-green-400" />
                  <span className="text-green-400 font-semibold">Total Earnings</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {(blockchainEarnings as any)?.earnings || "0.00"} ETH
                </div>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <File className="w-5 h-5 text-blue-400" />
                  <span className="text-blue-400 font-semibold">Active Licenses</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {(blockchainLicenses as any)?.licenses?.length || 0}
                </div>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Lock className="w-5 h-5 text-purple-400" />
                  <span className="text-purple-400 font-semibold">Wallet Address</span>
                </div>
                <div className="text-lg font-bold text-white flex items-center">
                  {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : "N/A"}
                  {account && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyAddress(account)}
                      className="ml-2 p-1 h-auto hover:bg-purple-500/20"
                    >
                      <Copy className="w-4 h-4 text-purple-400" />
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Security Information */}
            <div className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg mb-6">
              <h4 className="font-semibold text-green-400 mb-3 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Your Wallet is Securely Connected
              </h4>
              <div className="text-sm text-green-300 space-y-2">
                <p><strong>What we store:</strong> Only your public wallet address and transaction hashes</p>
                <p><strong>What we don't store:</strong> Your private keys, seed phrase, or personal data</p>
                <p><strong>Your control:</strong> You can disconnect anytime and revoke all permissions</p>
              </div>
            </div>

            {/* Network Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-gray-700/30 border border-gray-600 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <File className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="font-medium text-white">DataLicense Contract</div>
                      <div className="text-sm text-gray-400 font-mono">
                        {CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000" 
                          ? "Not Deployed" 
                          : `${CONTRACT_ADDRESS.slice(0, 6)}...${CONTRACT_ADDRESS.slice(-4)}`}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" className="p-1 h-auto hover:bg-gray-600/50">
                      <Copy className="w-4 h-4 text-gray-400" />
                    </Button>
                    <Button variant="ghost" size="sm" className="p-1 h-auto hover:bg-gray-600/50">
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-700/30 border border-gray-600 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Fuel className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="font-medium text-white">Network</div>
                      <div className="text-sm text-gray-400">Polygon Mumbai</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-green-400 font-medium">Active</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Smart Contract Functions */}
            <div className="p-4 bg-gray-700/30 border border-gray-600 rounded-lg">
              <div className="flex items-center space-x-2 mb-4">
                <Zap className="w-5 h-5 text-yellow-400" />
                <h4 className="font-medium text-white">Smart Contract Functions</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Button 
                  onClick={handleGrantAccess}
                  disabled={grantAccessMutation.isPending}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0"
                  data-testid="button-grant-access-blockchain"
                >
                  {grantAccessMutation.isPending ? "Processing..." : "Grant Access"}
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleRevokeAccess}
                  disabled={revokeAccessMutation.isPending}
                  className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                  data-testid="button-revoke-access-blockchain"
                >
                  {revokeAccessMutation.isPending ? "Processing..." : "Revoke Access"}
                </Button>
                <Button 
                  onClick={handlePayUser}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0"
                  data-testid="button-pay-user-blockchain"
                >
                  Process Payment
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}