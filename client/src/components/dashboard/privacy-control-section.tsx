"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

interface PrivacyControlSectionProps {
  privacyData?: {
    google?: number;
    facebook?: number;
    instagram?: number;
    other?: number;
  };
}

export default function PrivacyControlSection({
  privacyData,
}: PrivacyControlSectionProps) {
  const platforms = [
    { id: "google", label: "Google", percentage: privacyData?.google ?? 0 },
    { id: "facebook", label: "Facebook", percentage: privacyData?.facebook ?? 0 },
    { id: "instagram", label: "Instagram", percentage: privacyData?.instagram ?? 0 },
    { id: "other", label: "Other", percentage: privacyData?.other ?? 0 },
  ];

  return (
    <Card className="bg-white/5 backdrop-blur-lg border-white/10 mb-8">
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold text-white mb-6">
          Privacy Control
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {platforms.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between p-4 bg-black/20 rounded-lg"
            >
              <div>
                <p className="text-white font-medium">{p.label}</p>
                <p className="text-sm text-muted-foreground">
                  {p.percentage}% Data Shared
                </p>
              </div>
              <Switch defaultChecked={p.percentage > 0} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
