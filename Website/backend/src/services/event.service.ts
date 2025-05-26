/**
 * Event Service
 *
 * This service handles all business logic related to event management in the virtual event platform.
 * It provides comprehensive functionality for creating, updating, retrieving, and managing events,
 * including validation of event timing, subscription limits, and access control.
 *
 * Key functionalities:
 * - Create and update events with comprehensive validation
 * - Manage public and private events with passcode protection
 * - Retrieve events with filtering by status and type
 * - Handle event joining with access control
 * - Validate event timing and duration constraints
 * - Manage event-host relationships and permissions
 */

import Event from "../models/Event"
import { Op } from "sequelize"
import { markSubscriptionAsUsed, isSubscriptionValid, getMaxDurationBySubscriptionId } from "./subscription.service"
import {
  createPrivateEventCredential,
  getPrivateEventCredential,
  deletePrivateEventCredential,
} from "./PrivateEventCredential.service"
import { getTodayDate, getTimeNow } from "../Utils/dateHelper"
import Host from "../models/Host"
import BoothDetails from "../models/BoothDetails"
import Partner from "../models/Partner"
import User from "../models/User"

/**
 * Creates a new event with comprehensive validation
 * Validates timing, duration limits based on subscription, and manages private event credentials
 *
 * @param eventData - Object containing event details (name, dates, times, type, etc.)
 * @param hostId - The unique identifier of the host creating the event
 * @returns Object containing the created event and credentials (if private)
 */
const createEvent = async (eventData: any, hostId: string): Promise<any> => {
  try {
    const { eventName, startDate, startTime, endTime, endDate, subscriptionId, mapTemplateId, eventType, passcode } =
      eventData

    // Normalize dates to ISO format for consistent comparison
    const startDateObj = new Date(startDate).toISOString().split("T")[0]
    const endDateObj = new Date(endDate).toISOString().split("T")[0]

    console.log("Start Date:", startDate, startDateObj)
    console.log("End Date:", endDate, endDateObj)

    // Validate that end date is not before start date
    if (startDateObj > endDateObj) {
      throw new Error("End date must be on or after the start date.")
    }

    // For same-day events, validate that end time is after start time
    if (startDateObj === endDateObj) {
      const [startHours, startMinutes] = startTime.split(":").map(Number)
      const [endHours, endMinutes] = endTime.split(":").map(Number)

      const startTimeInMinutes = startHours * 60 + startMinutes
      const endTimeInMinutes = endHours * 60 + endMinutes

      console.log("Start Time in minutes:", startTimeInMinutes)
      console.log("End Time in minutes:", endTimeInMinutes)

      if (endTimeInMinutes <= startTimeInMinutes) {
        throw new Error("End time must be later than start time.")
      }
    }

    // Validate event duration against subscription plan limits
    const maxDuration = await getMaxDurationBySubscriptionId(subscriptionId)

    // Calculate actual event duration in minutes
    const [startHours, startMinutes] = startTime.split(":").map(Number)
    const [endHours, endMinutes] = endTime.split(":").map(Number)

    const startDateTime = new Date(startDateObj)
    const endDateTime = new Date(endDateObj)

    startDateTime.setHours(startHours, startMinutes, 0, 0)
    endDateTime.setHours(endHours, endMinutes, 0, 0)

    const durationInMinutes = Math.ceil((endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60))

    console.log("Duration in minutes:", durationInMinutes)
    console.log("Max Duration in minutes:", maxDuration)

    if (durationInMinutes > maxDuration) {
      throw new Error(`The event duration exceeds the maximum allowed duration of ${maxDuration} minutes.`)
    }

    // Validate subscription status and availability
    const result = await isSubscriptionValid(subscriptionId, hostId)
    if (!result.isValid) {
      throw new Error(result.message)
    }

    // Create the event record
    const event = await Event.create({
      eventName,
      startDate,
      startTime,
      endTime,
      endDate,
      hostId,
      subscriptionId,
      mapTemplateId,
      eventType,
    })

    // Create private event credentials if needed
    let credential = null
    if (eventType === "private") {
      credential = await createPrivateEventCredential(event.id, passcode)
    }

    // Mark subscription as used
    if (subscriptionId) {
      await markSubscriptionAsUsed(subscriptionId)
    }

    console.log("New event created:", event.toJSON())
    return {
      event: event.toJSON(),
      ...(credential ? { credential } : {}),
    }
  } catch (err) {
    throw new Error((err as Error).message || "An error occurred while creating the event.")
  }
}

/**
 * Updates an existing event with validation and authorization checks
 * Handles event type changes (public/private) and validates new timing constraints
 *
 * @param eventId - The unique identifier of the event to update
 * @param updateData - Object containing fields to update
 * @param userId - The ID of the user attempting the update (must be the host)
 * @param passcode - New passcode for private events (if applicable)
 * @returns Object containing the updated event and credentials
 */
const updateEvent = async (eventId: string, updateData: any, userId: string, passcode: string): Promise<any> => {
  try {
    // Find and validate event existence
    const event = await Event.findByPk(eventId)
    if (!event) {
      throw new Error(`Event with ID ${eventId} not found.`)
    }

    // Verify user authorization (only host can update)
    if (event.hostId !== userId) {
      throw new Error("You are not authorized to update this event")
    }

    // Handle event type changes and credential management
    let credential = null
    if (updateData.eventType && updateData.eventType !== event.eventType) {
      if (updateData.eventType === "private") {
        credential = await createPrivateEventCredential(event.id, passcode)
      } else if (updateData.eventType === "public") {
        await deletePrivateEventCredential(event.id)
      }
    }

    // Validate timing changes if any date/time fields are updated
    if (updateData.startDate || updateData.endDate || updateData.startTime || updateData.endTime) {
      // Merge existing and updated data for validation
      const newStartDate = updateData.startDate || event.startDate
      const newStartTime = updateData.startTime || event.startTime
      const newEndDate = updateData.endDate || event.endDate
      const newEndTime = updateData.endTime || event.endTime

      // Validate date formats
      const startDateObj = new Date(newStartDate)
      const endDateObj = new Date(newEndDate)

      if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
        throw new Error("Invalid date format.")
      }

      // Validate date sequence
      if (startDateObj > endDateObj) {
        throw new Error("End date must be on or after the start date.")
      }

      // Validate time sequence for same-day events
      const normalizedStartDate = startDateObj.toISOString().split("T")[0]
      const normalizedEndDate = endDateObj.toISOString().split("T")[0]

      if (normalizedStartDate === normalizedEndDate) {
        const [startHours, startMinutes] = newStartTime.split(":").map(Number)
        const [endHours, endMinutes] = newEndTime.split(":").map(Number)

        const startTimeInMinutes = startHours * 60 + startMinutes
        const endTimeInMinutes = endHours * 60 + endMinutes

        if (endTimeInMinutes <= startTimeInMinutes) {
          throw new Error("End time must be later than start time.")
        }
      }

      // Validate duration against subscription limits
      const maxDuration = await getMaxDurationBySubscriptionId(event.subscriptionId)

      const startDateTime = new Date(newStartDate)
      const endDateTime = new Date(newEndDate)

      const [startH, startM] = newStartTime.split(":").map(Number)
      const [endH, endM] = newEndTime.split(":").map(Number)

      startDateTime.setHours(startH, startM, 0, 0)
      endDateTime.setHours(endH, endM, 0, 0)

      const durationInMinutes = Math.ceil((endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60))

      if (durationInMinutes > maxDuration) {
        throw new Error(`The event duration exceeds the maximum allowed duration of ${maxDuration} minutes.`)
      }
    }

    // Apply the updates
    await event.update(updateData)

    console.log("Event updated successfully:", event.toJSON())
    return {
      event: event.toJSON(),
      ...(credential ? { credential } : {}),
    }
  } catch (err) {
    throw new Error((err as Error).message || "Failed to update event.")
  }
}

/**
 * Retrieves all public events that are currently ongoing or scheduled for the future
 * Includes pagination support and host information
 *
 * @param limit - Maximum number of events to return (default: 15)
 * @param page - Page number for pagination (1-based)
 * @returns Array of public events with status and host information
 */
const getPublicEvents = async (limit: number, page: number): Promise<any[]> => {
  try {
    const today = getTodayDate()
    const currentTime = getTimeNow()
    limit = limit || 15
    const offset = (page - 1) * limit
    console.log("Current Time:", currentTime)

    // Query for public events that are ongoing or future
    const publicEvents = await Event.findAll({
      where: {
        eventType: "public",
        [Op.or]: [
          {
            // Ongoing Events: started but not yet ended
            [Op.and]: [
              { startDate: { [Op.lte]: today } },
              { endDate: { [Op.gte]: today } },
              {
                [Op.or]: [
                  { endDate: { [Op.gt]: today } },
                  {
                    [Op.and]: [{ endDate: today }, { endTime: { [Op.gt]: currentTime } }],
                  },
                ],
              },
            ],
          },
          {
            // Future Events: haven't started yet
            [Op.or]: [
              { startDate: { [Op.gt]: today } },
              {
                [Op.and]: [{ startDate: today }, { startTime: { [Op.gt]: currentTime } }],
              },
            ],
          },
        ],
      },
      order: [
        ["startDate", "ASC"],
        ["startTime", "ASC"],
      ],
      limit,
      offset,
    })

    // Enhance events with host information and status
    const eventsWithDetails = await Promise.all(
      publicEvents.map(async (event) => {
        const host = await Host.findByPk(event.hostId, {
          attributes: ["fullName"],
        })

        if (!host) {
          throw new Error("Host not found")
        }

        const { status } = isEventOngoing(event.startDate, event.startTime, event.endDate, event.endTime)
        return {
          status: status,
          hostName: host.fullName,
          ...event.toJSON(),
        }
      }),
    )

    return eventsWithDetails
  } catch (error) {
    throw new Error((error as Error).message || "Failed to fetch public events.")
  }
}

/**
 * Retrieves detailed information about a specific event
 * Includes host information and current event status
 *
 * @param eventId - The unique identifier of the event
 * @returns Event details with host information and status
 */
const getEventDetails = async (eventId: string): Promise<any> => {
  try {
    // Fetch the event
    const event = await Event.findByPk(eventId)

    if (!event) {
      throw new Error("Event not found")
    }

    // Fetch host information
    const host = await Host.findByPk(event.hostId, {
      attributes: ["fullName"],
    })

    if (!host) {
      throw new Error("Host not found")
    }

    // Determine current event status
    const isOngoing = isEventOngoing(event.startDate, event.startTime, event.endDate, event.endTime)

    return {
      ...event.toJSON(),
      isOngoing,
      hostName: host.fullName,
    }
  } catch (error) {
    throw new Error((error as Error).message || "Failed to fetch event details.")
  }
}

/**
 * Retrieves detailed event information for hosts, including partner assignments
 * Shows all partners assigned to booths in the event with their contact information
 *
 * @param eventId - The unique identifier of the event
 * @returns Object containing partners assigned to the event
 */
export const getEventDetailsForHost = async (eventId: string): Promise<any> => {
  try {
    // Fetch booth details with partner information, excluding unassigned booths
    const boothDetails = await BoothDetails.findAll({
      where: {
        eventId: eventId,
        partnerId: {
          [Op.ne]: "2", // Exclude default "no partner" ID
        },
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "partnerId"],
      },
      include: [
        {
          model: Partner,
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
          include: [
            {
              model: User,
              attributes: ["email"],
            },
          ],
        },
      ],
    })

    return { Partners: boothDetails }
  } catch (error) {
    console.error("Error fetching booth details:", error)
    throw new Error("Failed to fetch booth details")
  }
}

/**
 * Utility function to determine if an event is currently ongoing
 * Compares current date/time with event start and end times
 *
 * @param startDate - Event start date
 * @param startTime - Event start time (HH:mm format)
 * @param endDate - Event end date
 * @param endTime - Event end time (HH:mm format)
 * @returns Object with boolean isOngoing flag and status string
 */
export const isEventOngoing = (
  startDate: Date,
  startTime: string,
  endDate: Date,
  endTime: string,
): { isOngoing: boolean; status: string } => {
  console.log("Checking event status:", startDate, startTime, endDate, endTime)
  const now = new Date()

  // Parse time components
  const [startHours, startMinutes] = startTime.split(":").map(Number)
  const [endHours, endMinutes] = endTime.split(":").map(Number)

  // Create full datetime objects
  const startDateTime = new Date(startDate)
  startDateTime.setHours(startHours, startMinutes, 0, 0)

  const endDateTime = new Date(endDate)
  endDateTime.setHours(endHours, endMinutes, 0, 0)

  // Determine status based on current time
  if (now < startDateTime) {
    return { isOngoing: false, status: "future" }
  } else if (now > endDateTime) {
    return { isOngoing: false, status: "past" }
  } else {
    return { isOngoing: true, status: "ongoing" }
  }
}

/**
 * Handles user joining an event with access control
 * Validates event status and passcode for private events
 *
 * @param eventId - The unique identifier of the event to join
 * @param passcode - Optional passcode for private events
 * @returns Success message upon successful join
 */
const joinEvent = async (eventId: string, passcode?: string): Promise<any> => {
  try {
    // Fetch the event
    const event = await Event.findByPk(eventId)

    if (!event) {
      throw new Error("Event not found")
    }

    // Verify event is currently ongoing
    const isOngoing = isEventOngoing(event.startDate, event.startTime, event.endDate, event.endTime)
    if (!isOngoing) {
      throw new Error("Event is not currently ongoing")
    }

    // Handle access control based on event type
    if (event.eventType === "public") {
      // Public events allow direct access
      return {
        message: "You have successfully joined the event",
      }
    } else if (event.eventType === "private") {
      // Private events require passcode validation
      const credential = await getPrivateEventCredential(event.id)

      if (!credential) {
        throw new Error("Private event credentials not found")
      }

      if (!passcode || passcode !== credential) {
        throw new Error("Invalid passcode")
      }

      return {
        message: "You have successfully joined the event",
      }
    }

    throw new Error("Invalid event type")
  } catch (error) {
    throw new Error((error as Error).message || "Failed to join event.")
  }
}

/**
 * Retrieves all events created by a specific host
 * Includes event status determination for each event
 *
 * @param hostId - The unique identifier of the host
 * @returns Array of events with status information
 */
const getEventsForHost = async (hostId: string): Promise<any> => {
  try {
    // Fetch all events for the host
    const events = await Event.findAll({
      where: { hostId },
    })
    console.log(events)

    // Add status information to each event
    return events.map((event) => {
      const status = isEventOngoing(event.startDate, event.startTime, event.endDate, event.endTime)
      return {
        status: status.status,
        ...event.toJSON(),
      }
    })
  } catch (error) {
    console.error("Error in getEventsForHost:", error)
    throw new Error((error as Error).message || "Failed to retrieve events.")
  }
}

/**
 * Filters events by their current status (past, ongoing, future)
 * Uses complex date/time logic to accurately categorize events
 *
 * @param hostId - The unique identifier of the host
 * @param status - The status to filter by ('past', 'ongoing', 'future')
 * @returns Object containing filtered events array
 */
const filterEventsByStatus = async (hostId: string, status: string): Promise<any> => {
  try {
    const today = getTodayDate()
    const currentTime = getTimeNow()
    console.log("Current Time:", currentTime)
    console.log("Today:", today)

    let whereCondition = {}

    switch (status) {
      case "past":
        // Events that have completely ended
        whereCondition = {
          [Op.or]: [
            { endDate: { [Op.lt]: today } },
            {
              [Op.and]: [{ endDate: today }, { endTime: { [Op.lt]: currentTime } }],
            },
          ],
        }
        break

      case "ongoing":
        // Events currently in progress
        whereCondition = {
          [Op.and]: [
            { startDate: { [Op.lte]: today } },
            { endDate: { [Op.gte]: today } },
            {
              [Op.or]: [
                // Started today and ongoing
                {
                  [Op.and]: [{ startDate: today }, { startTime: { [Op.lte]: currentTime } }],
                },
                // Started before today and ends today or later
                {
                  [Op.and]: [{ startDate: { [Op.lt]: today } }, { endDate: { [Op.gte]: today } }],
                },
              ],
            },
            {
              [Op.or]: [
                // Ends today but after current time
                {
                  [Op.and]: [{ endDate: today }, { endTime: { [Op.gt]: currentTime } }],
                },
                // Ends after today
                { endDate: { [Op.gt]: today } },
              ],
            },
          ],
        }
        break

      case "future":
        // Events that haven't started yet
        whereCondition = {
          [Op.or]: [
            { startDate: { [Op.gt]: today } },
            {
              [Op.and]: [{ startDate: today }, { startTime: { [Op.gt]: currentTime } }],
            },
          ],
        }
        break

      default:
        throw new Error("Invalid status. Use 'past', 'ongoing', or 'future'.")
    }

    console.log("Where Condition:", whereCondition)
    console.log("Host ID:", hostId)

    // Execute the filtered query
    const events = await Event.findAll({
      where: {
        hostId,
        ...whereCondition,
      },
    })

    return {
      events: events.map((event) => event.toJSON()),
    }
  } catch (error) {
    console.error("Error in filterEventsByStatus:", error)
    throw new Error((error as Error).message || "Failed to filter events.")
  }
}

/**
 * Filters public events by status with pagination support
 * Similar to filterEventsByStatus but specifically for public events
 *
 * @param status - The status to filter by ('ongoing', 'future')
 * @param page - Page number for pagination
 * @param limit - Maximum number of events per page
 * @returns Array of filtered public events with host information
 */
export const filterPublicEventsByStatus = async (status: string, page: number, limit: number): Promise<any> => {
  try {
    const today = getTodayDate()
    const currentTime = getTimeNow()
    limit = limit || 15
    const offset = (page - 1) * limit
    let whereCondition = {}

    switch (status) {
      case "ongoing":
        whereCondition = {
          eventType: "public",
          [Op.and]: [
            { startDate: { [Op.lte]: today } },
            { endDate: { [Op.gte]: today } },
            {
              [Op.or]: [
                {
                  [Op.and]: [{ endDate: today }, { endTime: { [Op.gt]: currentTime } }],
                },
                { endDate: { [Op.gt]: today } },
              ],
            },
          ],
        }
        break

      case "future":
        whereCondition = {
          eventType: "public",
          [Op.or]: [
            { startDate: { [Op.gt]: today } },
            {
              [Op.and]: [{ startDate: today }, { startTime: { [Op.gt]: currentTime } }],
            },
          ],
        }
        break

      default:
        throw new Error("Invalid status. Use 'ongoing' or 'future'.")
    }

    console.log("Where Condition:", whereCondition)

    // Fetch filtered events with pagination
    const events = await Event.findAll({
      where: whereCondition,
      order: [
        ["startDate", "ASC"],
        ["startTime", "ASC"],
      ],
      limit,
      offset,
    })

    // Add host information to each event
    const eventsWithHostInfo = await Promise.all(
      events.map(async (event) => {
        const host = await Host.findByPk(event.hostId, {
          attributes: ["fullName"],
        })

        if (!host) {
          throw new Error("Host not found")
        }

        return {
          hostName: host.fullName,
          ...event.toJSON(),
        }
      }),
    )

    return eventsWithHostInfo
  } catch (error) {
    console.error("Error in getPublicEventsByStatus:", error)
    throw new Error((error as Error).message || "Failed to fetch public events.")
  }
}

/**
 * Retrieves a single event by its ID
 * Simple utility function for basic event lookup
 *
 * @param eventID - The unique identifier of the event
 * @returns The event object
 */
const getEvent = async (eventID: string): Promise<any> => {
  try {
    const event = await Event.findByPk(eventID)
    console.log(eventID)
    if (!event) {
      throw new Error("Event not found")
    }
    return event
  } catch (err) {
    throw new Error((err as Error).message || "")
  }
}

export {
  createEvent,
  updateEvent,
  getPublicEvents,
  getEventDetails,
  joinEvent,
  getEventsForHost,
  filterEventsByStatus,
  getEvent,
}
