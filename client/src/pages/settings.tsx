// import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/dashboard/sidebar";
import Header from "@/components/dashboard/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  // CreditCard, 
  Download, 
  Trash2,
  Wallet,
  Key,
  Globe,
  Moon,
  Sun
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useWeb3 } from "@/contexts/Web3Context";

export default function SettingsPage() {
  const { user } = useAuth();
  const { account, connectWallet, isConnected, error: walletError } = useWeb3();
  const [settings, setSettings] = useState({
    notifications: true,
    emailUpdates: true,
    dataSharing: false,
    darkMode: false,
    autoSync: true,
    twoFactor: false,
  });

  const handleSettingChange = (setting: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
    } catch (error) {
      console.error('Wallet connection failed:', error);
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <main className="flex-1 overflow-auto">
        <Header />
        
        <div className="p-6 space-y-6">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Profile Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={user?.username || ''}
                    disabled
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={user?.email || ''}
                    disabled
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  Edit Profile
                </Button>
                <Button variant="outline" size="sm">
                  Change Password
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Wallet Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Wallet className="h-5 w-5" />
                <span>Wallet Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isConnected ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <Wallet className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-green-800">Wallet Connected</p>
                        <p className="text-sm text-green-600">
                          {account?.slice(0, 6)}...{account?.slice(-4)}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Disconnect
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Key className="h-3 w-3 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium text-yellow-800 mb-2">Connect Your Wallet</h4>
                        <p className="text-sm text-yellow-700 mb-3">
                          Connect your MetaMask wallet to enable blockchain features and receive payments.
                        </p>
                        
                        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <h5 className="font-medium text-blue-800 mb-2">🔐 Why We Need Your Wallet</h5>
                          <div className="text-sm text-blue-700 space-y-2">
                            <p><strong>1. Data Ownership Verification:</strong> Your wallet address serves as your unique digital identity to prove you own your data.</p>
                            <p><strong>2. Smart Contract Execution:</strong> We create blockchain contracts that automatically execute when companies access your data.</p>
                            <p><strong>3. Transparent Payments:</strong> All payments for your data are processed through blockchain for complete transparency.</p>
                            <p><strong>4. Immutable Records:</strong> Your data sharing permissions are recorded on blockchain and cannot be tampered with.</p>
                          </div>
                        </div>
                        
                        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <h5 className="font-medium text-green-800 mb-2">💾 What We Store in Your Wallet</h5>
                          <div className="text-sm text-green-700 space-y-2">
                            <p><strong>✅ What We Store:</strong></p>
                            <ul className="list-disc list-inside ml-2 space-y-1">
                              <li>Your wallet address (public key only)</li>
                              <li>Data sharing agreement hashes</li>
                              <li>Payment transaction records</li>
                              <li>Permission revocation timestamps</li>
                            </ul>
                            <p><strong>❌ What We DON'T Store:</strong></p>
                            <ul className="list-disc list-inside ml-2 space-y-1">
                              <li>Your private keys (never leave your device)</li>
                              <li>Your actual personal data</li>
                              <li>Your wallet seed phrase</li>
                              <li>Any sensitive financial information</li>
                            </ul>
                          </div>
                        </div>
                        {walletError && (
                          <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600 mb-2">
                              <strong>Wallet Error:</strong> {walletError}
                            </p>
                            <div className="text-xs text-red-500 space-y-1">
                              <p><strong>To install MetaMask:</strong></p>
                              <ol className="list-decimal list-inside space-y-1 ml-2">
                                <li>Go to <a href="https://metamask.io/" target="_blank" className="underline">metamask.io</a></li>
                                <li>Click "Download" and select your browser</li>
                                <li>Install the extension and create a wallet</li>
                                <li>Refresh this page and click "Connect Wallet"</li>
                              </ol>
                            </div>
                          </div>
                        )}
                        <Button onClick={handleConnectWallet} className="w-full">
                          <Wallet className="h-4 w-4 mr-2" />
                          Connect Wallet
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notifications</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifications">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications about earnings and updates
                  </p>
                </div>
                <Switch
                  id="notifications"
                  checked={settings.notifications}
                  onCheckedChange={() => handleSettingChange('notifications')}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="emailUpdates">Email Updates</Label>
                  <p className="text-sm text-muted-foreground">
                    Get weekly summaries via email
                  </p>
                </div>
                <Switch
                  id="emailUpdates"
                  checked={settings.emailUpdates}
                  onCheckedChange={() => handleSettingChange('emailUpdates')}
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Privacy & Security</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="dataSharing">Data Sharing</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow anonymized data sharing for research
                  </p>
                </div>
                <Switch
                  id="dataSharing"
                  checked={settings.dataSharing}
                  onCheckedChange={() => handleSettingChange('dataSharing')}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="twoFactor">Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Switch
                  id="twoFactor"
                  checked={settings.twoFactor}
                  onCheckedChange={() => handleSettingChange('twoFactor')}
                />
              </div>
            </CardContent>
          </Card>

          {/* App Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <SettingsIcon className="h-5 w-5" />
                <span>App Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="theme">Theme</Label>
                  <Select defaultValue="light">
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">
                        <div className="flex items-center space-x-2">
                          <Sun className="h-4 w-4" />
                          <span>Light</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="dark">
                        <div className="flex items-center space-x-2">
                          <Moon className="h-4 w-4" />
                          <span>Dark</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="language">Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">Hindi</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="autoSync">Auto Sync</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically sync data every hour
                  </p>
                </div>
                <Switch
                  id="autoSync"
                  checked={settings.autoSync}
                  onCheckedChange={() => handleSettingChange('autoSync')}
                />
              </div>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Download className="h-5 w-5" />
                <span>Data Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
                <Button variant="outline" size="sm">
                  <Globe className="h-4 w-4 mr-2" />
                  View Privacy Policy
                </Button>
                <Button variant="outline" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
