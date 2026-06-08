/**
 * Utility functions for order operations and display
 */

/**
 * Returns the appropriate MUI color for a given order status
 * @param status - The order status (Completed, In Progress, etc.)
 * @returns MUI color value (success, warning, info, error, default)
 */
export const getStatusColor = (
  status: string,
): "success" | "warning" | "info" | "error" | "default" => {
  switch (status) {
    case "delivered":
      return "success";
    case "delivering":
      return "warning";
    case "Pending Confirmation":
      return "info";
    case "cancel":
      return "error";
    default:
      return "default";
  }
};

export interface OrderItem {
  type: string | number;
  quantity: number;
}

/**
 * Calculate points based on waste types and quantities
 * @param items - Array of order items, each with type and quantity
 * @param typesPointsMap - Map of waste type IDs to their point values
 * @returns Total calculated points
 */
export const calculateOrderPoints = (
  items: OrderItem[] | null | undefined,
  typesPointsMap: Record<string | number, number> | null | undefined,
): number => {
  if (!items || !Array.isArray(items) || !typesPointsMap) return 0;

  return items.reduce((total: number, item: OrderItem) => {
    const pointsPerUnit = typesPointsMap[item.type] ?? 5; // Default to 5 points if type not found
    return total + pointsPerUnit * item.quantity;
  }, 0);
};

/**
 * Format date string to locale format with time
 * @param dateString - Date string to format
 * @returns Formatted date string
 */
export const formatOrderDate = (
  dateString: string | null | undefined,
): string => {
  if (!dateString) return "";

  try {
    const date = new Date(dateString);
    return date.toLocaleString();
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
};

export interface LocationHistoryItem {
  location: string;
}

export interface OrderWithLocation {
  locationHistory?: LocationHistoryItem[];
  currentLocation?: string;
  address?: string;
}

/**
 * Get the current display location for an order
 * @param order - Order object
 * @returns Current location text
 */
export const getCurrentLocation = (
  order: OrderWithLocation | null | undefined,
): string => {
  if (!order) return "Location unavailable";

  if (order.locationHistory && order.locationHistory.length > 0) {
    return order.locationHistory[order.locationHistory.length - 1].location;
  }

  if (order.currentLocation) {
    return order.currentLocation;
  }

  return order.address || "Location unavailable";
};

const orderUtils = {
  getStatusColor,
  calculateOrderPoints,
  formatOrderDate,
  getCurrentLocation,
};

export default orderUtils;
