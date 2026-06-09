import { Edit, Plus, Trash2 } from "lucide-react";
import React from "react";

import { Button } from "@/src/components/ui/button";

const ItemTable = ({ items, onEdit, onDelete, onAdd }) => {
  const getBadgeClass = (status) => {
    switch (status) {
      case "available":
        return "bg-emerald-50 text-emerald-700 border-emerald-250";
      case "sold_out":
        return "bg-red-50 text-red-700 border-red-250";
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-250";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "available":
        return "Available";
      case "sold_out":
        return "Sold Out";
      case "pending":
        return "Pending";
      default:
        return status;
    }
  };

  return (
    <div className="w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm text-gray-500">
          <thead className="border-b border-gray-200 bg-gray-50 text-xs font-semibold text-gray-700 uppercase">
            <tr>
              <th scope="col" className="px-6 py-4">
                Image
              </th>
              <th scope="col" className="px-6 py-4">
                Name
              </th>
              <th scope="col" className="px-6 py-4 text-right">
                Price
              </th>
              <th scope="col" className="px-6 py-4 text-right">
                Stock
              </th>
              <th scope="col" className="px-6 py-4 text-right">
                Daily Limit
              </th>
              <th scope="col" className="px-6 py-4">
                Status
              </th>
              <th scope="col" className="px-6 py-4 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 border-t border-gray-200">
            {items.length > 0 ? (
              items.map((item) => (
                <tr
                  key={item.id}
                  className="transition-colors hover:bg-gray-50"
                >
                  <td className="px-6 py-4">
                    <img
                      src={item.images?.[0] || "/placeholder-image.jpg"}
                      alt={item.name}
                      className="h-12 w-12 rounded-md border border-gray-100 object-cover"
                    />
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-800">
                    {item.name}
                  </td>
                  <td className="text-gray-750 px-6 py-4 text-right font-medium">
                    ${item.price.toFixed(2)}
                  </td>
                  <td className="text-gray-650 px-6 py-4 text-right">
                    {item.stock}
                  </td>
                  <td className="text-gray-650 px-6 py-4 text-right">
                    {item.purchase_limit_per_day}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${getBadgeClass(item.status)}`}
                    >
                      {getStatusLabel(item.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {item.status === "available" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                          onClick={() => onEdit(item)}
                        >
                          <Edit size={16} />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:bg-red-50 hover:text-red-700"
                        onClick={() => onDelete(item.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center">
                  <p className="text-sm text-gray-500">
                    No items found. Try adjusting your filters or add a new
                    item.
                  </p>
                  <Button
                    onClick={onAdd}
                    className="mt-4 gap-2 bg-emerald-600 text-white hover:bg-emerald-700"
                  >
                    <Plus size={16} />
                    Add Item
                  </Button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ItemTable;
