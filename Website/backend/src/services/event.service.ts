import Event from '../models/Event';
import { Op } from 'sequelize';
import { markSubscriptionAsUsed, isSubscriptionValid, getMaxDurationBySubscriptionId } from './subscription.service';
import { createPrivateEventCredential,getPrivateEventCredential,deletePrivateEventCredential } from './PrivateEventCredential.service';
import { getTodayDate, getTimeNow } from "../Utils/dateHelper";
import Host from '../models/Host';
import { start } from 'repl';
const createEvent = async (eventData: any, hostId: string): Promise<any> => {
    try {
        const { eventName, startDate, startTime, endTime, endDate, subscriptionId, mapTemplateId, eventType, passcode } = eventData;

        // Step 1: Convert startDate and endDate to Date objects
        const startDateObj = new Date(startDate).toISOString().split('T')[0];
        const endDateObj = new Date(endDate).toISOString().split('T')[0];
        // Log for debugging
        console.log("Start Date:", startDate, startDateObj);
        console.log("End Date:", endDate, endDateObj);

        // Validate start date and end date
        if (startDateObj > endDateObj) {
            throw new Error("End date must be on or after the start date.");
        }
console.log(startDateObj=== (endDateObj))
        // Step 2: Validate start time and end time if on the same day
        if (startDateObj === endDateObj) {
            const [startHours, startMinutes] = startTime.split(":").map(Number);
            const [endHours, endMinutes] = endTime.split(":").map(Number);

            const startTimeInMinutes = startHours * 60 + startMinutes;
            const endTimeInMinutes = endHours * 60 + endMinutes;

            console.log("Start Time in minutes:", startTimeInMinutes);
            console.log("End Time in minutes:", endTimeInMinutes);

            if (endTimeInMinutes <= startTimeInMinutes) {
                throw new Error("End time must be later than start time.");
            }

            if (endTimeInMinutes - startTimeInMinutes < 30) {
                throw new Error("The event duration must be at least 30 minutes.");
            }
        }

        // Step 3: Validate maximum duration based on subscription plan
        const maxDuration = await getMaxDurationBySubscriptionId(subscriptionId); // Maximum duration in minutes

        // Combine date and time into Date objects for accurate duration calculation
        const [startHours, startMinutes] = startTime.split(":").map(Number);
        const [endHours, endMinutes] = endTime.split(":").map(Number);

        const startDateTime = new Date(startDateObj);
        const endDateTime = new Date(endDateObj);

        startDateTime.setUTCHours(startHours, startMinutes, 0, 0);
        endDateTime.setUTCHours(endHours, endMinutes, 0, 0);

        const durationInMinutes = Math.ceil((endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60));

        console.log("Duration in minutes:", durationInMinutes);
        console.log("Max Duration in minutes:", maxDuration);

        if (durationInMinutes > maxDuration) {
            throw new Error(`The event duration exceeds the maximum allowed duration of ${maxDuration} minutes.`);
        }

        // Validate subscription
        let result = await isSubscriptionValid(subscriptionId, hostId);
        if (!result.isValid) {
            throw new Error(result.message);
        }

        // Create a new event
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
        });

        let credential = null;
        if (eventType === "private") {
            credential = await createPrivateEventCredential(event.id, passcode);
        }

        if (subscriptionId) {
            await markSubscriptionAsUsed(subscriptionId);
        }

        console.log("New event created:", event.toJSON());
        return {
            event: event.toJSON(),
            ...(credential ? { credential } : {}),
        };
    } catch (err) {
        throw new Error((err as Error).message || "An error occurred while creating the event.");
    }
};
const updateEvent = async (
    eventId: string,
    updateData: any,
    userId: string,
    passcode: string
): Promise<any> => {
    try {
        // Find the event by ID
        const event = await Event.findByPk(eventId);
        if (!event) {
            throw new Error(`Event with ID ${eventId} not found.`);
        }

        // Check authorization
        if (event.hostId !== userId) {
            throw new Error('You are not authorized to update this event');
        }

        // Handle event type changes (private/public)
        let credential = null;
        if (updateData.eventType && updateData.eventType !== event.eventType) {
            if (updateData.eventType === 'private') {
                credential = await createPrivateEventCredential(event.id, passcode);
            } else if (updateData.eventType === 'public') {
                await deletePrivateEventCredential(event.id);
            }
        }

        // Validate date/time fields if any are updated
        if (
            updateData.startDate ||
            updateData.endDate ||
            updateData.startTime ||
            updateData.endTime
        ) {
            // Merge existing and updated data
            const newStartDate = updateData.startDate || event.startDate;
            const newStartTime = updateData.startTime || event.startTime;
            const newEndDate = updateData.endDate || event.endDate;
            const newEndTime = updateData.endTime || event.endTime;

            // Convert to Date objects for comparison
            const startDateObj = new Date(newStartDate);
            const endDateObj = new Date(newEndDate);

            // Validate date format
            if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
                throw new Error('Invalid date format.');
            }

            // Validate start date <= end date
            if (startDateObj > endDateObj) {
                throw new Error('End date must be on or after the start date.');
            }

            // Check if dates are the same day
            const normalizedStartDate = startDateObj.toISOString().split('T')[0];
            const normalizedEndDate = endDateObj.toISOString().split('T')[0];

            if (normalizedStartDate === normalizedEndDate) {
                // Validate start time and end time
                const [startHours, startMinutes] = newStartTime.split(':').map(Number);
                const [endHours, endMinutes] = newEndTime.split(':').map(Number);

                const startTimeInMinutes = startHours * 60 + startMinutes;
                const endTimeInMinutes = endHours * 60 + endMinutes;

                if (endTimeInMinutes <= startTimeInMinutes) {
                    throw new Error('End time must be later than start time.');
                }

                if (endTimeInMinutes - startTimeInMinutes < 30) {
                    throw new Error('The event duration must be at least 30 minutes.');
                }
            }

            // Validate maximum duration
            const maxDuration = await getMaxDurationBySubscriptionId(event.subscriptionId);

            // Combine date and time into full Date objects
            const startDateTime = new Date(newStartDate);
            const endDateTime = new Date(newEndDate);

            const [startH, startM] = newStartTime.split(':').map(Number);
            const [endH, endM] = newEndTime.split(':').map(Number);

            startDateTime.setUTCHours(startH, startM, 0, 0);
            endDateTime.setUTCHours(endH, endM, 0, 0);

            const durationInMinutes = Math.ceil(
                (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60)
            );

            if (durationInMinutes > maxDuration) {
                throw new Error(
                    `The event duration exceeds the maximum allowed duration of ${maxDuration} minutes.`
                );
            }
        }

        // Update the event with the provided data
        await event.update(updateData);

        console.log('Event updated successfully:', event.toJSON());
        return {
            event: event.toJSON(),
            ...(credential ? { credential } : {}),
        };
    } catch (err) {
        throw new Error((err as Error).message || 'Failed to update event.');
    }
};

// Fetch all public events that are today or in the future
 const getPublicEvents = async (limit:number,page:number): Promise<any[]> => {
    try {
        const today = getTodayDate();
        const currentTime = getTimeNow();
         limit = limit ||15;
        const offset = (page - 1) * limit;
        console.log("Current Time:", currentTime);
        // Query the database for public events
        const publicEvents = await Event.findAll({
            where: {
                eventType: 'public', // Only public events
                [Op.or]: [
                    {
                        // Ongoing Events
                        [Op.and]: [
                            { startDate: { [Op.lte]: today } }, // Events that started today or earlier
                            { endDate: { [Op.gte]: today } },   // Events that end today or later
                            {
                                [Op.or]: [
                                    { endDate: { [Op.gt]: today } }, // Events ending tomorrow or later
                                    {
                                        [Op.and]: [
                                            { endDate: today },      // Events ending today
                                            { endTime: { [Op.gt]: currentTime } }, // Events that haven't ended yet
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        // Future Events
                        [Op.or]: [
                            { startDate: { [Op.gt]: today } }, // Events starting after today
                            {
                                [Op.and]: [
                                    { startDate: today },      // Events starting today
                                    { startTime: { [Op.gt]: currentTime } }, // Events starting after current time
                                ],
                            },
                        ],
                    },
                ],
            
            },
            order: [['startDate', 'ASC'], ['startTime', 'ASC']], // Order by date and time
            limit,
            offset,
        });
        // Add the event link to each event
         const s = await Promise.all (publicEvents.map( async(event) => {
            const host = await Host.findByPk(event.hostId, {
                attributes: ["fullName"], // Only fetch the "fullName" field
            });
    
            if (!host) {
                throw new Error("Host not found");
            }
    
            const {status} = isEventOngoing(event.startDate, event.startTime,event.endDate, event.endTime);
            return {
                status: status,
                hostName: host.fullName,
            ...event.toJSON(),}
            }));

            return s;
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
        const host = await Host.findByPk(event.hostId, {
            attributes: ["fullName"], // Only fetch the "fullName" field
        });

        if (!host) {
            throw new Error("Host not found");
        }

        const isOngoing = isEventOngoing(event.startDate, event.startTime,event.endDate, event.endTime);
    
             
        // Return the event details with the "isOngoing" flag
        return {
            ...event.toJSON(),
            isOngoing,
            hostName: host.fullName,
        };
    } catch (error) {
        throw new Error((error as Error).message || 'Failed to fetch event details.');
    }
};

// Helper function to check if an event is ongoing
export const isEventOngoing = (
    startDate: Date,
    startTime: string,
    endDate: Date,
    endTime: string
): { isOngoing: boolean; status: string } => {
    // Get the current UTC date and time
    console.log("hi",startDate, startTime, endDate, endTime)
    const now = new Date();

    // Parse the start and end times
    const [startHours, startMinutes] = startTime.split(":").map(Number);
    const [endHours, endMinutes] = endTime.split(":").map(Number);

    // Combine date and time into full start and end timestamps
    const startDateTime = new Date(startDate);
    startDateTime.setUTCHours(startHours, startMinutes, 0, 0);

    const endDateTime = new Date(endDate);
    endDateTime.setUTCHours(endHours, endMinutes, 0, 0);

    // Determine the event status
    if (now < startDateTime) {
        // Event is in the future
        return { isOngoing: false, status: "future" };
    } else if (now > endDateTime) {
        // Event has ended
        return { isOngoing: false, status: "past" };
    } else {
        // Event is ongoing
        return { isOngoing: true, status: "ongoing" };
    }
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
        const isOngoing = isEventOngoing(event.startDate, event.startTime, event.endDate, event.endTime);
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
        console.log(events)
        return events.map((event) => {
            const status = isEventOngoing(event.startDate, event.startTime, event.endDate, event.endTime);
                     return {
                         status: status.status,
                     ...event.toJSON(),}
                     });
    } catch (error) {
        console.error("Error in getEventsForHost:", error);
        throw new Error((error as Error).message || "Failed to retrieve events.");
    }
};

const filterEventsByStatus = async (
    hostId: string,
    status: string,
): Promise<any> => {
    try {
        const today = getTodayDate();
        const currentTime = getTimeNow();

        let whereCondition = {};

        switch (status) {
            case "past":
                whereCondition = {
                    [Op.or]: [
                        { endDate: { [Op.lt]: today } }, // Events that ended before today
                        {
                            [Op.and]: [
                                { endDate: today }, // Events ending today
                                { endTime: { [Op.lt]: currentTime } }, // Events ending before current time
                            ],
                        },
                    ],
                };
                break;

                case "ongoing":
                    whereCondition = {
                        [Op.and]: [
                            { startDate: { [Op.lte]: today } }, // Event started today or earlier
                            { endDate: { [Op.gte]: today } }, // Event ends today or later
                            {
                                [Op.or]: [
                                    // Case 1: Event started today and is ongoing
                                    {
                                        [Op.and]: [
                                            { startDate: today },
                                            { startTime: { [Op.lte]: currentTime } }, // Event started before or at the current time
                                        ],
                                    },
                                    // Case 2: Event started before today and ends today or later
                                    {
                                        [Op.and]: [
                                            { startDate: { [Op.lt]: today } },
                                            { endDate: { [Op.gte]: today } },
                                        ],
                                    },
                                ],
                            },
                            {
                                [Op.or]: [
                                    // If the event ends today, ensure the current time is before endTime
                                    {
                                        [Op.and]: [
                                            { endDate: today },
                                            { endTime: { [Op.gt]: currentTime } }, // Event ends after the current time
                                        ],
                                    },
                                    // If the event ends after today, it's still ongoing
                                    { endDate: { [Op.gt]: today } },
                                ],
                            },
                        ],
                    };
                    break;

            case "future":
                whereCondition = {
                    [Op.or]: [
                        { startDate: { [Op.gt]: today } }, // Events starting after today
                        {
                            [Op.and]: [
                                { startDate: today }, // Events starting today
                                { startTime: { [Op.gt]: currentTime } }, // Events starting after current time
                            ],
                        },
                    ],
                };
                break;

            default:
                throw new Error("Invalid status. Use 'past', 'ongoing', or 'future'.");
        }

        console.log("Where Condition:", whereCondition);
        console.log("Host ID:", hostId);

        // Fetch events based on the status filter
        const events = await Event.findAll({
            where: {
                hostId,
                ...whereCondition,
            },
        });

        return {
            events: events.map((event) => event.toJSON()),
        };
    } catch (error) {
        console.error("Error in filterEventsByStatus:", error);
        throw new Error((error as Error).message || "Failed to filter events.");
    }
};


export const filterPublicEventsByStatus = async (status: string,page:number,limit:number): Promise<any> => {
    try {
        const today = getTodayDate();
        const currentTime = getTimeNow();
        limit = limit ||15;
        const offset = (page - 1) * limit;
        let whereCondition = {};

        switch (status) {
            case "ongoing":
                whereCondition = {
                    eventType: 'public', // Only public events
                    [Op.and]: [
                        { startDate: { [Op.lte]: today } }, // Events starting today or earlier
                        { endDate: { [Op.gte]: today } }, // Events ending today or later
                        {
                            [Op.or]: [
                                // If the event ends today, ensure the current time is before endTime
                                {
                                    [Op.and]: [
                                        { endDate: today },
                                        { endTime: { [Op.gt]: currentTime } }, // Event ends after the current time
                                    ],
                                },
                                // If the event ends after today, it's still ongoing
                                { endDate: { [Op.gt]: today } },
                            ],
                        },
                    ],
                };
                break;

            case "future":
                whereCondition = {
                    eventType: 'public', // Only public events
                    [Op.or]: [
                        { startDate: { [Op.gt]: today } }, // Events starting after today
                        {
                            [Op.and]: [
                                { startDate: today }, // Events starting today
                                { startTime: { [Op.gt]: currentTime } }, // Events starting after current time
                            ],
                        },
                    ],
                };
                break;

            default:
                throw new Error("Invalid status. Use 'ongoing' or 'future'.");
        }

        console.log("Where Condition:", whereCondition);

        // Fetch events based on the status filter
        const events = await Event.findAll({
            where: whereCondition,
            order: [['startDate', 'ASC'], ['startTime', 'ASC']], // Order by date and time
            limit,
            offset,});
            const s = await Promise.all (events.map( async(event) => {
                const host = await Host.findByPk(event.hostId, {
                    attributes: ["fullName"], // Only fetch the "fullName" field
                });
        
                if (!host) {
                    throw new Error("Host not found");
                }
        
                 return {
                    hostName: host.fullName,
                ...event.toJSON(),}
                }));
    
                return s;
        return {
            events: events.map((event) => event.toJSON()),
        };
    } catch (error) {
        console.error("Error in getPublicEventsByStatus:", error);
        throw new Error((error as Error).message || "Failed to fetch public events.");
    }
};
const getEvent = async (eventID: string): Promise<any> => {
    try {
        const event = await Event.findByPk(eventID);
        if (!event) {
            throw new Error("User not found");
        }
        return event;
    } catch (err) {
        throw new Error((err as Error).message || '');
    }
};


export {
    createEvent, updateEvent ,getPublicEvents, getEventDetails, joinEvent, getEventsForHost,filterEventsByStatus, getEvent
};