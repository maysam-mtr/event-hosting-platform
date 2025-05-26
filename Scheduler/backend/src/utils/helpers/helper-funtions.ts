/**
 * Utility helper functions used throughout the application
 *
 * Provides common data manipulation and validation utilities
 * to ensure consistent behavior across different modules.
 */

/**
 * Ensures the input data is returned as an array
 *
 * Useful for normalizing input that may be either a single value
 * or an array, ensuring consistent array-based processing.
 *
 * @param data - Input data of any type
 * @returns Array containing the data (unchanged if already an array)
 */
export const ensureArray = (data: any) => {
  return Array.isArray(data) ? data : [data]
}
