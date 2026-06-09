import { Search } from "lucide-react";
import React from "react";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";

const UserFilters = ({ events, filters, onFilterChange, onReset }) => {
  return (
    <div className="mb-6 flex flex-wrap items-center gap-4">
      <div className="relative min-w-[250px] flex-1 sm:flex-initial">
        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search size={18} className="text-gray-400" />
        </span>
        <Input
          type="text"
          placeholder="Search by name or email"
          value={filters.search}
          onChange={(e) => onFilterChange("search", e.target.value)}
          className="h-10 w-full pl-10"
        />
      </div>

      <div className="min-w-[200px] flex-1 sm:flex-initial">
        <select
          value={filters.eventId}
          onChange={(e) => onFilterChange("eventId", e.target.value)}
          className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">All Events</option>
          {events.map((event) => (
            <option key={event.id} value={event.id}>
              {event.title}
            </option>
          ))}
        </select>
      </div>

      <Button
        variant="outline"
        onClick={onReset}
        className="ml-auto h-10 w-full sm:w-auto"
      >
        Reset Filters
      </Button>
    </div>
  );
};

export default UserFilters;
