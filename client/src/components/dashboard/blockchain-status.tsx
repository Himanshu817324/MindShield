import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Link, File, Fuel, Wallet, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useWeb3 } from "@/contexts/Web3Context";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";

const CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3'; // Will be updated after deployment

export default function BlockchainStatus() {
  const { toast } = useToast();
  const { account, connectWallet, isConnected, isLoading: walletLoading, error: walletError } = useWeb3();
  const [isProcessing, setIsProcessing] = useState(false);

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

  const registerUserMutation = useMutation({
    mutationFn: async (data: { username: string; walletAddress: string }) => {
      const response = await apiRequest("POST", "/api/blockchain/register", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: "User registered on blockchain successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to register user on blockchain",
        variant: "destructive",
      });
    },
  });

  const grantAccessMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/blockchain/grant-access", data);
      return response.json();
    },
    onSuccess: (data) => {
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
    onSuccess: (data) => {
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

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Blockchain Status</h3>
          {isConnected ? (
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm text-green-600">Connected</span>
            </div>
          ) : (
            <Button
              onClick={handleConnectWallet}
              disabled={walletLoading}
              className="flex items-center space-x-2"
            >
              <Wallet className="w-4 h-4" />
              <span>{walletLoading ? "Connecting..." : "Connect Wallet"}</span>
            </Button>
          )}
        </div>

        {!isConnected ? (
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              Connect your wallet to interact with the blockchain
            </p>
            {walletError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600 mb-2">
                  <strong>Wallet Error:</strong> {walletError}
                </p>
                <div className="text-xs text-red-500 space-y-2">
                  <p>You can still use other app features without a wallet. Install MetaMask to unlock blockchain features.</p>
                  <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded">
                    <p className="font-medium text-blue-800 mb-1">Why We Need Your Wallet:</p>
                    <ul className="text-blue-700 space-y-1">
                      <li>• Prove data ownership and control access</li>
                      <li>• Receive transparent payments for your data</li>
                      <li>• Execute smart contracts automatically</li>
                      <li>• Keep immutable records on blockchain</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
            <Button onClick={handleConnectWallet} disabled={walletLoading}>
              {walletLoading ? "Connecting..." : "Connect Wallet"}
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 border border-border rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {blockchainEarnings?.earnings || "0.00"} ETH
                </div>
                <div className="text-sm text-muted-foreground">Total Earnings</div>
              </div>
              <div className="text-center p-4 border border-border rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {blockchainLicenses?.licenses?.length || 0}
                </div>
                <div className="text-sm text-muted-foreground">Active Licenses</div>
              </div>
              <div className="text-center p-4 border border-border rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : "N/A"}
                </div>
                <div className="text-sm text-muted-foreground">Wallet Address</div>
              </div>
            </div>

            {/* Wallet Information */}
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg mb-4">
              <h4 className="font-medium text-green-800 mb-2">✅ Your Wallet is Securely Connected</h4>
              <div className="text-sm text-green-700 space-y-1">
                <p><strong>What we store:</strong> Only your public wallet address and transaction hashes</p>
                <p><strong>What we don't store:</strong> Your private keys, seed phrase, or personal data</p>
                <p><strong>Your control:</strong> You can disconnect anytime and revoke all permissions</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center space-x-3">
                  <File className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">DataLicense Contract</div>
                    <div className="text-sm text-muted-foreground">
                      {CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000" 
                        ? "Not Deployed" 
                        : `${CONTRACT_ADDRESS.slice(0, 6)}...${CONTRACT_ADDRESS.slice(-4)}`}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Link className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">View</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Fuel className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Network</div>
                    <div className="text-sm text-muted-foreground">Polygon Mumbai</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600">Active</span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-4 border border-border rounded-lg">
              <h4 className="font-medium mb-2">Smart Contract Functions</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <Button 
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={handleGrantAccess}
                  disabled={grantAccessMutation.isPending}
                  data-testid="button-grant-access-blockchain"
                >
                  {grantAccessMutation.isPending ? "Processing..." : "Grant Access"}
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleRevokeAccess}
                  disabled={revokeAccessMutation.isPending}
                  data-testid="button-revoke-access-blockchain"
                >
                  {revokeAccessMutation.isPending ? "Processing..." : "Revoke Access"}
                </Button>
                <Button 
                  className="bg-green-600 text-white hover:bg-green-700"
                  onClick={handlePayUser}
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
