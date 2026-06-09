import { Search, SlidersHorizontal } from "lucide-react";
import React from "react";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";

const EventFilters = ({ filters, onFilterChange, onReset }) => {
  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "upcoming", label: "Upcoming" },
    { value: "completed", label: "Completed" },
  ];

  const handlePriceChange = (e) => {
    const value = e.target.value;
    if (value === "" || (!isNaN(value) && value >= 0)) {
      onFilterChange("minPrice", value);
    }
  };

  return (
    <div className="mb-6 grid grid-cols-1 items-end gap-4 sm:grid-cols-12">
      <div className="relative sm:col-span-4">
        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search size={18} className="text-gray-400" />
        </span>
        <Input
          type="text"
          placeholder="Search events..."
          value={filters.search}
          onChange={(e) => onFilterChange("search", e.target.value)}
          className="h-10 w-full pl-10"
        />
      </div>

      <div className="relative sm:col-span-3">
        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <SlidersHorizontal size={18} className="text-gray-400" />
        </span>
        <select
          value={filters.status}
          onChange={(e) => onFilterChange("status", e.target.value)}
          className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 pl-10 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="relative sm:col-span-3">
        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sm font-semibold text-gray-400 select-none">
          $
        </span>
        <Input
          type="number"
          placeholder="Min Price"
          value={filters.minPrice}
          onChange={handlePriceChange}
          className="h-10 w-full pl-8"
        />
      </div>

      <div className="sm:col-span-2">
        <Button variant="outline" onClick={onReset} className="h-10 w-full">
          Reset
        </Button>
      </div>
    </div>
  );
};

export default EventFilters;
