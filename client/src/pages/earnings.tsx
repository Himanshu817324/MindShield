import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/dashboard/sidebar";
import Header from "@/components/dashboard/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coins, TrendingUp, Calendar, DollarSign, CreditCard, Download } from "lucide-react";
import EarningsCalculator from "@/components/dashboard/earnings-calculator";
import PaymentPanel from "@/components/dashboard/payment-panel";

interface EarningsData {
  totalEarnings: number;
  availableBalance: number;
  pendingAmount: number;
  monthlyEarnings: number;
  transactions: Array<{
    id: string;
    amount: number;
    type: string;
    date: string;
    status: string;
  }>;
}

export default function EarningsPage() {
  const { data: earningsData } = useQuery<EarningsData>({
    queryKey: ["/api/earnings"],
  });

  const mockTransactions = [
    {
      id: "1",
      amount: 500,
      type: "Data License",
      date: "2024-01-15",
      status: "completed",
      company: "HDFC Bank"
    },
    {
      id: "2", 
      amount: 300,
      type: "Data License",
      date: "2024-01-10",
      status: "completed",
      company: "XYZ AdTech"
    },
    {
      id: "3",
      amount: 800,
      type: "Data License", 
      date: "2024-01-05",
      status: "pending",
      company: "HealthCorp"
    },
    {
      id: "4",
      amount: 200,
      type: "Referral Bonus",
      date: "2024-01-01",
      status: "completed",
      company: "System"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-green-600 bg-green-50";
      case "pending": return "text-yellow-600 bg-yellow-50";
      case "failed": return "text-red-600 bg-red-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <main className="flex-1 overflow-auto">
        <Header />
        
        <div className="p-6 space-y-6">
          {/* Earnings Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                <Coins className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{earningsData?.totalEarnings || 0}</div>
                <p className="text-xs text-muted-foreground">
                  All time earnings
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{earningsData?.availableBalance || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Ready to withdraw
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{earningsData?.pendingAmount || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Processing payments
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Month</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{earningsData?.monthlyEarnings || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Current month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Earnings Calculator and Payment Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <EarningsCalculator />
            <PaymentPanel earningsData={earningsData} />
          </div>

          {/* Transaction History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Transaction History</span>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <CreditCard className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{transaction.type}</h3>
                        <p className="text-sm text-muted-foreground">
                          {transaction.company} • {new Date(transaction.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">+₹{transaction.amount}</div>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(transaction.status)}`}>
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Earnings Tips */}
          <Card>
            <CardHeader>
              <CardTitle>Maximize Your Earnings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-medium text-green-600">✓ Do This</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Grant permissions to trusted companies</li>
                    <li>• Keep your data sharing active</li>
                    <li>• Review and update your privacy settings regularly</li>
                    <li>• Connect multiple data sources</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium text-red-600">✗ Avoid This</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Sharing data with unknown companies</li>
                    <li>• Granting unnecessary permissions</li>
                    <li>• Ignoring privacy policy updates</li>
                    <li>• Not monitoring your earnings regularly</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}




