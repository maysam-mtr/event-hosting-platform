/**
 * Booth Details Controller
 *
 * Manages virtual booth operations within events including:
 * - Retrieving booth information for partners
 * - Filtering booths by event status (past, ongoing, future)
 * - Managing booth template assignments
 * - Partner-booth relationship management
 */

import type { Request, Response } from "express"
import {
  getBoothsForPartner,
  filterBoothsByStatus,
  getBoothTemplateIdForPartnerAndEvent,
} from "../services/boothDetails.service"
import { sendResponse } from "../Utils/responseHelper"

/**
 * Retrieves all booth details associated with a specific partner
 * Returns comprehensive booth information including event details
 */
export const getBoothsForPartnerController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { partnerId } = req.params

    // Fetch all booths where the partner is participating
    const result = await getBoothsForPartner(partnerId)

    sendResponse(res, true, 200, "Booths retrieved successfully", result)
  } catch (err) {
    sendResponse(
      res,
      false,
      400,
      "Failed to retrieve booths",
      [],
      [{ code: "BOOTH_RETRIEVAL_ERROR", message: (err as Error).message }],
    )
  }
}

/**
 * Filters partner's booths based on event timing status
 * Categorizes booths into past, ongoing, or future events
 */
export const filterBoothsByStatusController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { partnerId } = req.params
    const { status } = req.body

    // Validate status parameter
    if (!status || !["past", "ongoing", "future"].includes(status as string)) {
      sendResponse(
        res,
        false,
        400,
        "Invalid status parameter",
        [],
        [{ code: "INVALID_STATUS", message: "Invalid status. Use 'past', 'ongoing', or 'future'." }],
      )
      return
    }

    // Filter booths based on event timing
    const result = await filterBoothsByStatus(partnerId, status as string)

    sendResponse(res, true, 200, "Booths filtered successfully", result)
  } catch (err) {
    sendResponse(
      res,
      false,
      401,
      "Failed to filter booths",
      [],
      [{ code: "BOOTH_FILTER_ERROR", message: (err as Error).message }],
    )
  }
}

/**
 * Retrieves the booth template ID for a specific partner-event combination
 * Used to identify which booth design/template a partner is using for an event
 */
export const getBoothTemplateIdForPartnerAndEventController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { partnerId, eventId } = req.params

    // Get the specific booth template assigned to this partner for this event
    const boothTemplateId = await getBoothTemplateIdForPartnerAndEvent(partnerId, eventId)

    sendResponse(res, true, 200, "Booth template ID retrieved successfully", [boothTemplateId])
  } catch (err) {
    sendResponse(
      res,
      false,
      400,
      "Failed to retrieve booth template ID",
      [],
      [{ code: "BOOTH_TEMPLATE_RETRIEVAL_ERROR", message: (err as Error).message }],
    )
  }
}
