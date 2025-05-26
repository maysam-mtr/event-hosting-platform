/**
 * Event Controller
 *
 * Comprehensive event management system handling:
 * - Event creation and updates by hosts
 * - Public event discovery and filtering
 * - Event details retrieval and booth management
 * - Event joining with passcode validation
 * - Event status filtering (past, ongoing, future)
 * - Integration with external scheduler service
 */

import type { Request, Response } from "express"
import { validationResult } from "express-validator"
import {
  createEvent,
  updateEvent,
  getPublicEvents,
  getEventDetails,
  joinEvent,
  getEventsForHost,
  filterEventsByStatus,
  filterPublicEventsByStatus,
  getEventDetailsForHost,
  getEvent,
} from "../services/event.service"
import { sendResponse } from "../Utils/responseHelper"

/**
 * Creates a new virtual event with scheduling integration
 * Handles event creation, validation, and automatic scheduling
 */
const createEventController = async (req: Request, res: Response): Promise<void> => {
  const eventData = req.body
  const hostUser = (req as any).hostUser

  // Validate request data
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    sendResponse(
      res,
      false,
      400,
      "Validation failed",
      [],
      [{ code: "VALIDATION_ERROR", message: errors.array()[0].msg }],
    )
    return
  }

  try {
    const { eventName, startDate, startTime, endTime, endDate, subscriptionId, mapTemplateId, eventType, passcode } =
      eventData

    /**
     * Converts local date/time to UTC for consistent scheduling
     * Adds 3 hours offset for timezone handling
     */
    const getDateAndTime = (combinedDateAndTime: string): Date | null => {
      const localDate = new Date(combinedDateAndTime)
      const scheduleStartTime = new Date(
        Date.UTC(
          localDate.getUTCFullYear(),
          localDate.getUTCMonth(),
          localDate.getUTCDate(),
          localDate.getUTCHours() + 3,
          localDate.getUTCMinutes(),
          localDate.getUTCSeconds(),
        ),
      )

      if (isNaN(scheduleStartTime.getTime())) {
        return null
      }

      return scheduleStartTime
    }

    // Extract date components and combine with time
    const [startDateOnly] = startDate.toISOString().split("T")
    const [endDateOnly] = endDate.toISOString().split("T")

    const localStartTime = getDateAndTime(`${startDateOnly}T${startTime}`)
    const localEndTime = getDateAndTime(`${endDateOnly}T${endTime}`)

    if (!localStartTime || !localEndTime) {
      sendResponse(res, false, 400, "Failed to convert event start/end date and time")
      return
    }

    // Create event in database
    const event = await createEvent(eventData, hostUser.id)

    // Prepare scheduler service integration
    const BASE_URL = process.env.BASE_URL || "http://localhost"
    const SCHEDULER_PORT = process.env.SCHEDULER_PORT || 3333

    const requestBody = {
      data: {
        eventId: event.event.id,
      },
      startTime: localStartTime,
      endTime: localEndTime,
    }

    const cookieHeader = req.headers.cookie
    const endpoint = `${BASE_URL}:${SCHEDULER_PORT}/schedule`

    // Schedule event with external scheduler service
    const scheduleEventRes = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      },
      body: JSON.stringify(requestBody),
      credentials: "include",
    })

    if (!scheduleEventRes.ok) {
      const errorDetails = await scheduleEventRes.json()
      sendResponse(res, false, 400, `Failed to schedule event: ${errorDetails.message || scheduleEventRes.statusText}`)
      return
    }

    sendResponse(res, true, 201, "Event created successfully", [event])
  } catch (err) {
    sendResponse(
      res,
      false,
      500,
      "Failed to create event",
      [],
      [{ code: "EVENT_CREATION_ERROR", message: (err as Error).message }],
    )
  }
}

/**
 * Updates existing event details
 * Allows hosts to modify event information with validation
 */
const updateEventController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { eventId } = req.params
    const { eventName, startDate, endTime, endDate, startTime, mapTemplateId, eventType, passcode } = req.body
    const hostuserId = (req as any).hostUser?.id

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      sendResponse(
        res,
        false,
        400,
        "Validation Failed",
        [],
        [{ code: "VALIDATION_ERROR", message: errors.array()[0].msg }],
      )
      return
    }

    // Build update object with only provided fields
    const updateData: Partial<{
      eventName?: string
      startDate?: Date
      startTime?: string
      endDate?: Date
      endTime?: string
      mapTemplateId?: string
      eventType?: string
    }> = {}
    if (eventName) updateData.eventName = eventName
    if (startDate) updateData.startDate = startDate
    if (startTime) updateData.startTime = startTime
    if (endDate) updateData.endDate = endDate
    if (endTime) updateData.endTime = endTime
    if (mapTemplateId) updateData.mapTemplateId = mapTemplateId
    if (eventType) updateData.eventType = eventType

    // Ensure at least one field is being updated
    if (Object.keys(updateData).length === 0) {
      sendResponse(
        res,
        false,
        400,
        "At least one valid field must be provided for update.",
        [],
        [{ code: "INVALID_INPUT", message: "No valid fields provided for update." }],
      )
      return
    }

    // Update event with authorization check
    const updatedEvent = await updateEvent(eventId, updateData, hostuserId, passcode)
    console.log(updatedEvent)
    sendResponse(res, true, 200, "Event updated successfully", [updatedEvent])
  } catch (err) {
    sendResponse(
      res,
      false,
      500,
      "Failed to update Event",
      [],
      [{ code: "EVENT_UPDATE_ERROR", message: (err as Error).message }],
    )
  }
}

/**
 * Retrieves paginated list of public events
 * Provides event discovery functionality for users
 */
const getPublicEventsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const limit = req.query.limit ? Number.parseInt(req.query.limit as string, 10) : undefined
    const page = req.query.page ? Number.parseInt(req.query.page as string, 10) : undefined

    if (!limit || !page || limit < 1 || page < 1) {
      sendResponse(
        res,
        false,
        400,
        "Limit and page are required",
        [],
        [{ code: "VALIDATION_ERROR", message: "Limit and page are required" }],
      )
      return
    }

    // Fetch paginated public events
    const publicEvents = await getPublicEvents(limit, page)

    sendResponse(res, true, 200, "Public Events retrieved successfully", publicEvents)
  } catch (err) {
    sendResponse(
      res,
      false,
      500,
      "Failed to get events",
      [],
      [{ code: "PUBLIC_EVENTS_ERROR", message: (err as Error).message }],
    )
  }
}

/**
 * Retrieves detailed information for a specific event
 * Returns comprehensive event data including booth information
 */
const getEventDetailsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { eventId } = req.params

    // Fetch complete event details
    const eventDetails = await getEventDetails(eventId)

    sendResponse(res, true, 200, "Event details retrieved successfully", [eventDetails])
  } catch (err) {
    sendResponse(
      res,
      false,
      500,
      "Internal Server Error",
      [],
      [{ code: "EVENT_DETAILS_ERROR", message: (err as Error).message }],
    )
  }
}

/**
 * Retrieves booth details and event information for host dashboard
 * Provides comprehensive event management data for hosts
 */
export const getBoothDetailsForEventController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { eventId } = req.params

    if (!eventId) {
      res.status(400).json({ error: "Event ID is required" })
      return
    }

    // Fetch booth details and event information
    const boothDetails = await getEventDetailsForHost(eventId)
    const event = await getEvent(eventId)

    sendResponse(res, true, 200, "Host event details returned successfully", [boothDetails, event])
  } catch (err) {
    sendResponse(
      res,
      false,
      500,
      "Internal Server Error",
      [],
      [{ code: "GET_EVENT_DETAILS_ERROR", message: (err as Error).message }],
    )
  }
}

/**
 * Retrieves partner information for booths in a specific event
 * Used for host management of event participants
 */
export const getBoothPartnersForEventController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { eventId } = req.params

    if (!eventId) {
      res.status(400).json({ error: "Event ID is required" })
      return
    }

    // Fetch partner details for event booths
    const boothDetails = await getEventDetailsForHost(eventId)

    sendResponse(res, true, 200, "Partners for host event returned successfully", boothDetails)
  } catch (err) {
    sendResponse(
      res,
      false,
      500,
      "Internal Server Error",
      [],
      [{ code: "GET_EVENT_DETAILS_ERROR", message: (err as Error).message }],
    )
  }
}

/**
 * Handles user joining an event with optional passcode validation
 * Manages access control for both public and private events
 */
const joinEventController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { eventId } = req.params
    const { passcode } = req.body // Optional for private events

    // Process event join request with access validation
    const result = await joinEvent(eventId, passcode)

    sendResponse(res, true, 200, result.message, [])
  } catch (err) {
    sendResponse(
      res,
      false,
      500,
      "Internal Server Error",
      [],
      [{ code: "JOIN_EVENT_ERROR", message: (err as Error).message }],
    )
  }
}

/**
 * Retrieves all events created by a specific host
 * Provides host dashboard with their event portfolio
 */
const getEventsForHostController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { hostId } = req.params

    // Fetch all events belonging to the host
    const result = await getEventsForHost(hostId)

    sendResponse(res, true, 200, "Host events returned successfully", result)
  } catch (err) {
    sendResponse(
      res,
      false,
      500,
      "Internal Server Error",
      [],
      [{ code: "JOIN_EVENT_ERROR", message: (err as Error).message }],
    )
  }
}

/**
 * Filters host's events by timing status
 * Categorizes events into past, ongoing, or future for host management
 */
const filterEventsByStatusController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.body
    const { hostId } = req.params

    if (!status || !["past", "ongoing", "future"].includes(status as string)) {
      sendResponse(
        res,
        false,
        400,
        "Invalid status. Use 'past', 'ongoing', or 'future'.",
        [],
        [{ code: "VALIDATION_ERROR", message: "Invalid status. Use 'past', 'ongoing', or 'future'." }],
      )
      return
    }

    // Filter host events by timing status
    const result = await filterEventsByStatus(hostId, status as string)

    sendResponse(res, true, 200, "Filter events successfully", result)
  } catch (err) {
    sendResponse(
      res,
      false,
      500,
      "Internal Server Error",
      [],
      [{ code: "FILTER_EVENT_ERROR", message: (err as Error).message }],
    )
  }
}

/**
 * Filters public events by timing status with pagination
 * Provides filtered event discovery for users
 */
const filterPublicEventsByStatusController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.params

    const page = req.query.page ? Number.parseInt(req.query.page as string, 10) : undefined
    const limit = req.query.limit ? Number.parseInt(req.query.limit as string, 10) : undefined

    if (!limit || !page || limit < 1 || page < 1) {
      sendResponse(
        res,
        false,
        400,
        "Limit and page are required",
        [],
        [{ code: "VALIDATION_ERROR", message: "Limit and page are required" }],
      )
      return
    }

    if (!status || !["ongoing", "future"].includes(status as string)) {
      sendResponse(
        res,
        false,
        400,
        "Invalid status. Use 'ongoing', or 'future'.",
        [],
        [{ code: "VALIDATION_ERROR", message: "Invalid status. Use 'ongoing', or 'future'." }],
      )
      return
    }

    // Filter public events with pagination
    const result = await filterPublicEventsByStatus(status as string, page as number, limit as number)

    sendResponse(res, true, 200, "Filter events successfully", result)
  } catch (err) {
    sendResponse(
      res,
      false,
      500,
      "Internal Server Error",
      [],
      [{ code: "FILTER_EVENT_ERROR", message: (err as Error).message }],
    )
  }
}

export {
  createEventController,
  updateEventController,
  getPublicEventsController,
  getEventDetailsController,
  joinEventController,
  filterEventsByStatusController,
  getEventsForHostController,
  filterPublicEventsByStatusController,
}
