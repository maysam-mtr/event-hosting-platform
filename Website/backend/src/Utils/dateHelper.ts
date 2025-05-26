/**
 * Date Helper Utilities
 * 
 * Provides utility functions for date and time operations in UTC format.
 * These functions ensure consistent date/time handling across the application
 * by always working in UTC to avoid timezone-related issues.
 */

/**
 * Gets the current date in UTC format as YYYY-MM-DD string
 * Used for date comparisons and database storage
 * @returns Current date in YYYY-MM-DD format (UTC)
 */
const getTodayDate = (): string => {
    const today = new Date();
    const utcYear = today.getFullYear();
    const utcMonth = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const utcDay = String(today.getDate()).padStart(2, "0");
    return `${utcYear}-${utcMonth}-${utcDay}`; // YYYY-MM-DD format in UTC
};

/**
 * Gets the current time in UTC format as HH:mm:ss string
 * Used for time comparisons and logging timestamps
 * @returns Current time in HH:mm:ss format (UTC, 24-hour clock)
 */
const getTimeNow = (): string => {
    const now = new Date();
    const utcHours = String(now.getHours()).padStart(2, "0");
    const utcMinutes = String(now.getMinutes()).padStart(2, "0");
    const utcSeconds = String(now.getSeconds()).padStart(2, "0");
    return `${utcHours}:${utcMinutes}:${utcSeconds}`; // HH:mm:ss format in UTC
};

export{getTimeNow, getTodayDate}
