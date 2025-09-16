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
    { platform: "Google", percentage: privacyData?.google || 45, color: "bg-blue-500", icon: "fab fa-google" },
    { platform: "Facebook", percentage: privacyData?.facebook || 25, color: "bg-blue-600", icon: "fab fa-facebook" },
    { platform: "Instagram", percentage: privacyData?.instagram || 20, color: "bg-pink-500", icon: "fab fa-instagram" },
    { platform: "Others", percentage: privacyData?.other || 10, color: "bg-gray-500", icon: "fas fa-ellipsis-h" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Data Footprint Chart */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Data Footprint Distribution</h3>
            <button 
              className="text-primary hover:text-primary/80"
              data-testid="button-expand-chart"
            >
              <ExternalLink className="h-4 w-4" />
            </button>
          </div>
          
          <div className="space-y-4">
            {footprintData.map((item) => (
              <div 
                key={item.platform}
                className="flex items-center justify-between p-3 bg-secondary rounded-lg"
                data-testid={`footprint-item-${item.platform.toLowerCase()}`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 ${item.color} rounded-full flex items-center justify-center`}>
                    <i className={`${item.icon} text-white text-sm`}></i>
                  </div>
                  <span className="font-medium">{item.platform}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-border rounded-full h-2">
                    <div 
                      className={`${item.color} h-2 rounded-full`} 
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-mono" data-testid={`percentage-${item.platform.toLowerCase()}`}>
                    {item.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Earnings Trend */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Earnings Trend</h3>
            <select 
              className="px-3 py-1 border border-border rounded-md text-sm"
              data-testid="select-earnings-period"
            >
              <option>Last 6 months</option>
              <option>Last year</option>
            </select>
          </div>
          
          <div className="h-48 earnings-chart rounded-lg flex items-end justify-center p-4">
            <div className="text-white text-center">
              <BarChart3 className="mx-auto h-12 w-12 mb-2" />
              <p className="text-sm opacity-90">Earnings visualization</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
