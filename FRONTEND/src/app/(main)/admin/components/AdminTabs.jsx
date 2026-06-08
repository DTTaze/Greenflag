"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";

export default function AdminTabs({ tabs }) {
  if (!tabs || tabs.length === 0) return null;

  return (
    <Tabs defaultValue="0" className="w-full">
      <div className="border-b border-gray-200 mb-6">
        <TabsList variant="line" className="flex gap-4 p-0 bg-transparent h-auto">
          {tabs.map((tab, index) => (
            <TabsTrigger
              key={index}
              value={String(index)}
              className="py-2.5 px-4 text-sm font-medium text-gray-500 border-b-2 border-transparent data-[state=active]:border-emerald-600 data-[state=active]:text-emerald-700 hover:text-gray-900 transition-all focus:outline-none bg-transparent rounded-none"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      {tabs.map((tab, index) => (
        <TabsContent
          key={index}
          value={String(index)}
          className="focus:outline-none"
        >
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}
