import Sidebar from "@/components/dashboard/sidebar";
import Header from "@/components/dashboard/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  Clock, 
  ExternalLink, 
  Copy,
  Calendar,
  Hash
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ConsentRecord {
  id: string;
  company: string;
  action: 'granted' | 'revoked';
  dataTypes: string[];
  timestamp: string;
  blockchainTxHash: string;
  status: 'pending' | 'confirmed' | 'failed';
  earnings?: number;
}

export default function ConsentHistoryPage() {
  const { toast } = useToast();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'granted' | 'revoked'>('all');

  // Mock consent history data
  const consentHistory: ConsentRecord[] = [
    {
      id: '1',
      company: 'TechCorp Analytics',
      action: 'granted',
      dataTypes: ['location', 'browsing_history', 'demographics'],
      timestamp: '2024-01-15T10:30:00Z',
      blockchainTxHash: '0x1234567890abcdef1234567890abcdef12345678',
      status: 'confirmed',
      earnings: 500
    },
    {
      id: '2',
      company: 'DataInsights Inc',
      action: 'revoked',
      dataTypes: ['purchase_history', 'social_media'],
      timestamp: '2024-01-14T15:45:00Z',
      blockchainTxHash: '0xabcdef1234567890abcdef1234567890abcdef12',
      status: 'confirmed',
      earnings: 0
    },
    {
      id: '3',
      company: 'Market Research Co',
      action: 'granted',
      dataTypes: ['app_usage', 'device_info'],
      timestamp: '2024-01-13T09:20:00Z',
      blockchainTxHash: '0x567890abcdef1234567890abcdef1234567890ab',
      status: 'pending',
      earnings: 300
    },
    {
      id: '4',
      company: 'HealthCorp',
      action: 'granted',
      dataTypes: ['health_data', 'fitness_tracking'],
      timestamp: '2024-01-12T14:15:00Z',
      blockchainTxHash: '0x90abcdef1234567890abcdef1234567890abcdef',
      status: 'confirmed',
      earnings: 750
    },
    {
      id: '5',
      company: 'AdTech Solutions',
      action: 'revoked',
      dataTypes: ['advertising_id', 'behavioral_data'],
      timestamp: '2024-01-11T11:30:00Z',
      blockchainTxHash: '0xcdef1234567890abcdef1234567890abcdef1234',
      status: 'failed',
      earnings: 0
    }
  ];

  const filteredHistory = consentHistory.filter(record => {
    if (selectedFilter === 'all') return true;
    return record.action === selectedFilter;
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Transaction hash copied successfully",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'failed': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getActionIcon = (action: string) => {
    return action === 'granted' ? CheckCircle : XCircle;
  };

  const getActionColor = (action: string) => {
    return action === 'granted' ? 'text-green-400' : 'text-red-400';
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateHash = (hash: string) => {
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  };

  const totalEarnings = consentHistory
    .filter(record => record.status === 'confirmed')
    .reduce((sum, record) => sum + (record.earnings || 0), 0);

  const totalConsents = consentHistory.length;
  const activeConsents = consentHistory.filter(record => 
    record.action === 'granted' && record.status === 'confirmed'
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="flex h-screen">
        <Sidebar />
        
        <main className="flex-1 overflow-auto">
          <Header />
          
          <div className="p-6 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Consent History</h1>
                <p className="text-gray-300">Track your data sharing permissions and blockchain transactions</p>
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Consents</p>
                      <p className="text-2xl font-bold text-white">{totalConsents}</p>
                    </div>
                    <Shield className="h-8 w-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Active Consents</p>
                      <p className="text-2xl font-bold text-white">{activeConsents}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Earnings</p>
                      <p className="text-2xl font-bold text-white">₹{totalEarnings}</p>
                    </div>
                    <Hash className="h-8 w-8 text-purple-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Blockchain Txs</p>
                      <p className="text-2xl font-bold text-white">{consentHistory.length}</p>
                    </div>
                    <ExternalLink className="h-8 w-8 text-yellow-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <span className="text-white font-medium">Filter by action:</span>
                  <div className="flex space-x-2">
                    {[
                      { key: 'all', label: 'All' },
                      { key: 'granted', label: 'Granted' },
                      { key: 'revoked', label: 'Revoked' }
                    ].map((filter) => (
                      <Button
                        key={filter.key}
                        variant={selectedFilter === filter.key ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedFilter(filter.key as any)}
                        className={selectedFilter === filter.key ? "bg-blue-600 hover:bg-blue-700" : "border-gray-600 text-gray-300 hover:bg-gray-700"}
                      >
                        {filter.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Consent History List */}
            <div className="space-y-4">
              {filteredHistory.map((record) => {
                const ActionIcon = getActionIcon(record.action);
                
                return (
                  <Card key={record.id} className="bg-gray-800/50 backdrop-blur-sm border-gray-700 hover:border-blue-500/50 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className={`p-3 rounded-lg ${getActionColor(record.action)} bg-gray-700/50`}>
                            <ActionIcon className="h-6 w-6" />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-semibold text-white">{record.company}</h3>
                              <Badge className={getStatusColor(record.status)}>
                                {record.status}
                              </Badge>
                              {record.earnings && record.earnings > 0 && (
                                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                                  +₹{record.earnings}
                                </Badge>
                              )}
                            </div>
                            
                            <p className="text-gray-400 mb-3">
                              {record.action === 'granted' ? 'Granted access to' : 'Revoked access to'}: {record.dataTypes.join(', ')}
                            </p>
                            
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span>{formatTimestamp(record.timestamp)}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Hash className="h-4 w-4" />
                                <span className="font-mono">{truncateHash(record.blockchainTxHash)}</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(record.blockchainTxHash)}
                                  className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-gray-600 text-gray-300 hover:bg-gray-700"
                            onClick={() => window.open(`https://etherscan.io/tx/${record.blockchainTxHash}`, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View on Blockchain
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Empty State */}
            {filteredHistory.length === 0 && (
              <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
                <CardContent className="p-12 text-center">
                  <Shield className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No consent records found</h3>
                  <p className="text-gray-400">No consent records match your current filter.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
