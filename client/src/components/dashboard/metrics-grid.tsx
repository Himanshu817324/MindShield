import { Shield, IndianRupee, Key, Database } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface MetricsGridProps {
  data?: {
    privacyScore: number;
    monthlyEarnings: number;
    activePermissions: number;
    pendingPermissions: number;
    dataRequests: number;
  };
}

export default function MetricsGrid({ data }: MetricsGridProps) {
  const privacyScore = data?.privacyScore || 62;
  const monthlyEarnings = data?.monthlyEarnings || 2450;
  const activePermissions = data?.activePermissions || 7;
  const pendingPermissions = data?.pendingPermissions || 2;
  const dataRequests = data?.dataRequests || 23;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Privacy Score Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-card-foreground">Privacy Score</h3>
            <Shield className="text-primary h-5 w-5" />
          </div>
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="privacy-meter w-20 h-20 rounded-full"></div>
            <div className="absolute inset-2 bg-card rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold" data-testid="text-privacy-score">
                {privacyScore}
              </span>
            </div>
          </div>
          <p className="text-center text-sm text-muted-foreground">Good protection level</p>
        </CardContent>
      </Card>

      {/* Monthly Earnings Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-card-foreground">Monthly Earnings</h3>
            <IndianRupee className="text-green-600 h-5 w-5" />
          </div>
          <div className="text-3xl font-bold text-green-600 mb-2" data-testid="text-monthly-earnings">
            ₹{monthlyEarnings.toLocaleString()}
          </div>
          <p className="text-sm text-muted-foreground">+12% from last month</p>
        </CardContent>
      </Card>

      {/* Active Permissions Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-card-foreground">Active Permissions</h3>
            <Key className="text-blue-600 h-5 w-5" />
          </div>
          <div className="text-3xl font-bold mb-2" data-testid="text-active-permissions">
            {activePermissions}
          </div>
          <p className="text-sm text-muted-foreground">
            {pendingPermissions} pending review
          </p>
        </CardContent>
      </Card>

      {/* Data Requests Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-card-foreground">Data Requests</h3>
            <Database className="text-purple-600 h-5 w-5" />
          </div>
          <div className="text-3xl font-bold mb-2" data-testid="text-data-requests">
            {dataRequests}
          </div>
          <p className="text-sm text-muted-foreground">This week</p>
        </CardContent>
      </Card>
    </div>
  );
}
