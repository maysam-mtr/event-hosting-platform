/**
 * Booth Details Service
 *
 * This service handles all business logic related to booth details management in virtual events.
 * It provides functionality for creating, updating, and retrieving booth information,
 * managing partner assignments to booths, and filtering booths by various criteria.
 *
 * Key functionalities:
 * - Create or retrieve booth details for events
 * - Update booth configurations and partner assignments
 * - Retrieve booths assigned to specific partners
 * - Filter booths by event status (past, ongoing, future)
 * - Get booth template information for partner-event combinations
 */

import BoothDetails from "../models/BoothDetails"
import { getTodayDate, getTimeNow } from "../Utils/dateHelper"
import { Op } from "sequelize"
import Event from "../models/Event"
import { isEventOngoing } from "./event.service"
import { getPrivateEventCredential } from "./PrivateEventCredential.service"
import Host from "../models/Host"

/**
 * Retrieves existing booth details or creates new ones if they don't exist
 * This ensures every event-booth combination has corresponding booth details
 *
 * @param eventId - The unique identifier of the event
 * @param boothTemplateId - The template ID for the booth design
 * @returns Object containing the booth details
 */
export const getOrCreateBoothDetails = async (eventId: string, boothTemplateId: string): Promise<any> => {
  try {
    // Check if booth details already exist for this event and booth template
    let boothDetails = await BoothDetails.findOne({
      where: { eventId, boothTemplateId },
    })

    // If booth details don't exist, create them with default partner ID (2 = no partner)
    if (!boothDetails) {
      boothDetails = await BoothDetails.create({
        eventId,
        boothTemplateId,
        partnerId: 2, // Default value indicating no partner assigned
      })
    }

    return {
      boothDetails: boothDetails,
    }
  } catch (error) {
    throw new Error((error as Error).message || "Failed to fetch or create booth details.")
  }
}

/**
 * Updates existing booth details with new configuration or partner assignment
 * Used for modifying booth templates or reassigning partners
 *
 * @param boothDetailsId - The unique identifier of the booth details
 * @param updateData - Object containing fields to update (boothTemplateId, partnerId)
 * @returns Updated booth details object
 */
export const updateBoothDetails = async (
  boothDetailsId: string,
  updateData: Partial<{ boothTemplateId?: string; partnerId?: string }>,
): Promise<any> => {
  try {
    // Find the booth details by ID
    const boothDetails = await BoothDetails.findByPk(boothDetailsId)
    if (!boothDetails) {
      throw new Error("Booth details not found")
    }

    // Update only provided fields
    await boothDetails.update(updateData)

    return {
      boothDetails: boothDetails.toJSON(),
    }
  } catch (error) {
    throw new Error((error as Error).message || "Failed to update booth details.")
  }
}

/**
 * Retrieves booth details by their unique identifier
 * Used for getting specific booth information
 *
 * @param boothDetailsId - The unique identifier of the booth details
 * @returns Booth details object
 */
export const getBoothDetailsById = async (boothDetailsId: string): Promise<any> => {
  try {
    // Fetch the booth details by ID
    const boothDetails = await BoothDetails.findByPk(boothDetailsId)

    if (!boothDetails) {
      throw new Error("Booth details not found")
    }

    return boothDetails
  } catch (error) {
    throw new Error((error as Error).message || "Failed to fetch booth details.")
  }
}

/**
 * Retrieves all booths assigned to a specific partner
 * Includes event information and determines event status (past, ongoing, future)
 * Also fetches passcodes for private events
 *
 * @param partnerId - The unique identifier of the partner
 * @returns Object containing array of booths with event details and status
 */
export const getBoothsForPartner = async (partnerId: string): Promise<any> => {
  try {
    // Fetch booths for the specified partner with associated event and host information
    const booths = await BoothDetails.findAll({
      where: { partnerId },
      include: [
        {
          model: Event,
          attributes: [
            "startDate",
            "startTime",
            "endDate",
            "endTime",
            "id",
            "eventType",
            "eventName",
            "mapTemplateId",
            "hostId",
          ],
          include: [
            {
              model: Host,
              attributes: ["fullName"],
            },
          ],
        },
      ],
    })

    if (!booths || booths.length === 0) {
      throw new Error("No booths found for this partner")
    }

    // Process each booth to add event status and passcode information
    const boothsWithStatus = await Promise.all(
      booths.map(async (booth) => {
        const event = booth.toJSON().Event
        if (!event) {
          return {
            ...booth.toJSON(),
            status: "No event associated",
          }
        }

        // Determine event status using the event timing utility
        const { status } = isEventOngoing(
          new Date(event.startDate),
          event.startTime,
          new Date(event.endDate),
          event.endTime,
        )

        // Fetch passcode for private events
        let passcode = null
        if (event.eventType === "private") {
          try {
            passcode = await getPrivateEventCredential(event.id)
          } catch (error) {
            console.error(`Failed to fetch passcode for event ${event.id}:`, error)
            passcode = null
          }
        }

        return {
          ...booth.toJSON(),
          status,
          ...(passcode && { passcode }),
        }
      }),
    )

    return {
      booths: boothsWithStatus,
    }
  } catch (error) {
    console.error("Error in getBoothsForPartner:", error)
    throw new Error((error as Error).message || "Failed to retrieve booths.")
  }
}

/**
 * Filters booths by their event status (past, ongoing, future)
 * Uses complex date and time logic to categorize events accurately
 *
 * @param partnerId - The unique identifier of the partner
 * @param status - The status to filter by ('past', 'ongoing', 'future')
 * @returns Object containing filtered booths array
 */
export const filterBoothsByStatus = async (partnerId: string, status: string): Promise<any> => {
  try {
    const today = getTodayDate()
    const currentTime = getTimeNow()

    let whereCondition = {}

    switch (status) {
      case "past":
        // Events that have completely ended
        whereCondition = {
          [Op.or]: [
            { "$Event.endDate$": { [Op.lt]: today } }, // Events that ended before today
            {
              [Op.and]: [
                { "$Event.endDate$": today }, // Events ending today
                { "$Event.endTime$": { [Op.lte]: currentTime } }, // Events that ended before current time
              ],
            },
          ],
        }
        break

      case "ongoing":
        // Events that are currently active
        whereCondition = {
          [Op.and]: [
            { "$Event.startDate$": { [Op.lte]: today } }, // Events starting today or earlier
            { "$Event.endDate$": { [Op.gte]: today } }, // Events ending today or later
            {
              [Op.or]: [
                // Event started today and is ongoing
                {
                  [Op.and]: [{ "$Event.startDate$": today }, { "$Event.startTime$": { [Op.lte]: currentTime } }],
                },
                // Event started before today and ends today or later
                {
                  [Op.and]: [{ "$Event.startDate$": { [Op.lt]: today } }, { "$Event.endDate$": { [Op.gte]: today } }],
                },
              ],
            },
            {
              [Op.or]: [
                // If event ends today, ensure current time is before end time
                {
                  [Op.and]: [{ "$Event.endDate$": today }, { "$Event.endTime$": { [Op.gt]: currentTime } }],
                },
                // If event ends after today, it's still ongoing
                { "$Event.endDate$": { [Op.gt]: today } },
              ],
            },
          ],
        }
        break

      case "future":
        // Events that haven't started yet
        whereCondition = {
          [Op.or]: [
            { "$Event.startDate$": { [Op.gt]: today } }, // Events starting after today
            {
              [Op.and]: [
                { "$Event.startDate$": today }, // Events starting today
                { "$Event.startTime$": { [Op.gt]: currentTime } }, // Events starting after current time
              ],
            },
          ],
        }
        break

      default:
        throw new Error("Invalid status. Use 'past', 'ongoing', or 'future'.")
    }

    // Fetch booths based on the status filter
    const booths = await BoothDetails.findAll({
      where: { partnerId, ...whereCondition },
      include: [
        {
          model: Event,
          attributes: ["startDate", "startTime", "endDate", "endTime"],
        },
      ],
    })

    return {
      booths: booths.map((booth) => booth.toJSON()),
    }
  } catch (error) {
    console.error("Error in filterBoothsByStatus:", error)
    throw new Error((error as Error).message || "Failed to filter booths.")
  }
}

/**
 * Retrieves the booth template ID for a specific partner-event combination
 * Used to determine which booth template a partner is using for a particular event
 *
 * @param partnerId - The unique identifier of the partner
 * @param eventId - The unique identifier of the event
 * @returns The booth template ID or null if not found
 */
export const getBoothTemplateIdForPartnerAndEvent = async (
  partnerId: string,
  eventId: string,
): Promise<string | null> => {
  try {
    const booth = await BoothDetails.findOne({
      where: {
        partnerId,
        eventId,
      },
    })

    if (!booth) {
      return null
    }

    return booth.boothTemplateId
  } catch (error) {
    console.error("Error fetching booth template ID:", error)
    throw error
  }
}
