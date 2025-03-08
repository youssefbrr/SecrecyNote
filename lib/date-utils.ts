/**
 * Format a date with proper timezone handling
 * @param dateString - ISO date string or Date object
 * @param options - Intl.DateTimeFormat options
 * @returns Formatted date string
 */
export function formatDate(
  dateString: string | Date,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  }
): string {
  const date =
    typeof dateString === "string" ? new Date(dateString) : dateString;

  // Use Intl.DateTimeFormat for consistent timezone handling
  return new Intl.DateTimeFormat(undefined, options).format(date);
}

/**
 * Format a date as a relative time (e.g., "2 hours ago")
 * @param dateString - ISO date string or Date object
 * @returns Formatted relative time string
 */
export function formatRelativeTime(dateString: string | Date): string {
  const date =
    typeof dateString === "string" ? new Date(dateString) : dateString;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "just now";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  }

  // For older dates, use the standard date format
  return formatDate(date);
}
