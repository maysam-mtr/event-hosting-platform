/**
 * Event Status Utilities
 *
 * Determines and formats event status information:
 * - Calculates current event status (upcoming, ongoing, ended)
 * - Provides user-friendly status labels and descriptions
 * - Handles status-based styling and color coding
 * - Manages status transitions and real-time updates
 * - Supports different status types for various contexts
 *
 * Centralizes event status logic to ensure consistent
 * status display and behavior across the application.
 */

export default function getEventStatus(status) {
    if(status === 'ongoing'){
      return 'Live';
    }

    if(status === 'past'){
      return 'Closed';
    }    

    if(status === 'future'){
      return 'Upcoming';
    }
  }