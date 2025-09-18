import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users, Shield, CheckCircle, Clock, XCircle, Eye, DollarSign } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Permission {
  id: string;
  companyName: string;
  companyLogo?: string;
  accessTypes: string[];
  monthlyPayment: number;
  status: string;
}

interface PermissionsPanelProps {
  permissions: Permission[];
}

// Predefined data categories for privacy compliance
const DATA_CATEGORIES = [
  { id: "location", label: "Location History", description: "GPS coordinates and location patterns", icon: "📍" },
  { id: "browsing", label: "Browsing Activity", description: "Website visits and search history (aggregated)", icon: "🔍" },
  { id: "app_usage", label: "App Usage Time", description: "Time spent on different applications", icon: "📱" },
  { id: "health", label: "Health Data", description: "Fitness and health metrics (if connected)", icon: "❤️" },
  { id: "purchase", label: "Purchase History", description: "Shopping patterns and transaction data", icon: "🛒" },
  { id: "social", label: "Social Activity", description: "Social media interactions and connections", icon: "👥" },
  { id: "demographics", label: "Demographics", description: "Age, gender, and basic profile information", icon: "👤" },
  { id: "preferences", label: "Preferences", description: "App settings and personal preferences", icon: "⚙️" },
];

// Predefined company offers (in real app, this would come from company registrations)
const COMPANY_OFFERS = [
  { company: "HDFC Bank", logo: "🏦", categories: ["location", "purchase", "demographics"], price: 500, duration: 6 },
  { company: "XYZ AdTech", logo: "📊", categories: ["browsing", "app_usage", "preferences"], price: 300, duration: 12 },
  { company: "HealthCorp", logo: "🏥", categories: ["health", "demographics"], price: 800, duration: 3 },
  { company: "ShopMart", logo: "🛍️", categories: ["purchase", "location", "preferences"], price: 400, duration: 9 },
];

export default function PermissionsPanel({ permissions }: PermissionsPanelProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isGrantDialogOpen, setIsGrantDialogOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<string>("");
  const [grantFormData, setGrantFormData] = useState({
    companyName: "",
    companyLogo: "",
    accessTypes: [] as string[],
    monthlyPayment: 0,
    duration: 12, // months
  });

  const grantMutation = useMutation({
    mutationFn: (data: any) =>
      apiRequest("POST", "/api/permissions/grant", data),
    onSuccess: () => {
      toast({
        title: "Permission Granted",
        description: "The permission has been successfully granted and recorded on blockchain.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["/api/permissions"] });
      setIsGrantDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to grant permission. Please try again.",
        variant: "destructive",
      });
    },
  });

  const approveMutation = useMutation({
    mutationFn: (permissionId: string) =>
      apiRequest("POST", "/api/permissions/approve", { permissionId }),
    onSuccess: () => {
      toast({
        title: "Permission Approved",
        description: "The permission has been successfully approved.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["/api/permissions"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to approve permission. Please try again.",
        variant: "destructive",
      });
    },
  });

  const revokeMutation = useMutation({
    mutationFn: (permissionId: string) =>
      apiRequest("POST", "/api/permissions/revoke", { permissionId }),
    onSuccess: () => {
      toast({
        title: "Permission Revoked",
        description: "The permission has been successfully revoked.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["/api/permissions"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to revoke permission. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleOfferSelect = (offerId: string) => {
    const offer = COMPANY_OFFERS.find(o => o.company === offerId);
    if (offer) {
      setSelectedOffer(offerId);
      setGrantFormData({
        companyName: offer.company,
        companyLogo: offer.logo,
        accessTypes: offer.categories,
        monthlyPayment: offer.price,
        duration: offer.duration,
      });
    }
  };

  const handleCategoryToggle = (categoryId: string) => {
    setGrantFormData(prev => ({
      ...prev,
      accessTypes: prev.accessTypes.includes(categoryId)
        ? prev.accessTypes.filter(id => id !== categoryId)
        : [...prev.accessTypes, categoryId]
    }));
  };

  const handleGrantSubmit = () => {
    if (grantFormData.accessTypes.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one data category to grant access.",
        variant: "destructive",
      });
      return;
    }

    const monthlyPaymentInPaise = Math.round(grantFormData.monthlyPayment * 100);

    grantMutation.mutate({
      companyName: grantFormData.companyName,
      companyLogo: grantFormData.companyLogo || undefined,
      accessTypes: grantFormData.accessTypes,
      monthlyPayment: monthlyPaymentInPaise,
      duration: grantFormData.duration,
    });
  };

  const resetForm = () => {
    setSelectedOffer("");
    setGrantFormData({
      companyName: "",
      companyLogo: "",
      accessTypes: [],
      monthlyPayment: 0,
      duration: 12,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "revoked":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return CheckCircle;
      case "pending":
        return Clock;
      case "revoked":
        return XCircle;
      default:
        return Shield;
    }
  };

  const getDefaultLogo = (companyName: string) => {
    const hash = companyName.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    const gradients = [
      'from-blue-500 to-purple-600',
      'from-green-500 to-blue-600', 
      'from-purple-500 to-pink-600',
      'from-yellow-500 to-orange-600',
      'from-cyan-500 to-blue-600'
    ];
    return gradients[Math.abs(hash) % gradients.length];
  };

  // Mock permissions for demo if none provided
  const mockPermissions = permissions.length ? permissions : [
    {
      id: '1',
      companyName: 'TechCorp Analytics',
      companyLogo: '🏢',
      accessTypes: ['Browsing Data', 'Location'],
      monthlyPayment: 50000, // in paise
      status: 'active'
    },
    {
      id: '2',
      companyName: 'DataMining Inc',
      companyLogo: '⛏️',
      accessTypes: ['Social Media', 'Purchases'],
      monthlyPayment: 75000,
      status: 'pending'
    },
    {
      id: '3',
      companyName: 'Market Research Co',
      companyLogo: '📊',
      accessTypes: ['Demographics', 'Preferences'],
      monthlyPayment: 30000,
      status: 'active'
    }
  ];

  return (
    <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white">Permission Management</h3>
          </div>
          <Dialog open={isGrantDialogOpen} onOpenChange={setIsGrantDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0"
                data-testid="button-grant-access"
              >
                <Plus className="mr-2 h-4 w-4" />
                Grant Access
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto bg-gray-800 border-gray-700 text-white">
              <DialogHeader>
                <DialogTitle className="text-white">Grant Data Access Permission</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Select a company offer or create a custom permission to grant access to your data.
                </DialogDescription>
              </DialogHeader>
              <div>
                <div className="grid gap-6 py-4">
                  {/* Company Selection */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium text-white">Select Company Offer</Label>
                    <div className="grid grid-cols-1 gap-3">
                      {COMPANY_OFFERS.map((offer) => (
                        <div
                          key={offer.company}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            selectedOffer === offer.company
                              ? "border-blue-500 bg-blue-500/10"
                              : "border-gray-600 hover:bg-gray-700/50"
                          }`}
                          onClick={() => handleOfferSelect(offer.company)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <span className="text-2xl">{offer.logo}</span>
                              <div>
                                <div className="font-medium text-white">{offer.company}</div>
                                <div className="text-sm text-gray-400">
                                  ₹{offer.price}/month • {offer.duration} months
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-400">
                                {offer.categories.length} data types
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Custom Company (if no offer selected) */}
                  {!selectedOffer && (
                    <div className="space-y-3">
                      <Label className="text-base font-medium text-white">Or Enter Company Details</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="companyName" className="text-gray-300">Company Name</Label>
                          <Input
                            id="companyName"
                            value={grantFormData.companyName}
                            onChange={(e) => setGrantFormData({...grantFormData, companyName: e.target.value})}
                            placeholder="e.g., HDFC Bank"
                            className="bg-gray-700 border-gray-600 text-white"
                          />
                        </div>
                        <div>
                          <Label htmlFor="companyLogo" className="text-gray-300">Company Logo</Label>
                          <Input
                            id="companyLogo"
                            value={grantFormData.companyLogo}
                            onChange={(e) => setGrantFormData({...grantFormData, companyLogo: e.target.value})}
                            placeholder="🏦 or URL"
                            className="bg-gray-700 border-gray-600 text-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Data Categories */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium text-white">Data Categories to Grant Access</Label>
                    <div className="text-sm text-gray-400 mb-3">
                      Select the specific types of data you want to share. This ensures transparency and compliance.
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      {DATA_CATEGORIES.map((category) => (
                        <div
                          key={category.id}
                          className="flex items-start space-x-3 p-3 border border-gray-600 rounded-lg bg-gray-700/30"
                        >
                          <Checkbox
                            id={category.id}
                            checked={grantFormData.accessTypes.includes(category.id)}
                            onCheckedChange={() => handleCategoryToggle(category.id)}
                            className="border-gray-500 data-[state=checked]:bg-blue-500"
                          />
                          <div className="flex-1">
                            <Label
                              htmlFor={category.id}
                              className="font-medium cursor-pointer text-white flex items-center space-x-2"
                            >
                              <span>{category.icon}</span>
                              <span>{category.label}</span>
                            </Label>
                            <p className="text-sm text-gray-400">
                              {category.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Payment and Duration */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="monthlyPayment" className="text-gray-300">Monthly Payment (₹)</Label>
                      <Input
                        id="monthlyPayment"
                        type="number"
                        value={grantFormData.monthlyPayment}
                        onChange={(e) => setGrantFormData({...grantFormData, monthlyPayment: Number(e.target.value)})}
                        placeholder="500"
                        min="0"
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="duration" className="text-gray-300">Duration (months)</Label>
                      <Select
                        value={grantFormData.duration.toString()}
                        onValueChange={(value) => setGrantFormData({...grantFormData, duration: Number(value)})}
                      >
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="1">1 month</SelectItem>
                          <SelectItem value="3">3 months</SelectItem>
                          <SelectItem value="6">6 months</SelectItem>
                          <SelectItem value="12">12 months</SelectItem>
                          <SelectItem value="24">24 months</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Summary */}
                  {grantFormData.accessTypes.length > 0 && (
                    <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                      <h4 className="font-medium mb-2 text-blue-400">Permission Summary</h4>
                      <div className="text-sm space-y-1 text-gray-300">
                        <div><strong>Company:</strong> {grantFormData.companyName || "Custom"}</div>
                        <div><strong>Data Types:</strong> {grantFormData.accessTypes.length} selected</div>
                        <div><strong>Payment:</strong> ₹{grantFormData.monthlyPayment}/month</div>
                        <div><strong>Duration:</strong> {grantFormData.duration} months</div>
                        <div><strong>Total Value:</strong> ₹{grantFormData.monthlyPayment * grantFormData.duration}</div>
                      </div>
                    </div>
                  )}
                </div>
                <DialogFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsGrantDialogOpen(false);
                      resetForm();
                    }}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleGrantSubmit}
                    disabled={grantMutation.isPending || grantFormData.accessTypes.length === 0}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0"
                  >
                    {grantMutation.isPending ? "Granting..." : "Grant Permission"}
                  </Button>
                </DialogFooter>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="space-y-4">
          {mockPermissions.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-400">No permissions found. Grant access to companies to start earning.</p>
            </div>
          ) : (
            mockPermissions.map((permission) => {
              const StatusIcon = getStatusIcon(permission.status);
              return (
                <div 
                  key={permission.id}
                  className="p-4 bg-gray-700/30 rounded-lg border border-gray-600 hover:border-blue-500/50 transition-all duration-200"
                  data-testid={`permission-item-${permission.id}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {permission.companyLogo ? (
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden">
                          {permission.companyLogo.startsWith('data:image/svg+xml;base64,') ? (
                            <img 
                              src={permission.companyLogo} 
                              alt={`${permission.companyName} logo`}
                              className="w-full h-full object-cover"
                            />
                          ) : permission.companyLogo.startsWith('http') ? (
                            <img 
                              src={permission.companyLogo} 
                              alt={`${permission.companyName} logo`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center text-2xl">
                              {permission.companyLogo}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className={`w-12 h-12 bg-gradient-to-r ${getDefaultLogo(permission.companyName)} rounded-lg flex items-center justify-center`}>
                          <span className="text-white font-semibold text-lg">
                            {permission.companyName.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div>
                        <h4 className="font-medium text-white mb-1" data-testid={`company-name-${permission.id}`}>
                          {permission.companyName}
                        </h4>
                        <div className="flex items-center space-x-2 mb-2">
                          <Eye className="w-4 h-4 text-blue-400" />
                          <p className="text-sm text-blue-300" data-testid={`access-types-${permission.id}`}>
                            Access: {permission.accessTypes.join(", ")}
                          </p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <DollarSign className="w-4 h-4 text-green-400" />
                            <p className="text-sm font-medium text-green-400" data-testid={`payment-${permission.id}`}>
                              ₹{(permission.monthlyPayment / 100).toLocaleString()}/month
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className={`flex items-center space-x-2 px-3 py-1 text-xs rounded-full border ${getStatusColor(permission.status)}`}>
                        <StatusIcon className="w-3 h-3" />
                        <span data-testid={`status-${permission.id}`}>
                          {permission.status.charAt(0).toUpperCase() + permission.status.slice(1)}
                        </span>
                      </div>
                      
                      {permission.status === "active" ? (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => revokeMutation.mutate(permission.id)}
                          disabled={revokeMutation.isPending}
                          className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                          data-testid={`button-revoke-${permission.id}`}
                        >
                          {revokeMutation.isPending ? "Revoking..." : "Revoke"}
                        </Button>
                      ) : permission.status === "pending" ? (
                        <Button 
                          size="sm"
                          onClick={() => approveMutation.mutate(permission.id)}
                          disabled={approveMutation.isPending}
                          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0"
                          data-testid={`button-approve-${permission.id}`}
                        >
                          {approveMutation.isPending ? "Approving..." : "Approve"}
                        </Button>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}