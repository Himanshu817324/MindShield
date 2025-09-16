import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, History } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface PaymentPanelProps {
  earningsData?: {
    availableBalance: number;
    pendingPayments: number;
    transactions: Array<{
      id: string;
      amount: number;
      status: string;
      createdAt: string;
    }>;
  };
}

export default function PaymentPanel({ earningsData }: PaymentPanelProps) {
  const { toast } = useToast();
  
  const availableBalance = earningsData?.availableBalance || 2450;
  const pendingPayments = earningsData?.pendingPayments || 850;

  const withdrawMutation = useMutation({
    mutationFn: (amount: number) =>
      apiRequest("POST", "/api/earnings/pay", { amount }),
    onSuccess: async (response) => {
      const result = await response.json();
      if (result.checkoutUrl) {
        window.open(result.checkoutUrl, '_blank');
      }
      toast({
        title: "Withdrawal Initiated",
        description: "Your withdrawal request has been processed.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to initiate withdrawal. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleWithdraw = () => {
    if (availableBalance <= 0) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have any available balance to withdraw.",
        variant: "destructive",
      });
      return;
    }
    withdrawMutation.mutate(availableBalance);
  };

  const recentTransactions = [
    { description: "TechCorp Payment", amount: 350, type: "credit" },
    { description: "Bank Withdrawal", amount: -2000, type: "debit" },
    { description: "ShopMart Payment", amount: 520, type: "credit" },
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-6">Payment & Withdrawals</h3>
        
        <div className="space-y-4">
          <div className="p-4 bg-secondary rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Available Balance</span>
              <span 
                className="font-bold text-green-600" 
                data-testid="text-available-balance"
              >
                ₹{availableBalance.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Pending Payments</span>
              <span 
                className="font-medium" 
                data-testid="text-pending-payments"
              >
                ₹{pendingPayments.toLocaleString()}
              </span>
            </div>
          </div>
          
          <div className="space-y-3">
            <Button 
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
              onClick={handleWithdraw}
              disabled={withdrawMutation.isPending}
              data-testid="button-withdraw"
            >
              <CreditCard className="mr-2 h-4 w-4" />
              {withdrawMutation.isPending ? "Processing..." : "Withdraw to Bank Account"}
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full font-medium"
              data-testid="button-view-transactions"
            >
              <History className="mr-2 h-4 w-4" />
              View Transaction History
            </Button>
          </div>
          
          <div className="pt-4 border-t border-border">
            <h4 className="font-medium mb-3">Recent Transactions</h4>
            <div className="space-y-2">
              {recentTransactions.map((transaction, index) => (
                <div 
                  key={index}
                  className="flex justify-between items-center text-sm"
                  data-testid={`transaction-${index}`}
                >
                  <span>{transaction.description}</span>
                  <span 
                    className={`font-mono ${
                      transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {transaction.type === 'credit' ? '+' : ''}₹{Math.abs(transaction.amount).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
