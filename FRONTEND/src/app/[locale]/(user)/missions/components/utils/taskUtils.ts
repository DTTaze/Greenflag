/**
 * Helper functions for mission tasks
 */

// Get color class based on task difficulty level
export function getLevelColor(level: string): string {
  switch (level) {
    case "easy":
      return "bg-green-500 hover:bg-green-600 border-green-200 text-green-700 bg-green-50";
    case "medium":
      return "bg-blue-500 hover:bg-blue-600 border-blue-200 text-blue-700 bg-blue-50";
    case "hard":
      return "bg-orange-500 hover:bg-orange-600 border-orange-200 text-orange-700 bg-orange-50";
    case "expert":
      return "bg-red-500 hover:bg-red-600 border-red-200 text-red-700 bg-red-50";
    default:
      return "bg-gray-500 hover:bg-gray-600 border-gray-200 text-gray-700 bg-gray-50";
  }
}

// Get text display for task difficulty level
export function getLevelText(level: string): string {
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
