import { Request, Response } from "express";
import { getBoothsForPartner, filterBoothsByStatus,getBoothTemplateIdForPartnerAndEvent } from "../services/boothDetails.service";
import { sendResponse } from "../Utils/responseHelper";
// Get all booths for a specific partner
export const getBoothsForPartnerController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { partnerId } = req.params;

        // Call the service function to fetch booths for the partner
        const result = await getBoothsForPartner(partnerId);

        // Return success response
        sendResponse(res, true, 200, 'Booths retrieved successfully',result);
    } catch (err) {
        sendResponse(res, false, 400, 'Failed to retrieve booths', [], [
            { code: 'BOOTH_RETRIEVAL_ERROR', message: (err as Error).message },
          ]);
    }
};

// Filter booths by status (past, ongoing, future)
export const filterBoothsByStatusController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { partnerId } = req.params;
        const { status } = req.body

        if (!status || !["past", "ongoing", "future"].includes(status as string)) {
           sendResponse(res, false, 400, 'Login failed', [], [
                { code: 'INVALID_STATUS', message: "Invalid status. Use 'past', 'ongoing', or 'future'." },
              ]);
            return;
        }

        // Call the service function to filter booths
        const result = await filterBoothsByStatus(partnerId, status as string);

        // Return success response
        sendResponse(res, true, 200, 'Booths filtered successfully', result);
    } catch (err) {
        sendResponse(res, false, 401, 'Failed to filter booths', [], [
            { code: 'BOOTH_FILTER_ERROR', message: (err as Error).message },
          ]);
    }
};




export const getBoothTemplateIdForPartnerAndEventController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { partnerId, eventId } = req.params;

    // Call service to get booth template ID
    const boothTemplateId = await getBoothTemplateIdForPartnerAndEvent(partnerId, eventId);

    // Return success response
    sendResponse(res, true, 200, 'Booth template ID retrieved successfully', 
      [boothTemplateId]
    );
  } catch (err) {
    // Handle error and return failure response
    sendResponse(res, false, 400, 'Failed to retrieve booth template ID', [], [
      { code: 'BOOTH_TEMPLATE_RETRIEVAL_ERROR', message: (err as Error).message }
    ]);
  }
};