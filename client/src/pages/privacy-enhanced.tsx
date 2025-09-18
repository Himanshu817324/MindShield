import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/dashboard/sidebar";
import Header from "@/components/dashboard/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, AlertTriangle, CheckCircle, Eye, EyeOff, TrendingUp, Lock, Users, Activity } from "lucide-react";
import { useState } from "react";
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface PrivacyData {
  google: number;
  facebook: number;
  instagram: number;
  other: number;
}

export default function PrivacyEnhancedPage() {
  const { data: privacyData } = useQuery<PrivacyData>({
    queryKey: ["/api/privacy"],
  });

  const [privacySettings, setPrivacySettings] = useState({
    locationTracking: true,
    analytics: false,
    personalizedAds: true,
    dataSharing: false,
    cookies: true,
  });

  // Calculate privacy score
  const totalDataPoints = Object.values(privacyData || {}).reduce((a, b) => a + b, 0);
  const privacyScore = Math.max(0, 100 - totalDataPoints);

  // Chart data for pie chart
  const chartData = {
    labels: ['Google', 'Facebook', 'Instagram', 'Others'],
    datasets: [
      {
        data: [
          privacyData?.google || 0,
          privacyData?.facebook || 0,
          privacyData?.instagram || 0,
          privacyData?.other || 0,
        ],
        backgroundColor: [
          '#4285F4', // Google Blue
          '#1877F2', // Facebook Blue
          '#E4405F', // Instagram Pink
          '#6B7280', // Gray
        ],
        borderColor: [
          '#1a73e8',
          '#166fe5',
          '#c13584',
          '#4B5563',
        ],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#ffffff',
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#4F46E5',
        borderWidth: 1,
      },
    },
  };

  const handlePrivacyToggle = (setting: keyof typeof privacySettings) => {
    setPrivacySettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const privacyControls = [
    {
      id: "locationTracking" as keyof typeof privacySettings,
      title: "Location Tracking",
      description: "Allow apps to access your location data",
      icon: Shield,
      category: "Location",
      impact: "High"
    },
    {
      id: "analytics" as keyof typeof privacySettings,
      title: "Analytics & Usage",
      description: "Share usage data to improve app performance",
      icon: Eye,
      category: "Analytics",
      impact: "Medium"
    },
    {
      id: "personalizedAds" as keyof typeof privacySettings,
      title: "Personalized Advertising",
      description: "Show ads based on your interests and behavior",
      icon: EyeOff,
      category: "Advertising",
      impact: "High"
    },
    {
      id: "dataSharing" as keyof typeof privacySettings,
      title: "Data Sharing",
      description: "Share anonymized data with research partners",
      icon: Lock,
      category: "Research",
      impact: "Low"
    },
    {
      id: "cookies" as keyof typeof privacySettings,
      title: "Cookie Preferences",
      description: "Accept cookies for enhanced functionality",
      icon: Lock,
      category: "Cookies",
      impact: "Medium"
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Location": return "text-blue-400 bg-blue-500/20 border-blue-500/30";
      case "Analytics": return "text-green-400 bg-green-500/20 border-green-500/30";
      case "Advertising": return "text-purple-400 bg-purple-500/20 border-purple-500/30";
      case "Research": return "text-orange-400 bg-orange-500/20 border-orange-500/30";
      case "Cookies": return "text-gray-400 bg-gray-500/20 border-gray-500/30";
      default: return "text-gray-400 bg-gray-500/20 border-gray-500/30";
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "High": return "text-red-400 bg-red-500/20";
      case "Medium": return "text-yellow-400 bg-yellow-500/20";
      case "Low": return "text-green-400 bg-green-500/20";
      default: return "text-gray-400 bg-gray-500/20";
    }
  };

  const getPrivacyScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const getPrivacyScoreBg = (score: number) => {
    if (score >= 80) return "from-green-500/20 to-emerald-500/20 border-green-500/30";
    if (score >= 60) return "from-yellow-500/20 to-orange-500/20 border-yellow-500/30";
    return "from-red-500/20 to-pink-500/20 border-red-500/30";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="flex h-screen">
        <Sidebar />
        
        <main className="flex-1 overflow-auto">
          <Header />
          
          <div className="p-6 space-y-8">
            {/* Privacy Score Hero Card */}
            <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm border-blue-500/30">
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Privacy Dashboard</h1>
                    <p className="text-gray-300">Monitor and control your digital footprint</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-6xl font-bold ${getPrivacyScoreColor(privacyScore)}`}>
                      {privacyScore}
                    </div>
                    <div className="text-gray-400 text-sm">Privacy Score</div>
                  </div>
                </div>
                
                {/* Privacy Score Meter */}
                <div className="mt-6">
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>Low Privacy</span>
                    <span>High Privacy</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full bg-gradient-to-r ${getPrivacyScoreBg(privacyScore).replace('/20', '').replace('border-', '')} transition-all duration-1000`}
                      style={{ width: `${privacyScore}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700 hover:border-blue-500/50 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Data Points</p>
                      <p className="text-2xl font-bold text-white">{totalDataPoints}</p>
                    </div>
                    <Activity className="h-8 w-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700 hover:border-green-500/50 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Active Controls</p>
                      <p className="text-2xl font-bold text-white">
                        {Object.values(privacySettings).filter(Boolean).length}
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700 hover:border-purple-500/50 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Platforms</p>
                      <p className="text-2xl font-bold text-white">
                        {Object.keys(privacyData || {}).length}
                      </p>
                    </div>
                    <Users className="h-8 w-8 text-purple-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700 hover:border-yellow-500/50 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Trend</p>
                      <p className="text-2xl font-bold text-white">+12%</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-yellow-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Data Sources Pie Chart */}
              <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Data Sources Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <Pie data={chartData} options={chartOptions} />
                  </div>
                </CardContent>
              </Card>

              {/* Privacy Controls */}
              <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>Privacy Controls</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {privacyControls.map((control) => {
                    const Icon = control.icon;
                    const isEnabled = privacySettings[control.id];
                    
                    return (
                      <div
                        key={control.id}
                        className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg border border-gray-600 hover:border-blue-500/50 transition-all duration-300"
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`p-2 rounded-lg ${getCategoryColor(control.category)}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-medium text-white">{control.title}</h3>
                            <p className="text-sm text-gray-400">{control.description}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(control.category)}`}>
                                {control.category}
                              </span>
                              <span className={`px-2 py-1 text-xs rounded-full ${getImpactColor(control.impact)}`}>
                                {control.impact} Impact
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant={isEnabled ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePrivacyToggle(control.id)}
                          className={isEnabled ? "bg-green-600 hover:bg-green-700" : "border-gray-500 text-gray-300 hover:bg-gray-600"}
                        >
                          {isEnabled ? "Enabled" : "Disabled"}
                        </Button>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>

            {/* Data Usage by Platform */}
            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Data Usage by Platform</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {privacyData && Object.entries(privacyData).map(([platform, score]) => (
                    <div key={platform} className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="capitalize font-medium text-white">{platform}</span>
                        <span className="text-gray-400">{score}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-3">
                        <div
                          className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000"
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Privacy Tips */}
            <Card className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 backdrop-blur-sm border-yellow-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-400" />
                  <span>Privacy Tips</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                      <p className="text-sm text-gray-300">
                        <strong className="text-white">Review app permissions regularly:</strong> Check which apps have access to your location, camera, and microphone.
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                      <p className="text-sm text-gray-300">
                        <strong className="text-white">Use strong, unique passwords:</strong> Enable two-factor authentication wherever possible.
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                      <p className="text-sm text-gray-300">
                        <strong className="text-white">Be selective with data sharing:</strong> Only share data with companies you trust and understand their privacy policies.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
