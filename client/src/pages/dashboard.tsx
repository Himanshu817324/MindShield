import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/dashboard/sidebar";
import Header from "@/components/dashboard/header";
import MetricsGrid from "@/components/dashboard/metrics-grid";
import ChartsSection from "@/components/dashboard/charts-section";
import PermissionsPanel from "@/components/dashboard/permissions-panel";
import EarningsCalculator from "@/components/dashboard/earnings-calculator";
import PaymentPanel from "@/components/dashboard/payment-panel";
import BlockchainStatus from "@/components/dashboard/blockchain-status";

interface DashboardData {
  privacyScore: number;
  monthlyEarnings: number;
  activePermissions: number;
  pendingPermissions: number;
  dataRequests: number;
  permissions: Array<{
    id: string;
    companyName: string;
    companyLogo?: string;
    accessTypes: string[];
    monthlyPayment: number;
    status: string;
  }>;
}

interface PrivacyData {
  google?: number;
  facebook?: number;
  instagram?: number;
  other?: number;
}

interface EarningsData {
  availableBalance: number;
  pendingPayments: number;
  transactions: Array<{
    id: string;
    amount: number;
    status: string;
    createdAt: string;
  }>;
}

export default function Dashboard() {
  const { data: dashboardData, isLoading } = useQuery<DashboardData>({
    queryKey: ["/api/dashboard"],
  });

  const { data: privacyData } = useQuery<PrivacyData>({
    queryKey: ["/api/privacy"],
  });

  const { data: earningsData } = useQuery<EarningsData>({
    queryKey: ["/api/earnings"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <main className="flex-1 overflow-auto">
        <Header />
        
        <div className="p-6 space-y-6">
          <MetricsGrid data={dashboardData} />
          
          <ChartsSection 
            privacyData={privacyData} 
            earningsData={earningsData} 
          />
          
          <PermissionsPanel permissions={dashboardData?.permissions || []} />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <EarningsCalculator />
            <PaymentPanel earningsData={earningsData} />
          </div>
          
          <BlockchainStatus />
        </div>
      </main>
    </div>
  );
}
