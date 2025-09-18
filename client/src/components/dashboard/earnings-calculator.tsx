import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Calculator, Minus, Plus } from "lucide-react";

export default // EarningsCalculator Component
function EarningsCalculator() {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [usageHours, setUsageHours] = useState([8]);
  const [calculatedEarnings, setCalculatedEarnings] = useState<number | null>(null);
  const [calculatorValue, setCalculatorValue] = useState(1000);
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

  const handleCalculate = () => {
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
    <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
      <CardContent className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Calculator className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-white">Earnings Calculator</h3>
        </div>
        
        <div className="space-y-6">
          {/* Platform Selection */}
          <div>
            <label className="block text-sm font-medium mb-3 text-white">Select Platforms</label>
            <div className="grid grid-cols-2 gap-3">
              {platforms.map((platform) => (
                <div key={platform.id} className="flex items-center space-x-3 p-2 bg-gray-700/30 rounded-lg border border-gray-600/50">
                  <Checkbox
                    id={platform.id}
                    checked={selectedPlatforms.includes(platform.id)}
                    onCheckedChange={(checked) => 
                      handlePlatformChange(platform.id, checked as boolean)
                    }
                    className="border-gray-500 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                    data-testid={`checkbox-${platform.id}`}
                  />
                  <label 
                    htmlFor={platform.id} 
                    className="text-sm cursor-pointer text-gray-300"
                    data-testid={`label-${platform.id}`}
                  >
                    {platform.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Usage Hours Slider */}
          <div>
            <label className="block text-sm font-medium mb-3 text-white">Daily Usage Hours</label>
            <div className="p-4 bg-gray-700/30 rounded-lg border border-gray-600/50">
              <Slider
                value={usageHours}
                onValueChange={setUsageHours}
                max={24}
                min={1}
                step={1}
                className="w-full"
                data-testid="slider-usage-hours"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>1h</span>
                <span className="text-blue-400 font-medium" data-testid="text-hours-display">{usageHours[0]}h</span>
                <span>24h</span>
              </div>
            </div>
          </div>
          
          {/* Data Value Calculator */}
          <div>
            <label className="text-sm font-medium text-white mb-3 block">Data Value (₹/month)</label>
            <div className="flex items-center space-x-3 p-4 bg-gray-700/30 rounded-lg border border-gray-600/50">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setCalculatorValue(Math.max(0, calculatorValue - 100))}
                className="border-gray-600 text-gray-300 hover:text-blue-400"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <div className="flex-1 text-center">
                <span className="text-2xl font-bold text-white">₹{calculatorValue.toLocaleString()}</span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setCalculatorValue(calculatorValue + 100)}
                className="border-gray-600 text-gray-300 hover:text-blue-400"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <Button 
            onClick={handleCalculate}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 font-medium"
            disabled={calculateMutation.isPending}
            data-testid="button-calculate-earnings"
          >
            <Calculator className="mr-2 h-4 w-4" />
            {calculateMutation.isPending ? "Calculating..." : "Calculate Potential Earnings"}
          </Button>
        </div>
        
        {/* Results Display */}
        <div className="mt-6 p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg">
          <div className="text-center">
            <p className="text-sm text-green-300 mb-2">Estimated Monthly Earnings</p>
            <p className="text-3xl font-bold text-green-400 mb-2" data-testid="text-calculated-earnings">
              {calculatedEarnings !== null 
                ? `₹${calculatedEarnings.toLocaleString()}` 
                : `₹${(calculatorValue * 0.7).toLocaleString()}`
              }
            </p>
            <p className="text-xs text-green-300">Based on current market rates</p>
          </div>
        </div>
        
        {/* Projected Earnings based on calculator value */}
        <div className="mt-4 p-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-300">Projected from Data Value:</span>
            <span className="text-lg font-bold text-blue-400">₹{(calculatorValue * 0.7).toLocaleString()}/month</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

