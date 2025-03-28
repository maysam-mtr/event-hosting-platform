import Event from '../models/Event';
import { Op } from 'sequelize';
import { markSubscriptionAsUsed, isSubscriptionValid } from './subscription.service';
import { createPrivateEventCredential,getPrivateEventCredential,deletePrivateEventCredential } from './PrivateEventCredential.service';
import { getTodayDate, getTimeNow } from "./dateUtils";
const createEvent = async (eventData: any, hostId: string): Promise<any> => {
    try {
        const { eventName, eventDate, eventTime, subscriptionId, mapTemplateId, eventType, passcode} = eventData;
        let result= await isSubscriptionValid(subscriptionId)
        if(!result.isValid){
            throw new Error(result.message);
        }
        // Create a new event
        const event = await Event.create({
            eventName,
            eventDate,
            eventTime,
            hostId,
            subscriptionId,
            mapTemplateId,
            eventType
        });

        if(eventData.eventType === 'private'){
              await createPrivateEventCredential(event.id,passcode);
        }
        if (subscriptionId) {
            await markSubscriptionAsUsed(subscriptionId);
        }
        console.log("New event created:", event.toJSON());
        return event.toJSON();
    } catch (err) {
        throw new Error((err as Error).message || '');
    }
};

const updateEvent = async (eventId: string, updateData: any,userId: string, passcode:string): Promise<any> => {
    try {
        // Find the event by ID
        const event = await Event.findByPk(eventId);

        if (!event) {
            throw new Error(`Event with ID ${eventId} not found.`);
        }
        console.log(event.hostId,userId)
        if (event.hostId !== userId) {
            throw new Error('You are not authorized to update this event');
        }
        console.log(updateData.eventType,event.eventType)
       if(updateData.eventType && updateData.eventType !== event.eventType){

        if(updateData.eventType === 'private'){
            await createPrivateEventCredential(event.id,passcode);
        }
        if(updateData.eventType === 'public'){
            await deletePrivateEventCredential(event.id);
        }
    }
        // Update only provided fields
        await event.update(updateData);

        console.log("Event updated successfully:", event.toJSON());
        return event.toJSON();
    } catch (err) {
        throw new Error((err as Error).message || 'Failed to update event.');
    }
};


// Fetch all public events that are today or in the future
 const getPublicEvents = async (): Promise<any[]> => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize today's date to midnight

        // Query the database for public events
        const publicEvents = await Event.findAll({
            where: {
                eventType: 'public', // Only public events
                eventDate: {
                    [Op.gte]: today, // Events today or in the future
                },
            },
            order: [['eventDate', 'ASC'], ['eventTime', 'ASC']], // Order by date and time
        });

        // Add the event link to each event
        return publicEvents.map((event) => ({
            ...event.toJSON(),
            }));
    } catch (error) {
        throw new Error((error as Error).message || 'Failed to fetch public events.');
    }
};



// Fetch event details by ID and check if the event is ongoing
const getEventDetails = async (eventId: string): Promise<any> => {
    try {
        // Fetch the event from the database
        const event = await Event.findByPk(eventId);

        if (!event) {
            throw new Error("Event not found");
        }
       
        const isOngoing = isEventOngoing(event.eventDate, event.eventTime);
    
             
        // Return the event details with the "isOngoing" flag
        return {
            ...event.toJSON(),
            isOngoing,
        };
    } catch (error) {
        throw new Error((error as Error).message || 'Failed to fetch event details.');
    }
};

// Helper function to check if an event is ongoing
const isEventOngoing = (eventdate: Date, eventTime: string): boolean => {
   // Get the current date and time
   const now = new Date();
        
   // Parse the event date
   const eventDate = new Date(eventdate); // Convert eventDate to Date object

   // Parse the event time
   const [eventHours, eventMinutes] = eventTime.split(':').map(Number);

   // Extract current hours and minutes
   const currentHours = now.getHours();
   const currentMinutes = now.getMinutes();

   // Check if the event date is today
   const isToday = eventDate.toDateString() === now.toDateString();

   // Compare the time (hours and minutes)
   const isOngoing =
       isToday && // Check if the event date is today
       (eventHours < currentHours || // Event hour is later than current hour
        (eventHours === currentHours && eventMinutes > currentMinutes)); // Same hour, but event minute is later

   // Debugging logs
   console.log("Event Date:", eventDate.toDateString());
   console.log("Today:", now.toDateString());
   console.log("Event Time - Hours:", eventHours, "Minutes:", eventMinutes);
   console.log("Current Time - Hours:", currentHours, "Minutes:", currentMinutes);
   console.log("Is Ongoing:", isOngoing);

    return isOngoing;
};

// Join an event
const joinEvent = async (eventId: string, passcode?: string): Promise<any> => {
    try {
        // Fetch the event along with its private credentials (if any)
        const event = await Event.findByPk(eventId);

        if (!event) {
            throw new Error("Event not found");
        }

        // Check if the event is ongoing
        const isOngoing = isEventOngoing(event.eventDate, event.eventTime);
        if (!isOngoing) {
            throw new Error("Event is not currently ongoing");
        }

        // Handle public and private events
        if (event.eventType === 'public') {
            // Public events can be joined directly
            return {
                message: "You have successfully joined the event",
            };
        } else if (event.eventType === 'private') {
            // Private events require a valid passcode
            let credential = await getPrivateEventCredential(event.id);

            if (!credential) {
                throw new Error("Private event credentials not found");
            }

            // Validate the passcode
            if (!passcode || passcode !== credential) {
                throw new Error("Invalid passcode");
            }

            return {
                message: "You have successfully joined the event",
            };
        }

        throw new Error("Invalid event type");
    } catch (error) {
        throw new Error((error as Error).message || 'Failed to join event.');
    }
};

// Get all events for a specific host
const getEventsForHost = async (hostId: string): Promise<any> => {
    try {
        // Fetch events for the specified host
        const events = await Event.findAll({
            where: { hostId },
        });

        if (!events || events.length === 0) {
            throw new Error("No events found for this host");
        }

        return {
            message: "Events retrieved successfully",
            events: events.map((event) => event.toJSON()),
        };
    } catch (error) {
        console.error("Error in getEventsForHost:", error);
        throw new Error((error as Error).message || "Failed to retrieve events.");
    }
};

// Filter events by status (past, ongoing, future)
const filterEventsByStatus = async (status: string): Promise<any> => {
    try {
        const today = getTodayDate();
        const currentTime = getTimeNow();

        let whereCondition = {};

        switch (status) {
            case "past":
                whereCondition = {
                    [Op.or]: [
                        { eventDate: { [Op.lt]: today } }, // Events before today
                        {
                            [Op.and]: [
                                { eventDate: today }, // Events today
                                { eventTime: { [Op.lt]: currentTime } }, // Before current time
                            ],
                        },
                    ],
                };
                break;

            case "ongoing":
                whereCondition = {
                    [Op.and]: [
                        { eventDate: today }, // Events today
                        { eventTime: { [Op.lte]: currentTime } }, // Events starting now or earlier
                    ],
                };
                break;

            case "future":
                whereCondition = {
                    [Op.or]: [
                        { eventDate: { [Op.gt]: today } }, // Events after today
                        {
                            [Op.and]: [
                                { eventDate: today }, // Events today
                                { eventTime: { [Op.gt]: currentTime } }, // After current time
                            ],
                        },
                    ],
                };
                break;

            default:
                throw new Error("Invalid status. Use 'past', 'ongoing', or 'future'.");
        }

        // Fetch events based on the status filter
        const events = await Event.findAll({
            where: whereCondition,
        });

        if (!events || events.length === 0) {
            throw new Error(`No ${status} events found`);
        }

        return {
            message: `${status.charAt(0).toUpperCase() + status.slice(1)} events retrieved successfully`,
            events: events.map((event) => event.toJSON()),
        };
    } catch (error) {
        console.error("Error in filterEventsByStatus:", error);
        throw new Error((error as Error).message || "Failed to filter events.");
    }
};


export {
    createEvent, updateEvent ,getPublicEvents, getEventDetails, joinEvent, getEventsForHost,filterEventsByStatus
};