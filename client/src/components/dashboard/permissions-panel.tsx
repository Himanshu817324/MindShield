import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
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
  { id: "location", label: "📍 Location History", description: "GPS coordinates and location patterns" },
  { id: "browsing", label: "🔍 Browsing Activity", description: "Website visits and search history (aggregated)" },
  { id: "app_usage", label: "📱 App Usage Time", description: "Time spent on different applications" },
  { id: "health", label: "❤️ Health Data", description: "Fitness and health metrics (if connected)" },
  { id: "purchase", label: "🛒 Purchase History", description: "Shopping patterns and transaction data" },
  { id: "social", label: "👥 Social Activity", description: "Social media interactions and connections" },
  { id: "demographics", label: "👤 Demographics", description: "Age, gender, and basic profile information" },
  { id: "preferences", label: "⚙️ Preferences", description: "App settings and personal preferences" },
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

  const handleGrantSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
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
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-amber-100 text-amber-800";
      case "revoked":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDefaultLogo = (companyName: string) => {
    const hash = companyName.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500', 'bg-yellow-500'];
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <Card>
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Permission Management</h3>
          <Dialog open={isGrantDialogOpen} onOpenChange={setIsGrantDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                data-testid="button-grant-access"
              >
                <Plus className="mr-2 h-4 w-4" />
                Grant Access
              </Button>
            </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Grant Data Access Permission</DialogTitle>
                        <DialogDescription>
                          Select a company offer or create a custom permission to grant access to your data.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleGrantSubmit}>
                        <div className="grid gap-6 py-4">
                          {/* Company Selection */}
                          <div className="space-y-3">
                            <Label className="text-base font-medium">Select Company Offer</Label>
                            <div className="grid grid-cols-1 gap-3">
                              {COMPANY_OFFERS.map((offer) => (
                                <div
                                  key={offer.company}
                                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                                    selectedOffer === offer.company
                                      ? "border-primary bg-primary/5"
                                      : "border-border hover:bg-muted/50"
                                  }`}
                                  onClick={() => handleOfferSelect(offer.company)}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                      <span className="text-2xl">{offer.logo}</span>
                                      <div>
                                        <div className="font-medium">{offer.company}</div>
                                        <div className="text-sm text-muted-foreground">
                                          ₹{offer.price}/month • {offer.duration} months
                                        </div>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <div className="text-sm text-muted-foreground">
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
                              <Label className="text-base font-medium">Or Enter Company Details</Label>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="companyName">Company Name</Label>
                                  <Input
                                    id="companyName"
                                    value={grantFormData.companyName}
                                    onChange={(e) => setGrantFormData({...grantFormData, companyName: e.target.value})}
                                    placeholder="e.g., HDFC Bank"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="companyLogo">Company Logo</Label>
                                  <Input
                                    id="companyLogo"
                                    value={grantFormData.companyLogo}
                                    onChange={(e) => setGrantFormData({...grantFormData, companyLogo: e.target.value})}
                                    placeholder="🏦 or URL"
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Data Categories */}
                          <div className="space-y-3">
                            <Label className="text-base font-medium">Data Categories to Grant Access</Label>
                            <div className="text-sm text-muted-foreground mb-3">
                              Select the specific types of data you want to share. This ensures transparency and compliance.
                            </div>
                            <div className="grid grid-cols-1 gap-3">
                              {DATA_CATEGORIES.map((category) => (
                                <div
                                  key={category.id}
                                  className="flex items-start space-x-3 p-3 border rounded-lg"
                                >
                                  <Checkbox
                                    id={category.id}
                                    checked={grantFormData.accessTypes.includes(category.id)}
                                    onCheckedChange={() => handleCategoryToggle(category.id)}
                                  />
                                  <div className="flex-1">
                                    <Label
                                      htmlFor={category.id}
                                      className="font-medium cursor-pointer"
                                    >
                                      {category.label}
                                    </Label>
                                    <p className="text-sm text-muted-foreground">
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
                              <Label htmlFor="monthlyPayment">Monthly Payment (₹)</Label>
                              <Input
                                id="monthlyPayment"
                                type="number"
                                value={grantFormData.monthlyPayment}
                                onChange={(e) => setGrantFormData({...grantFormData, monthlyPayment: Number(e.target.value)})}
                                placeholder="500"
                                min="0"
                              />
                            </div>
                            <div>
                              <Label htmlFor="duration">Duration (months)</Label>
                              <Select
                                value={grantFormData.duration.toString()}
                                onValueChange={(value) => setGrantFormData({...grantFormData, duration: Number(value)})}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
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
                            <div className="p-4 bg-muted/50 rounded-lg">
                              <h4 className="font-medium mb-2">Permission Summary</h4>
                              <div className="text-sm space-y-1">
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
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setIsGrantDialogOpen(false);
                              resetForm();
                            }}
                          >
                            Cancel
                          </Button>
                          <Button type="submit" disabled={grantMutation.isPending || grantFormData.accessTypes.length === 0}>
                            {grantMutation.isPending ? "Granting..." : "Grant Permission"}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="space-y-4">
          {permissions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No permissions found. Grant access to companies to start earning.</p>
            </div>
          ) : (
            permissions.map((permission) => (
              <div 
                key={permission.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg"
                data-testid={`permission-item-${permission.id}`}
              >
                <div className="flex items-center space-x-4">
                  {permission.companyLogo ? (
                    <img 
                      src={permission.companyLogo} 
                      alt={`${permission.companyName} logo`}
                      className="w-12 h-12 rounded-lg object-cover" 
                    />
                  ) : (
                    <div className={`w-12 h-12 ${getDefaultLogo(permission.companyName)} rounded-lg flex items-center justify-center`}>
                      <span className="text-white font-semibold text-lg">
                        {permission.companyName.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <h4 className="font-medium" data-testid={`company-name-${permission.id}`}>
                      {permission.companyName}
                    </h4>
                    <p className="text-sm text-muted-foreground" data-testid={`access-types-${permission.id}`}>
                      Access: {permission.accessTypes.join(", ")}
                    </p>
                    <p className="text-sm text-green-600" data-testid={`payment-${permission.id}`}>
                      ₹{(permission.monthlyPayment / 100).toLocaleString()}/month
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span 
                    className={`px-2 py-1 text-xs rounded-full ${getStatusColor(permission.status)}`}
                    data-testid={`status-${permission.id}`}
                  >
                    {permission.status.charAt(0).toUpperCase() + permission.status.slice(1)}
                  </span>
                  {permission.status === "active" ? (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => revokeMutation.mutate(permission.id)}
                      disabled={revokeMutation.isPending}
                      data-testid={`button-revoke-${permission.id}`}
                    >
                      {revokeMutation.isPending ? "Revoking..." : "Revoke"}
                    </Button>
                  ) : permission.status === "pending" ? (
                    <Button 
                      size="sm"
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                      onClick={() => approveMutation.mutate(permission.id)}
                      disabled={approveMutation.isPending}
                      data-testid={`button-approve-${permission.id}`}
                    >
                      {approveMutation.isPending ? "Approving..." : "Approve"}
                    </Button>
                  ) : null}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
