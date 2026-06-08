import React from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";

const ItemFilters = ({ filters, onFilterChange, onReset }) => {
  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "available", label: "Available" },
    { value: "sold_out", label: "Sold Out" },
    { value: "pending", label: "Pending" },
  ];

  const handlePriceChange = (e) => {
    const value = e.target.value;
    if (value === "" || (!isNaN(value) && value >= 0)) {
      onFilterChange("minPrice", value);
    }
  };

  return (
    <div className="mb-6 grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
      <div className="sm:col-span-4 relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </span>
        <Input
          type="text"
          placeholder="Search items..."
          value={filters.search}
          onChange={(e) => onFilterChange("search", e.target.value)}
          className="pl-10 h-10 w-full"
        />
      </div>

      <div className="sm:col-span-3 relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <SlidersHorizontal size={18} className="text-gray-400" />
        </span>
        <select
          value={filters.status}
          onChange={(e) => onFilterChange("status", e.target.value)}
          className="flex h-10 w-full pl-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="sm:col-span-3 relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400 text-sm font-semibold select-none">
          $
        </span>
        <Input
          type="number"
          placeholder="Min Price"
          value={filters.minPrice}
          onChange={handlePriceChange}
          className="pl-8 h-10 w-full"
        />
      </div>

      <div className="sm:col-span-2">
        <Button
          variant="outline"
          onClick={onReset}
          className="h-10 w-full"
        >
          Reset
        </Button>
      </div>
    </div>
  );
};

export default ItemFilters;
