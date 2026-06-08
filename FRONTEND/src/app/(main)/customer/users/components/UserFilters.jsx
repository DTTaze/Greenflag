import React from "react";
import { Search } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";

const UserFilters = ({ events, filters, onFilterChange, onReset }) => {
  return (
    <div className="flex flex-wrap items-center gap-4 mb-6">
      <div className="relative min-w-[250px] flex-1 sm:flex-initial">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </span>
        <Input
          type="text"
          placeholder="Search by name or email"
          value={filters.search}
          onChange={(e) => onFilterChange("search", e.target.value)}
          className="pl-10 h-10 w-full"
        />
      </div>

      <div className="min-w-[200px] flex-1 sm:flex-initial">
        <select
          value={filters.eventId}
          onChange={(e) => onFilterChange("eventId", e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
        className="ml-auto w-full sm:w-auto h-10"
      >
        Reset Filters
      </Button>
    </div>
  );
};

export default UserFilters;
