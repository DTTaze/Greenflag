import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";

export default function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: "Select an Event",
      description:
        "Choose the event that participants will be joining or leaving. This ensures users are added to or removed from the correct event.",
    },
    {
      number: 2,
      title: "Choose Action",
      description:
        "Select whether you want to check in (add) or check out (remove) participants from the event.",
    },
    {
      number: 3,
      title: "Scan User QR Code",
      description:
        "Ask participants to show their unique QR code from their user profile or event registration email.",
    },
    {
      number: 4,
      title: "Confirm Action",
      description:
        "The system automatically registers or removes the user from the event. You can view and manage all participants in the list.",
    },
  ];

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold text-gray-800 mb-6">
        How It Works
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {steps.map((step) => (
          <Card
            key={step.number}
            className="h-full border border-emerald-100 hover:border-emerald-250 transition-colors bg-white shadow-sm"
          >
            <CardHeader className="pb-2">
              <span className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">
                Step {step.number}
              </span>
              <CardTitle className="text-lg font-bold text-gray-850">
                {step.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 leading-relaxed">
                {step.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
