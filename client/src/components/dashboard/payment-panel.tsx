import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { History, TrendingUp, Wallet, Download, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

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

// PaymentPanel Component
export default function PaymentPanel({ earningsData }: PaymentPanelProps) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  const availableBalance = earningsData?.availableBalance || 2450;
  const pendingPayments = earningsData?.pendingPayments || 850;

  const handleWithdraw = () => {
    const minAmount = 5000; // ₹50.00 in paise
    
    if (availableBalance <= 0) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have any available balance to withdraw.",
        variant: "destructive",
      });
      return;
    }
    
    if (availableBalance < minAmount) {
      toast({
        title: "Minimum Amount Required",
        description: `Minimum withdrawal amount is ₹${minAmount / 100}. You have ₹${(availableBalance / 100).toFixed(2)} available.`,
        variant: "destructive",
      });
      return;
    }
    
    // Store withdrawal amount in localStorage for checkout page
    localStorage.setItem('withdrawalAmount', availableBalance.toString());
    
    // Navigate to checkout page
    setLocation(`/checkout?amount=${availableBalance}`);
  };

  const recentTransactions = [
    { description: "TechCorp Payment", amount: 350, type: "credit" },
    { description: "Bank Withdrawal", amount: -2000, type: "debit" },
    { description: "ShopMart Payment", amount: 520, type: "credit" },
  ];

  return (
    <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
      <CardContent className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-white">Payment & Withdrawals</h3>
        </div>
        
        <div className="space-y-4">
          {/* Balance Cards */}
          <div className="grid grid-cols-1 gap-4">
            <div className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  <span className="text-sm text-green-300">Available Balance</span>
                </div>
                <span 
                  className="text-xl font-bold text-green-400" 
                  data-testid="text-available-balance"
                >
                  ₹{availableBalance.toLocaleString()}
                </span>
              </div>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-lg">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <History className="w-5 h-5 text-yellow-400" />
                  <span className="text-sm text-yellow-300">Pending Payments</span>
                </div>
                <span 
                  className="text-xl font-bold text-yellow-400" 
                  data-testid="text-pending-payments"
                >
                  ₹{pendingPayments.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0 font-medium"
              onClick={handleWithdraw}
              data-testid="button-withdraw"
            >
              <Download className="mr-2 h-4 w-4" />
              Withdraw to Bank Account
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full font-medium border-gray-600 text-gray-300 hover:text-blue-400 hover:border-blue-500/50"
              data-testid="button-view-transactions"
            >
              <History className="mr-2 h-4 w-4" />
              View Transaction History
            </Button>
          </div>
          
          {/* Recent Transactions */}
          <div className="pt-4 border-t border-gray-700">
            <h4 className="font-medium mb-3 text-white">Recent Transactions</h4>
            <div className="space-y-2">
              {recentTransactions.map((transaction, index) => (
                <div 
                  key={index}
                  className="flex justify-between items-center p-2 bg-gray-700/30 rounded-lg border border-gray-600/50"
                  data-testid={`transaction-${index}`}
                >
                  <span className="text-gray-300">{transaction.description}</span>
                  <div className="flex items-center space-x-1">
                    {transaction.type === 'credit' ? (
                      <ArrowUpRight className="w-4 h-4 text-green-400" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-red-400" />
                    )}
                    <span 
                      className={`font-mono font-medium ${
                        transaction.type === 'credit' ? 'text-green-400' : 'text-red-400'
                      }`}
                    >
                      {transaction.type === 'credit' ? '+' : ''}₹{Math.abs(transaction.amount).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
