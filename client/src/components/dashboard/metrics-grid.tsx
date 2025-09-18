import React from 'react';
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
    <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Data Points */}
        <div className="absolute top-16 left-8 w-2 h-2 bg-blue-400 rounded-full animate-pulse opacity-60"></div>
        <div className="absolute top-32 right-16 w-3 h-3 bg-purple-400 rounded-full animate-bounce opacity-40" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-48 left-1/3 w-2 h-2 bg-blue-300 rounded-full animate-pulse opacity-50" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-32 right-1/4 w-2 h-2 bg-purple-300 rounded-full animate-bounce opacity-60" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute bottom-48 left-2/3 w-3 h-3 bg-blue-200 rounded-full animate-pulse opacity-30" style={{animationDelay: '1.5s'}}></div>
        <div className="absolute top-2/3 right-8 w-2 h-2 bg-purple-200 rounded-full animate-bounce opacity-40" style={{animationDelay: '2.5s'}}></div>
        
        {/* Animated Background Blurs */}
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-gradient-to-l from-purple-600/15 to-blue-600/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/3 left-2/3 w-48 h-48 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/3 left-1/4 w-56 h-56 bg-gradient-to-tl from-purple-500/8 to-blue-500/8 rounded-full blur-2xl animate-pulse" style={{animationDelay: '3s'}}></div>
      </div>

      <div className="relative z-10 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Privacy Score Card */}
          <Card className="bg-gray-800/80 backdrop-blur-sm border-gray-700/50 hover:bg-gray-800/90 transition-all duration-300 shadow-2xl hover:shadow-blue-500/10 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Privacy Score
                </h3>
                <div className="relative">
                  <Shield className="text-blue-400 h-5 w-5 group-hover:text-purple-400 transition-colors duration-300" />
                  <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-lg animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
              <div className="relative w-20 h-20 mx-auto mb-4">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 animate-spin-slow">
                  <div className="absolute inset-1 bg-gray-800 rounded-full"></div>
                </div>
                <div className="absolute inset-2 bg-gradient-to-br from-gray-700/80 to-gray-800/80 backdrop-blur-sm rounded-full flex items-center justify-center border border-gray-600/30">
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent" data-testid="text-privacy-score">
                    {privacyScore}
                  </span>
                </div>
              </div>
              <p className="text-center text-sm text-gray-300">Good protection level</p>
            </CardContent>
          </Card>

          {/* Monthly Earnings Card */}
          <Card className="bg-gray-800/80 backdrop-blur-sm border-gray-700/50 hover:bg-gray-800/90 transition-all duration-300 shadow-2xl hover:shadow-green-500/10 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Monthly Earnings
                </h3>
                <div className="relative">
                  <IndianRupee className="text-green-400 h-5 w-5 group-hover:text-green-300 transition-colors duration-300" />
                  <div className="absolute inset-0 bg-green-400/20 rounded-full blur-lg animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
              <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2 group-hover:scale-105 transition-transform duration-300" data-testid="text-monthly-earnings">
                ₹{monthlyEarnings.toLocaleString()}
              </div>
              <p className="text-sm text-gray-300">
                <span className="text-green-400 font-medium">+12%</span> from last month
              </p>
            </CardContent>
          </Card>

          {/* Active Permissions Card */}
          <Card className="bg-gray-800/80 backdrop-blur-sm border-gray-700/50 hover:bg-gray-800/90 transition-all duration-300 shadow-2xl hover:shadow-blue-500/10 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Active Permissions
                </h3>
                <div className="relative">
                  <Key className="text-blue-500 h-5 w-5 group-hover:text-purple-500 transition-colors duration-300" />
                  <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-lg animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2 group-hover:scale-105 transition-transform duration-300" data-testid="text-active-permissions">
                {activePermissions}
              </div>
              <p className="text-sm text-gray-300">
                <span className="text-purple-400 font-medium">{pendingPermissions}</span> pending review
              </p>
            </CardContent>
          </Card>

          {/* Data Requests Card */}
          <Card className="bg-gray-800/80 backdrop-blur-sm border-gray-700/50 hover:bg-gray-800/90 transition-all duration-300 shadow-2xl hover:shadow-purple-500/10 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Data Requests
                </h3>
                <div className="relative">
                  <Database className="text-purple-500 h-5 w-5 group-hover:text-blue-500 transition-colors duration-300" />
                  <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-lg animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-400 bg-clip-text text-transparent mb-2 group-hover:scale-105 transition-transform duration-300" data-testid="text-data-requests">
                {dataRequests}
              </div>
              <p className="text-sm text-gray-300">This week</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <style>{`
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
}