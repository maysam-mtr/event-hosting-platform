import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { createEvent , updateEvent , getPublicEvents ,getEventDetails,joinEvent,
    getEventsForHost, filterEventsByStatus,
    filterPublicEventsByStatus,
    getEventDetailsForHost,
    getEvent
} from '../services/event.service';
import { sendResponse} from '../Utils/responseHelper';

const createEventController = async (req: Request, res: Response): Promise<void> => {
    const eventData = req.body;
    const hostUser = (req as any).hostUser;

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        sendResponse(res, false, 400, 'Validation failed', [], [
            { code: 'VALIDATION_ERROR', message: errors.array()[0].msg },
        ]);
        return;
    }

    try {

        const { eventName, startDate, startTime, endTime, endDate, subscriptionId, mapTemplateId, eventType, passcode } = eventData;
        
        const getDateAndTime = (combinedDateAndTime: string) : Date | null => {
            const localDate = new Date(combinedDateAndTime);
            const scheduleStartTime = new Date(Date.UTC(
                localDate.getUTCFullYear(),
                localDate.getUTCMonth(),
                localDate.getUTCDate(),
                localDate.getUTCHours() + 3,
                localDate.getUTCMinutes(),
                localDate.getUTCSeconds()
            ));
            
            if (isNaN(scheduleStartTime.getTime())) {
                return null;
            }
            
            return scheduleStartTime
        }

        const [startDateOnly] = startDate.toISOString().split('T')
        const [endDateOnly] = endDate.toISOString().split('T')

        const localStartTime = getDateAndTime(`${startDateOnly}T${startTime}`)
        const localEndTime = getDateAndTime(`${endDateOnly}T${endTime}`)

        if (!localStartTime || !localEndTime) {
            sendResponse(res, false, 400, "Failed to convert event start/end date and time");
            return;
        }

        const event = await createEvent(eventData, hostUser.id);
        
        const BASE_URL = process.env.BASE_URL || "http://localhost";
        const SCHEDULER_PORT = process.env.SCHEDULER_PORT || 3333;

        const requestBody = {
            data: {
                eventId: event.event.id
            },
            startTime: localStartTime,
            endTime: localEndTime,
        };

        const cookieHeader = req.headers.cookie

        const endpoint = `${BASE_URL}:${SCHEDULER_PORT}/schedule`;

        const scheduleEventRes = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(cookieHeader ? { "Cookie": cookieHeader} : {}),
            },
            body: JSON.stringify(requestBody),
            credentials: 'include'
        });

        if (!scheduleEventRes.ok) {
            const errorDetails = await scheduleEventRes.json();
            sendResponse(res, false, 400, `Failed to schedule event: ${errorDetails.message || scheduleEventRes.statusText}`);
            return;
        }

        sendResponse(res, true, 201, 'Event created successfully', [event]);
    } catch (err) {
        sendResponse(res, false, 500, 'Failed to create event', [], [
            { code: 'EVENT_CREATION_ERROR', message: (err as Error).message },
        ]);
    }
};

const updateEventController = async (req: Request, res: Response): Promise<void> => {
try {
    const { eventId } = req.params; // Extract event ID from URL parameters
    const { eventName, startDate, endTime, endDate, startTime, mapTemplateId, eventType,passcode } = req.body; // Allowed fields only
    const hostuserId = (req as any).hostUser?.id; // Extract authenticated user's ID (assuming middleware sets req.user)
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
       sendResponse(res, false, 400, 'Validation Failed', [], [
            { code: 'VALIDATION_ERROR', message:  errors.array()[0].msg  },
          ]);
        return;
    }
    const updateData: Partial<{ eventName?: string; startDate?: Date; startTime?: string;endDate?: Date; endTime?: string; mapTemplateId?: string; eventType?: string }> = {};
    if (eventName) updateData.eventName = eventName;
    if (startDate) updateData.startDate = startDate;
    if (startTime) updateData.startTime = startTime;
    if (endDate) updateData.endDate = endDate;
    if (endTime) updateData.endTime = endTime;
    if (mapTemplateId) updateData.mapTemplateId = mapTemplateId;
    if (eventType) updateData.eventType = eventType;


    // Ensure at least one field is provided for update
    if (Object.keys(updateData).length === 0) {
       sendResponse(res, false, 400, 'At least one valid field must be provided for update.', [], [
        { code: 'INVALID_INPUT', message:  'No valid fields provided for update.'  },
      ]);
      return;
    }

    // Call service function to handle the update logic
    const updatedEvent = await updateEvent(eventId, updateData, hostuserId,passcode);
    console.log(updatedEvent)
    sendResponse(res, true, 200, 'Event updated successfully', [updatedEvent]);
} catch (err) {
    sendResponse(res, false, 500, 'Failed to update Event', [], [
        { code: 'EVENT_UPDATE_ERROR', message: (err as Error).message },
      ]);}
};


const getPublicEventsController = async (req: Request, res: Response): Promise<void> => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
        const page=req.query.page? parseInt(req.query.page as string, 10) : undefined;
        if ( !limit|| !page || limit < 1 || page < 1) {
            sendResponse(res, false, 400, 'Limit and page are required', [], [
                { code: 'VALIDATION_ERROR', message: 'Limit and page are required' },
              ]);
            return;
        }
        // Call the service function to fetch public events
        const publicEvents = await getPublicEvents(limit, page);

        // Return success response
        sendResponse(res, true, 200, 'Public Events retreived successfully', publicEvents);
    } catch (err) {
        sendResponse(res, false, 500, 'Failed to get events', [], [
            { code: 'PUBLIC_EVENTS_ERROR', message: (err as Error).message },
          ]);
        }
};

const getEventDetailsController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { eventId } = req.params; // Extract event ID from URL parameters

        // Call the service function to fetch event details
        const eventDetails = await getEventDetails(eventId);

        // Return success response
        sendResponse(res, true, 200, 'Event details retrieved successfully', [eventDetails]);

    } catch (err) {
        sendResponse(res, false, 500, 'Internal Server Error', [], [
            { code: 'EVENT_DETAILS_ERROR', message: (err as Error).message },
          ]);}
};

   export const getBoothDetailsForEventController= async(req: Request, res: Response): Promise<void>=> {
    try {
      // Extract the eventId from the request parameters
      const { eventId } = req.params;

      if (!eventId) {
        res.status(400).json({ error: "Event ID is required" });
        return;
      }

      // Call the service to fetch booth details
      const boothDetails = await getEventDetailsForHost(eventId);
      const event = await getEvent(eventId);

      // Return the result as JSON
      sendResponse(res, true, 200,  'Host event details returned successfully', [boothDetails,event] );
    } catch (err) {
        sendResponse(res, false, 500, 'Internal Server Error', [], [
            { code: 'GET_EVENT_DETAILS_ERROR', message: (err as Error).message },
          ]);}
}

export const getBoothPartnersForEventController= async(req: Request, res: Response): Promise<void>=> {
    try {
      // Extract the eventId from the request parameters
      const { eventId } = req.params;

      if (!eventId) {
        res.status(400).json({ error: "Event ID is required" });
        return;
      }

      // Call the service to fetch booth details
      const boothDetails = await getEventDetailsForHost(eventId);
      // Return the result as JSON
      sendResponse(res, true, 200,  'Partners for host event returned successfully', boothDetails );
    } catch (err) {
        sendResponse(res, false, 500, 'Internal Server Error', [], [
            { code: 'GET_EVENT_DETAILS_ERROR', message: (err as Error).message },
          ]);}
}
const joinEventController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { eventId } = req.params; // Extract event ID from URL parameters
        const { passcode } = req.body; // Extract passcode from request body (optional)

        // Call the service function to join the event
        const result = await joinEvent(eventId, passcode);

        // Return success response
        sendResponse(res, true, 200, result.message, []);
    } catch (err) {
        sendResponse(res, false, 500, 'Internal Server Error', [], [
            { code: 'JOIN_EVENT_ERROR', message: (err as Error).message },
          ]);}
};


// Get all events for a specific host
const getEventsForHostController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { hostId } = req.params;

        // Call the service function to fetch events for the host
        const result = await getEventsForHost(hostId);

        // Return success response
        sendResponse(res, true, 200, 'Host events returned successfully', result);
    } catch (err) {
        sendResponse(res, false, 500, 'Internal Server Error', [], [
            { code: 'JOIN_EVENT_ERROR', message: (err as Error).message },
          ]);
    }
};

// Filter events for host by status (past, ongoing, future)
const filterEventsByStatusController = async (req: Request, res: Response): Promise<void> => {
    try {
        let { status } = req.body;
        const {hostId} = req.params;

        if (!status || !["past", "ongoing", "future"].includes(status as string)) {
             sendResponse(res, false, 400, "Invalid status. Use 'past', 'ongoing', or 'future'.", [], [
                { code: 'VALIDATION_ERROR', message: "Invalid status. Use 'past', 'ongoing', or 'future'."},
              ]);
            return;
        }

        // Call the service function to filter events
        const result = await filterEventsByStatus(hostId,status as string);

        // Return success response
        sendResponse(res, true, 200, 'Filter events successfully', result);
    } catch (err) {
        sendResponse(res, false, 500, 'Internal Server Error', [], [
            { code: 'FILTER_EVENT_ERROR', message: (err as Error).message },
          ]);
        }
};

const filterPublicEventsByStatusController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { status } = req.params;
       
       const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
       const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;
        if (!limit || !page || limit < 1 || page < 1) {
            sendResponse(res, false, 400, "Invalid status. Use 'past', 'ongoing', or 'future'.", [], [
                { code: 'VALIDATION_ERROR', message: "Invalid status. Use 'past', 'ongoing', or 'future'."},
              ]);
            return;}
        if (!status || !["ongoing", "future"].includes(status as string)) {
             sendResponse(res, false, 400, "Invalid status. Use 'ongoing', or 'future'.", [], [
                { code: 'VALIDATION_ERROR', message: "Invalid status. Use 'ongoing', or 'future'."},
              ]);
            return;
        }

        // Call the service function to filter events
        const result = await filterPublicEventsByStatus(status as string,page as number,limit as number);

        // Return success response
        sendResponse(res, true, 200, 'Filter events successfully', result);
    } catch (err) {
        sendResponse(res, false, 500, 'Internal Server Error', [], [
            { code: 'FILTER_EVENT_ERROR', message: (err as Error).message },
          ]);
        }
};
export {
    createEventController, updateEventController,getPublicEventsController,
    getEventDetailsController,joinEventController,filterEventsByStatusController,
    getEventsForHostController, filterPublicEventsByStatusController
};