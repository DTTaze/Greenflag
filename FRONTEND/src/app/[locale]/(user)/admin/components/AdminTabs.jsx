"use client";

import React from "react";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";

export default function AdminTabs({ tabs }) {
  if (!tabs || tabs.length === 0) return null;

  return (
    <Tabs defaultValue="0" className="w-full">
      <div className="mb-6 border-b border-emerald-100 dark:border-emerald-500/10">
        <TabsList
          variant="line"
          className="flex h-auto gap-4 bg-transparent p-0"
        >
          {tabs.map((tab, index) => (
            <TabsTrigger
              key={index}
              value={String(index)}
              className="rounded-none border-b-2 border-transparent bg-transparent px-4 py-2.5 text-sm font-medium text-gray-500 transition-all hover:text-gray-900 focus:outline-none data-[state=active]:border-emerald-600 data-[state=active]:text-emerald-700"
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
