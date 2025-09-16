import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function EarningsCalculator() {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [usageHours, setUsageHours] = useState([8]);
  const [calculatedEarnings, setCalculatedEarnings] = useState<number | null>(null);
  const { toast } = useToast();

  const platforms = [
    { id: "google", label: "Google" },
    { id: "facebook", label: "Facebook" },
    { id: "instagram", label: "Instagram" },
    { id: "twitter", label: "Twitter" },
  ];

  const calculateMutation = useMutation({
    mutationFn: (data: { platforms: string[]; hours: number }) =>
      apiRequest("POST", "/api/earnings/calc", data),
    onSuccess: async (response) => {
      const result = await response.json();
      setCalculatedEarnings(result.estimated);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to calculate earnings. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handlePlatformChange = (platformId: string, checked: boolean) => {
    if (checked) {
      setSelectedPlatforms(prev => [...prev, platformId]);
    } else {
      setSelectedPlatforms(prev => prev.filter(id => id !== platformId));
    }
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPlatforms.length === 0) {
      toast({
        title: "No Platforms Selected",
        description: "Please select at least one platform to calculate earnings.",
        variant: "destructive",
      });
      return;
    }
    
    calculateMutation.mutate({
      platforms: selectedPlatforms,
      hours: usageHours[0],
    });
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-6">Earnings Calculator</h3>
        
        <form onSubmit={handleCalculate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Platforms</label>
            <div className="grid grid-cols-2 gap-2">
              {platforms.map((platform) => (
                <div key={platform.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={platform.id}
                    checked={selectedPlatforms.includes(platform.id)}
                    onCheckedChange={(checked) => 
                      handlePlatformChange(platform.id, checked as boolean)
                    }
                    data-testid={`checkbox-${platform.id}`}
                  />
                  <label 
                    htmlFor={platform.id} 
                    className="text-sm cursor-pointer"
                    data-testid={`label-${platform.id}`}
                  >
                    {platform.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Usage Hours/Day</label>
            <Slider
              value={usageHours}
              onValueChange={setUsageHours}
              max={24}
              min={1}
              step={1}
              className="w-full"
              data-testid="slider-usage-hours"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>1h</span>
              <span data-testid="text-hours-display">{usageHours[0]}h</span>
              <span>24h</span>
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={calculateMutation.isPending}
            data-testid="button-calculate-earnings"
          >
            {calculateMutation.isPending ? "Calculating..." : "Calculate Potential Earnings"}
          </Button>
        </form>
        
        <div className="mt-6 p-4 bg-secondary rounded-lg">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Estimated Monthly Earnings</p>
            <p className="text-2xl font-bold text-green-600" data-testid="text-calculated-earnings">
              {calculatedEarnings !== null 
                ? `₹${calculatedEarnings.toLocaleString()}` 
                : "₹0"
              }
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
