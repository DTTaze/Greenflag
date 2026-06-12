/**
 * Formats a date string or Date object into the standard vi-VN representation.
 * Fallback to '--' if the date is invalid or empty.
 */
export const formatDate = (dateString?: string | Date | null): string => {
  if (!dateString) return "--";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "--";
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};
