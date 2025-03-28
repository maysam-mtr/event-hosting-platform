import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { createEvent , updateEvent , getPublicEvents ,getEventDetails,joinEvent,
    getEventsForHost, filterEventsByStatus
} from '../services/event.service';

const createEventController = async (req: Request, res: Response): Promise<void> => {
    const eventData = req.body;
    const hostUser = (req as any).hostUser;

// Check for validation errors
const errors = validationResult(req);
if (!errors.isEmpty()) {
    res.status(400).json({ message: errors.array()[0].msg });
    return;
}

    try {
        const event = await createEvent(eventData, hostUser.id);
        res.status(201).json(event);
    } catch (err) {
        res.status(500).json({
            message: "Internal error occurred",
            details: {
                error: (err as Error).message,
                info: (err as any).details
            }
        });
    }
};
const updateEventController = async (req: Request, res: Response): Promise<void> => {
try {
    const { eventId } = req.params; // Extract event ID from URL parameters
    const { eventName, eventDate, eventTime, mapTemplateId, eventType,passcode } = req.body; // Allowed fields only
    const hostuserId = (req as any).hostUser?.id; // Extract authenticated user's ID (assuming middleware sets req.user)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ message: errors.array()[0].msg });
        return;
    }
    const updateData: Partial<{ eventName?: string; eventDate?: Date; eventTime?: string; mapTemplateId?: string; eventType?: string }> = {};
    if (eventName) updateData.eventName = eventName;
    if (eventDate) updateData.eventDate = eventDate;
    if (eventTime) updateData.eventTime = eventTime;
    if (mapTemplateId) updateData.mapTemplateId = mapTemplateId;
    if (eventType) updateData.eventType = eventType;


    // Ensure at least one field is provided for update
    if (Object.keys(updateData).length === 0) {
       res.status(400).json({ message: 'At least one valid field must be provided for update.' });
    }

    // Call service function to handle the update logic
    const updatedEvent = await updateEvent(eventId, updateData, hostuserId,passcode);
    console.log(updatedEvent)
     res.status(200).json({ message: 'Event updated successfully', event: updatedEvent });
} catch (error) {
   res.status(500).json({ message: 'Internal server error', error: (error as Error).message });
}
};


const getPublicEventsController = async (req: Request, res: Response): Promise<void> => {
    try {
        // Call the service function to fetch public events
        const publicEvents = await getPublicEvents();

        // Return success response
        res.status(200).json({
            message: "Public events retrieved successfully",
            events: publicEvents,
        });
    } catch (error) {
        console.error("Error in getPublicEventsController:", error);
        res.status(500).json({ message: 'Internal server error', error: (error as Error).message });
    }
};

const getEventDetailsController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { eventId } = req.params; // Extract event ID from URL parameters

        // Call the service function to fetch event details
        const eventDetails = await getEventDetails(eventId);

        // Return success response
        res.status(200).json({
            message: "Event details retrieved successfully",
            event: eventDetails,
        });
    } catch (error) {
        console.error("Error in getEventDetailsController:", error);
        res.status(500).json({ message: 'Internal server error', error: (error as Error).message });
    }
};


const joinEventController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { eventId } = req.params; // Extract event ID from URL parameters
        const { passcode } = req.body; // Extract passcode from request body (optional)

        // Call the service function to join the event
        const result = await joinEvent(eventId, passcode);

        // Return success response
        res.status(200).json({
            message: result.message,
        });
    } catch (error) {
        console.error("Error in joinEventController:", error);
        res.status(400).json({ message: (error as Error).message || 'Failed to join event.' });
    }
};


// Get all events for a specific host
const getEventsForHostController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { hostId } = req.params;

        // Call the service function to fetch events for the host
        const result = await getEventsForHost(hostId);

        // Return success response
        res.status(200).json(result);
    } catch (error) {
        console.error("Error in getEventsForHostController:", error);
        res.status(400).json({ message: (error as Error).message });
    }
};

// Filter events by status (past, ongoing, future)
const filterEventsByStatusController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { status } = req.params;

        if (!status || !["past", "ongoing", "future"].includes(status as string)) {
            res.status(400).json({ message: "Invalid status. Use 'past', 'ongoing', or 'future'." });
            return;
        }

        // Call the service function to filter events
        const result = await filterEventsByStatus(status as string);

        // Return success response
        res.status(200).json(result);
    } catch (error) {
        console.error("Error in filterEventsByStatusController:", error);
        res.status(400).json({ message: (error as Error).message });
    }
};
export {
    createEventController, updateEventController,getPublicEventsController,
    getEventDetailsController,joinEventController,filterEventsByStatusController,
    getEventsForHostController
};