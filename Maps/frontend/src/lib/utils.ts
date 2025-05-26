/**
 * Utility Functions
 * Common helper functions used throughout the frontend application
 */

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function for merging Tailwind CSS classes
 * Combines clsx and tailwind-merge for optimal class handling
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format date string for display
 * Converts ISO date strings to human-readable format
 */
export function formatDate(dateString?: string): string {
  if (!dateString) return "N/A"

  const date = new Date(dateString)

  if (isNaN(date.getTime())) {
    return "Invalid date"
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}
