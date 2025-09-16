import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Link, File, Fuel } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function BlockchainStatus() {
  const { toast } = useToast();

  const handleGrantAccess = () => {
    toast({
      title: "Grant Access",
      description: "Smart contract function would be called here.",
    });
  };

  const handleRevokeAccess = () => {
    toast({
      title: "Revoke Access",
      description: "Smart contract function would be called here.",
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
          <h3 className="text-lg font-semibold">Blockchain Integration Status</h3>
          <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full flex items-center">
            <CheckCircle className="mr-1 h-4 w-4" />
            Connected
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-secondary rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Link className="text-primary h-4 w-4" />
              <span className="font-medium">Network</span>
            </div>
            <p className="text-sm text-muted-foreground" data-testid="text-network">
              Polygon Mumbai Testnet
            </p>
          </div>
          
          <div className="p-4 bg-secondary rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <File className="text-primary h-4 w-4" />
              <span className="font-medium">Smart Contract</span>
            </div>
            <p className="text-sm text-muted-foreground font-mono" data-testid="text-contract-address">
              0x1234...5678
            </p>
          </div>
          
          <div className="p-4 bg-secondary rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Fuel className="text-primary h-4 w-4" />
              <span className="font-medium">Gas Fee</span>
            </div>
            <p className="text-sm text-muted-foreground" data-testid="text-gas-fee">
              ~$0.02 MATIC
            </p>
          </div>
        </div>
        
        <div className="mt-4 p-4 border border-border rounded-lg">
          <h4 className="font-medium mb-2">Smart Contract Functions</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <Button 
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleGrantAccess}
              data-testid="button-grant-access-blockchain"
            >
              Grant Access
            </Button>
            <Button 
              variant="outline"
              onClick={handleRevokeAccess}
              data-testid="button-revoke-access-blockchain"
            >
              Revoke Access
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
      </CardContent>
    </Card>
  );
}
