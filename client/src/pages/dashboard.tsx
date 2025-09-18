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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        
        {/* Floating Data Points */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/60 rounded-full animate-ping"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-purple-400/60 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/3 left-1/3 w-3 h-3 bg-pink-400/60 rounded-full animate-bounce"></div>
      </div>

      <div className="flex h-screen relative z-10">
        <Sidebar />
        
        <main className="flex-1 overflow-auto">
          <Header />
          
          <div className="p-6 space-y-6">
            <MetricsGrid data={dashboardData} />
            
            <div id="privacy-section">
              <ChartsSection 
                privacyData={privacyData} 
                earningsData={earningsData} 
              />
            </div>
            
            <PermissionsPanel permissions={dashboardData?.permissions || []} />
            
            <div id="earnings-section" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <EarningsCalculator />
              <PaymentPanel earningsData={earningsData} />
            </div>
            
            <div id="settings-section">
              <BlockchainStatus />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}