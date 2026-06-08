/**
 * Utility functions for order operations and display
 */

/**
 * Returns the appropriate MUI color for a given order status
 * @param {string} status - The order status (Completed, In Progress, etc.)
 * @returns {string} MUI color value (success, warning, info, error, default)
 */
export const getStatusColor = (status) => {
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

/**
 * Calculate points based on waste types and quantities
 * @param {Array} items - Array of order items, each with type and quantity
 * @param {Object} typesPointsMap - Map of waste type IDs to their point values
 * @returns {number} Total calculated points
 */
export const calculateOrderPoints = (items, typesPointsMap) => {
  if (!items || !Array.isArray(items) || !typesPointsMap) return 0;

  return items.reduce((total, item) => {
    const pointsPerUnit = typesPointsMap[item.type] || 5; // Default to 5 points if type not found
    return total + pointsPerUnit * item.quantity;
  }, 0);
};

/**
 * Format date string to locale format with time
 * @param {string} dateString - Date string to format
 * @returns {string} Formatted date string
 */
export const formatOrderDate = (dateString) => {
  if (!dateString) return "";

  try {
    const date = new Date(dateString);
    return date.toLocaleString();
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
};

/**
 * Get the current display location for an order
 * @param {Object} order - Order object
 * @returns {string} Current location text
 */
export const getCurrentLocation = (order) => {
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
