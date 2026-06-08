import React from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";

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
      <h3 className="mb-6 text-xl font-bold text-gray-800">How It Works</h3>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
        {steps.map((step) => (
          <Card
            key={step.number}
            className="hover:border-emerald-250 h-full border border-emerald-100 bg-white shadow-sm transition-colors"
          >
            <CardHeader className="pb-2">
              <span className="text-sm font-semibold tracking-wider text-emerald-600 uppercase">
                Step {step.number}
              </span>
              <CardTitle className="text-gray-850 text-lg font-bold">
                {step.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-gray-500">
                {step.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
