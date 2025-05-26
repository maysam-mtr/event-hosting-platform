/**
 * Interface defining the structure for scheduling requests
 *
 * Used by the /schedule endpoint to validate incoming requests
 * for scheduling game engine containers.
 */
export interface Schedule {
  /** Event data containing the unique event identifier */
  data: { eventId: string }
  /** ISO string representing when the container should start */
  startTime: string
  /** ISO string representing when the container should stop */
  endTime: string
}
