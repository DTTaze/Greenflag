import { Coins, Star } from "lucide-react";
import React from "react";

import { Button } from "@/src/components/ui/button";
import getAmount from "@/src/utils/getAmount";

import { getStatusColor, getStatusLabel } from "./userListHelpers";

export default function UserMobileList({ users, onEvaluate, onAddToEvent }) {
  const getBadgeClass = (status) => {
    const color = getStatusColor(status);
    switch (color) {
      case "success":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "primary":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "error":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      {users.map((user) => (
        <div
          key={user.id}
          className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
        >
          <div className="mb-4 flex items-center gap-3">
            <img
              src={user.avatar}
              alt={user.full_name}
              className="h-12 w-12 rounded-full border border-gray-100 object-cover"
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {user.full_name}
              </h3>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>

          <hr className="my-3 border-gray-200" />

          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs font-medium text-gray-400">
                Total Events
              </div>
              <div className="text-sm font-semibold text-gray-700">
                {user.events.length}
              </div>
            </div>
            <div>
              <div className="text-xs font-medium text-gray-400">Coins</div>
              <div className="mt-0.5 flex items-center gap-1">
                <Coins className="text-amber-500" size={16} />
                <span className="text-sm font-semibold text-gray-700">
                  {getAmount(user.coins)}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-2 text-sm font-semibold text-gray-700">Events</div>
          <div className="space-y-2">
            {user.events.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between rounded-md border border-gray-100 bg-gray-50 p-2"
              >
                <div>
                  <div className="text-xs font-semibold text-gray-800">
                    {event.title}
                  </div>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span
                      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${getBadgeClass(event.status)}`}
                    >
                      {getStatusLabel(event.status)}
                    </span>
                    <span className="text-[10px] text-gray-500">
                      {event.completion_rate}% completed
                    </span>
                  </div>
                </div>
                {onEvaluate && (
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-7 w-7 border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                    onClick={() => onEvaluate(user, event.id)}
                  >
                    <Star size={14} />
                  </Button>
                )}
              </div>
            ))}
          </div>

          {onAddToEvent && (
            <div className="mt-4 flex justify-end">
              <Button
                size="sm"
                className="bg-emerald-600 text-white hover:bg-emerald-700"
                onClick={() => onAddToEvent(user)}
              >
                Add to Event
              </Button>
            </div>
          )}
        </div>
      ))}

      {users.length === 0 && (
        <div className="border-gray-150 rounded-lg border bg-gray-50 py-8 text-center text-gray-500">
          <div className="text-base font-semibold">No users found</div>
          <div className="text-sm text-gray-400">
            Try adjusting your search or filters
          </div>
        </div>
      )}
    </div>
  );
}
