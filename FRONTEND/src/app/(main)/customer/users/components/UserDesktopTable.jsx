import React from "react";
import { Coins, UserMinus } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import getAmount from "@/src/utils/getAmount";
import { getStatusColor, getStatusLabel } from "./userListHelpers";

export default function UserDesktopTable({
  users,
  onRemoveUser,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}) {
  const totalPages = Math.ceil(users.length / rowsPerPage);
  
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

  const paginatedUsers = users.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div className="w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm text-gray-500">
          <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-700 border-b border-gray-200">
            <tr>
              <th scope="col" className="px-6 py-4">User</th>
              <th scope="col" className="px-6 py-4">Event</th>
              <th scope="col" className="px-6 py-4">Status</th>
              <th scope="col" className="px-6 py-4">Progress</th>
              <th scope="col" className="px-6 py-4">Coins</th>
              <th scope="col" className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 border-t border-gray-200">
            {paginatedUsers.map((user) => (
              <React.Fragment key={user.id}>
                {user.events.map((event, index) => (
                  <tr
                    key={`${user.id}-${event.id}`}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {index === 0 && (
                      <td
                        rowSpan={user.events.length}
                        className="px-6 py-4 font-medium text-gray-900 align-top"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={user.avatar}
                            alt={user.full_name}
                            className="h-10 w-10 rounded-full object-cover border border-gray-100"
                          />
                          <div>
                            <div className="font-semibold text-gray-800">
                              {user.full_name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                    )}
                    <td className="px-6 py-4 text-gray-700">{event.title}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${getBadgeClass(event.status)}`}>
                        {getStatusLabel(event.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 max-w-[200px]">
                        <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                            style={{ width: `${event.completion_rate}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-gray-600">
                          {event.completion_rate}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      <div className="flex items-center gap-1">
                        <Coins className="text-amber-500" size={18} />
                        <span className="font-medium">{getAmount(user.coins)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        title="Remove from event"
                        onClick={() =>
                          onRemoveUser(user, event.id, event.eventUser)
                        }
                      >
                        <UserMinus size={18} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}

            {users.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="text-base font-semibold text-gray-700">
                    No users found
                  </div>
                  <div className="text-sm text-gray-500">
                    Try adjusting your search or filters
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
        <div className="flex flex-1 justify-between sm:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(null, page - 1)}
            disabled={page === 0}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(null, page + 1)}
            disabled={page >= totalPages - 1}
          >
            Next
          </Button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Rows per page:
              <select
                value={rowsPerPage}
                onChange={onRowsPerPageChange}
                className="ml-2 rounded border border-gray-200 p-1 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                {[5, 10, 25].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </span>
            <span className="text-sm text-gray-600">
              Showing <span className="font-semibold">{users.length === 0 ? 0 : page * rowsPerPage + 1}</span> to{" "}
              <span className="font-semibold">
                {Math.min((page + 1) * rowsPerPage, users.length)}
              </span>{" "}
              of <span className="font-semibold">{users.length}</span> results
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(null, page - 1)}
              disabled={page === 0}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(null, page + 1)}
              disabled={page >= totalPages - 1 || totalPages === 0}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
