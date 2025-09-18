import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/dashboard/sidebar";
import Header from "@/components/dashboard/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Eye, EyeOff, Lock, Unlock, AlertTriangle, CheckCircle } from "lucide-react";
import { useState } from "react";

interface PrivacyData {
  google: number;
  facebook: number;
  instagram: number;
  other: number;
}

export default function PrivacyPage() {
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
      category: "Location"
    },
    {
      id: "analytics" as keyof typeof privacySettings,
      title: "Analytics & Usage",
      description: "Share usage data to improve app performance",
      icon: Eye,
      category: "Analytics"
    },
    {
      id: "personalizedAds" as keyof typeof privacySettings,
      title: "Personalized Advertising",
      description: "Show ads based on your interests and behavior",
      icon: EyeOff,
      category: "Advertising"
    },
    {
      id: "dataSharing" as keyof typeof privacySettings,
      title: "Data Sharing",
      description: "Share anonymized data with research partners",
      icon: Lock,
      category: "Research"
    },
    {
      id: "cookies" as keyof typeof privacySettings,
      title: "Cookie Preferences",
      description: "Accept cookies for enhanced functionality",
      icon: Unlock,
      category: "Cookies"
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Location": return "text-blue-600 bg-blue-50";
      case "Analytics": return "text-green-600 bg-green-50";
      case "Advertising": return "text-purple-600 bg-purple-50";
      case "Research": return "text-orange-600 bg-orange-50";
      case "Cookies": return "text-gray-600 bg-gray-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <main className="flex-1 overflow-auto">
        <Header />
        
        <div className="p-6 space-y-6">
          {/* Privacy Score Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Privacy Score</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{privacyData?.google || 0}%</div>
                <p className="text-xs text-muted-foreground">
                  Based on your current settings
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Data Points Tracked</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Object.values(privacyData || {}).reduce((a, b) => a + b, 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Across all platforms
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Controls</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Object.values(privacySettings).filter(Boolean).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Privacy settings enabled
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Privacy Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
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
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-lg ${getCategoryColor(control.category)}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium">{control.title}</h3>
                        <p className="text-sm text-muted-foreground">{control.description}</p>
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${getCategoryColor(control.category)}`}>
                          {control.category}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant={isEnabled ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePrivacyToggle(control.id)}
                    >
                      {isEnabled ? "Enabled" : "Disabled"}
                    </Button>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Data Usage by Platform */}
          <Card>
            <CardHeader>
              <CardTitle>Data Usage by Platform</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {privacyData && Object.entries(privacyData).map(([platform, score]) => (
                  <div key={platform} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="capitalize font-medium">{platform}</span>
                      <span>{score}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Privacy Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <span>Privacy Tips</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <p className="text-sm">
                    <strong>Review app permissions regularly:</strong> Check which apps have access to your location, camera, and microphone.
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  <p className="text-sm">
                    <strong>Use strong, unique passwords:</strong> Enable two-factor authentication wherever possible.
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                  <p className="text-sm">
                    <strong>Be selective with data sharing:</strong> Only share data with companies you trust and understand their privacy policies.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}









