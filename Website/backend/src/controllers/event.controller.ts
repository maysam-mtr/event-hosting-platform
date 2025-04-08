import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { createEvent , updateEvent , getPublicEvents ,getEventDetails,joinEvent,
    getEventsForHost, filterEventsByStatus,
    filterPublicEventsByStatus
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
            const event = await createEvent(eventData, hostUser.id);
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
        // Call the service function to fetch public events
        const publicEvents = await getPublicEvents();

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
        const { status } = req.body;
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

        if (!status || !["ongoing", "future"].includes(status as string)) {
             sendResponse(res, false, 400, "Invalid status. Use 'ongoing', or 'future'.", [], [
                { code: 'VALIDATION_ERROR', message: "Invalid status. Use 'ongoing', or 'future'."},
              ]);
            return;
        }

        // Call the service function to filter events
        const result = await filterPublicEventsByStatus(status as string);

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