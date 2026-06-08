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
