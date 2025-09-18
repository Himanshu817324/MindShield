import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, BarChart3 } from "lucide-react";

interface ChartsSectionProps {
  privacyData?: {
    google?: number;
    facebook?: number;
    instagram?: number;
    other?: number;
  };
  earningsData?: any;
}

export default function ChartsSection({ privacyData }: ChartsSectionProps) {
  const footprintData = [
    { platform: "Google", percentage: privacyData?.google || 45, color: "from-blue-500 to-purple-600", icon: "fab fa-google" },
    { platform: "Facebook", percentage: privacyData?.facebook || 25, color: "from-blue-600 to-purple-700", icon: "fab fa-facebook" },
    { platform: "Instagram", percentage: privacyData?.instagram || 20, color: "from-purple-500 to-pink-600", icon: "fab fa-instagram" },
    { platform: "Others", percentage: privacyData?.other || 10, color: "from-gray-600 to-blue-700", icon: "fas fa-ellipsis-h" },
  ];

  return (
    <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Data Points */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400 rounded-full animate-pulse opacity-60"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-purple-400 rounded-full animate-bounce opacity-40" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-60 left-1/4 w-2 h-2 bg-blue-300 rounded-full animate-pulse opacity-50" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-40 right-1/3 w-2 h-2 bg-purple-300 rounded-full animate-bounce opacity-60" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute bottom-60 left-1/2 w-3 h-3 bg-blue-200 rounded-full animate-pulse opacity-30" style={{animationDelay: '1.5s'}}></div>
        
        {/* Animated Background Blurs */}
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-l from-purple-600/15 to-blue-600/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="relative z-10 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Data Footprint Chart */}
          <Card className="bg-gray-800/80 backdrop-blur-sm border-gray-700/50 hover:bg-gray-800/90 transition-all duration-300 shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Data Footprint Distribution
                </h3>
                <button
                  className="text-blue-400 hover:text-purple-400 transition-colors duration-300 hover:scale-110 transform"
                  data-testid="button-expand-chart"
                >
                  <ExternalLink className="h-4 w-4" />
                </button>
              </div>
             
              <div className="space-y-4">
                {footprintData.map((item) => (
                  <div
                    key={item.platform}
                    className="flex items-center justify-between p-3 bg-gray-700/50 backdrop-blur-sm rounded-lg border border-gray-600/30 hover:bg-gray-700/70 transition-all duration-300 hover:scale-[1.02] transform"
                    data-testid={`footprint-item-${item.platform.toLowerCase()}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 bg-gradient-to-r ${item.color} rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300`}>
                        <i className={`${item.icon} text-white text-sm`}></i>
                      </div>
                      <span className="font-medium text-gray-200">{item.platform}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-600/50 rounded-full h-2 overflow-hidden">
                        <div
                          className={`bg-gradient-to-r ${item.color} h-2 rounded-full transition-all duration-1000 ease-out shadow-sm`}
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-mono text-gray-300" data-testid={`percentage-${item.platform.toLowerCase()}`}>
                        {item.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Earnings Trend */}
          <Card className="bg-gray-800/80 backdrop-blur-sm border-gray-700/50 hover:bg-gray-800/90 transition-all duration-300 shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Earnings Trend
                </h3>
                <select
                  className="px-3 py-1 bg-gray-700/70 border border-gray-600/50 rounded-md text-sm text-gray-200 backdrop-blur-sm hover:bg-gray-700/90 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  data-testid="select-earnings-period"
                >
                  <option>Last 6 months</option>
                  <option>Last year</option>
                </select>
              </div>
             
              <div className="h-48 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-lg flex items-end justify-center p-4 border border-gray-700/30 hover:border-gray-600/50 transition-all duration-300">
                <div className="text-center">
                  <div className="relative">
                    <BarChart3 className="mx-auto h-12 w-12 mb-2 text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text" />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-lg blur-xl animate-pulse"></div>
                  </div>
                  <p className="text-sm text-gray-300 opacity-90">Earnings visualization</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .earnings-chart {
          background: linear-gradient(135deg, rgba(55, 65, 81, 0.5), rgba(17, 24, 39, 0.5));
        }
      `}</style>
    </div>
  );
}