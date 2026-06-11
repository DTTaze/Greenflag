import { Calendar, Coins, Leaf, Truck } from "lucide-react";
import React from "react";

export interface ActivityItem {
  id: number;
  title: string;
  date: string;
  icon: React.ReactNode;
  color: string;
}

export interface Achievement {
  id: number;
  title: string;
  description: string;
  locked: boolean;
}

export const recentActivities: ActivityItem[] = [
  {
    id: 1,
    title: "Completed Eco Cleanup Event",
    date: "Today",
    icon: <Leaf size={16} className="text-emerald-600" />,
    color: "bg-emerald-50",
  },
  {
    id: 2,
    title: "Earned 150 Eco Coins",
    date: "Yesterday",
    icon: <Coins size={16} className="text-amber-500" />,
    color: "bg-amber-50",
  },
  {
    id: 3,
    title: "Order Delivered",
    date: "2 days ago",
    icon: <Truck size={16} className="text-blue-600" />,
    color: "bg-blue-50",
  },
  {
    id: 4,
    title: "Event Registration Confirmed",
    date: "3 days ago",
    icon: <Calendar size={16} className="text-purple-600" />,
    color: "bg-purple-50",
  },
];

export const achievements: Achievement[] = [
  {
    id: 1,
    title: "Eco Warrior",
    description: "Reduced 1000kg CO2",
    locked: false,
  },
  {
    id: 2,
    title: "Community Hero",
    description: "Attended 5 events",
    locked: false,
  },
  {
    id: 3,
    title: "Green Champion",
    description: "Next: 2000kg CO2",
    locked: true,
  },
];
