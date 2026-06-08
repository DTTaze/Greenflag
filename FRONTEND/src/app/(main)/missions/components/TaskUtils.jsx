/**
 * Helper functions for mission tasks
 */

// Get color class based on task difficulty level
export function getLevelColor(level) {
  switch (level) {
    case "easy":
      return "bg-green-400 bg-green-500";
    case "medium":
      return "bg-blue-400 bg-blue-500";
    case "hard":
      return "bg-orange-400 bg-orange-500";
    case "expert":
      return "bg-red-400 bg-red-500";
    default:
      return "bg-gray-400 bg-gray-500";
  }
}

// Get text display for task difficulty level
export function getLevelText(level) {
  switch (level) {
    case "easy":
      return "Dễ";
    case "medium":
      return "Trung bình";
    case "hard":
      return "Khó";
    case "expert":
      return "Chuyên gia";
    default:
      return "Không xác định";
  }
}
