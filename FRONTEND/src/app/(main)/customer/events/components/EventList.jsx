import React from "react";
import { Plus, Trash2, Edit } from "lucide-react";
import { Button } from "@/src/components/ui/button";

const EventList = ({ events, onEdit, onDelete, onAdd }) => {
  const getBadgeClass = (status) => {
    switch (status) {
      case "active":
        return "bg-emerald-50 text-emerald-700 border-emerald-250";
      case "upcoming":
        return "bg-blue-50 text-blue-700 border-blue-250";
      case "completed":
        return "bg-gray-100 text-gray-700 border-gray-250";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getStatusLabel = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ");
  };

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-gray-50 rounded-lg border border-gray-150">
        <h4 className="text-lg font-semibold text-gray-600 mb-2">
          No events found
        </h4>
        <Button
          variant="outline"
          size="icon"
          onClick={onAdd}
          className="mt-2 text-emerald-600 hover:text-emerald-700 border-emerald-200 hover:bg-emerald-50"
        >
          <Plus size={20} />
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm text-gray-500">
          <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-700 border-b border-gray-200">
            <tr>
              <th scope="col" className="px-6 py-4">Image</th>
              <th scope="col" className="px-6 py-4">Name</th>
              <th scope="col" className="px-6 py-4">Location</th>
              <th scope="col" className="px-6 py-4">Start Time</th>
              <th scope="col" className="px-6 py-4">End Time</th>
              <th scope="col" className="px-6 py-4">Capacity</th>
              <th scope="col" className="px-6 py-4">Status</th>
              <th scope="col" className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 border-t border-gray-200">
            {events.map((event) => (
              <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <img
                    src={event.images?.[0] || "/placeholder-image.jpg"}
                    alt={event.title}
                    className="w-12 h-12 object-cover rounded-md border border-gray-100"
                  />
                </td>
                <td className="px-6 py-4 font-semibold text-gray-800">
                  {event.title}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {event.location}
                </td>
                <td className="px-6 py-4 text-gray-650">
                  {new Date(event.start_time).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-gray-650">
                  {new Date(event.end_time).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-gray-650">
                  {event.capacity}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${getBadgeClass(event.status)}`}>
                    {getStatusLabel(event.status)}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                      onClick={() => onEdit(event)}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => onDelete(event.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EventList;
