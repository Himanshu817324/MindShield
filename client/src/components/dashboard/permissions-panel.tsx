import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

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

export default function PermissionsPanel({ permissions }: PermissionsPanelProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
          <Button 
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            data-testid="button-grant-access"
          >
            <Plus className="mr-2 h-4 w-4" />
            Grant Access
          </Button>
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
                      data-testid={`button-approve-${permission.id}`}
                    >
                      Approve
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
