import React from "react";
import { Coins, Star } from "lucide-react";
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
        <div key={user.id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <img
              src={user.avatar}
              alt={user.full_name}
              className="h-12 w-12 rounded-full object-cover border border-gray-100"
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{user.full_name}</h3>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>

          <hr className="border-gray-200 my-3" />

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-xs text-gray-400 font-medium">Total Events</div>
              <div className="text-sm font-semibold text-gray-700">{user.events.length}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400 font-medium">Coins</div>
              <div className="flex items-center gap-1 mt-0.5">
                <Coins className="text-amber-500" size={16} />
                <span className="text-sm font-semibold text-gray-700">
                  {getAmount(user.coins)}
                </span>
              </div>
            </div>
          </div>

          <div className="text-sm font-semibold text-gray-700 mb-2">Events</div>
          <div className="space-y-2">
            {user.events.map((event) => (
              <div
                key={event.id}
                className="flex justify-between items-center p-2 bg-gray-50 border border-gray-100 rounded-md"
              >
                <div>
                  <div className="text-xs font-semibold text-gray-800">{event.title}</div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${getBadgeClass(event.status)}`}>
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
                    className="h-7 w-7 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-200"
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
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={() => onAddToEvent(user)}
              >
                Add to Event
              </Button>
            </div>
          )}
        </div>
      ))}

      {users.length === 0 && (
        <div className="text-center py-8 bg-gray-50 border border-gray-150 rounded-lg text-gray-500">
          <div className="text-base font-semibold">No users found</div>
          <div className="text-sm text-gray-400">Try adjusting your search or filters</div>
        </div>
      )}
    </div>
  );
}
