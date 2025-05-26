/**
 * Date and Time Formatting Utilities
 *
 * Provides consistent date and time formatting across the application:
 * - Formats dates for display in various components
 * - Handles timezone conversions and localization
 * - Provides relative time formatting (e.g., "2 hours ago")
 * - Manages date parsing from different input formats
 * - Ensures consistent date presentation throughout the UI
 *
 * Centralizes all date formatting logic to maintain
 * consistency and handle timezone complexities.
 */

export default function formatDateTime(isoString) {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
}