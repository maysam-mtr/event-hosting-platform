import BoothDetails from '../models/BoothDetails';
import { getTodayDate, getTimeNow } from "../Utils/dateHelper";
import { Op } from "sequelize";
import Event from "../models/Event";
import { isEventOngoing } from './event.service';
import { getPrivateEventCredential } from './PrivateEventCredential.service';

// Fetch or create booth details
export const getOrCreateBoothDetails = async ( eventId: string, boothTemplateId: string ): Promise<any> => {
    try {
        // Check if booth details already exist for this event and booth template
        let boothDetails = await BoothDetails.findOne({
            where: { eventId, boothTemplateId },
        });

        // If booth details don't exist, create them
        if (!boothDetails) {
            boothDetails = await BoothDetails.create({
                eventId,
                boothTemplateId,
                partnerId: 2, // default 2 meaning no partner
            });
        }

        return {
           boothDetails: boothDetails,
        };
    } catch (error) {
        throw new Error((error as Error).message || 'Failed to fetch or create booth details.');
    }
};

// Update booth details (optional, for future use)
export const updateBoothDetails = async (
    boothDetailsId: string,
    updateData: Partial<{ boothTemplateId?: string; partnerId?: string }>
): Promise<any> => {
    try {
        // Find the booth details by ID
        const boothDetails = await BoothDetails.findByPk(boothDetailsId);
        if (!boothDetails) {
            throw new Error("Booth details not found");
        }

        // Update only provided fields
        await boothDetails.update(updateData);

        return {
            boothDetails: boothDetails.toJSON(),
        };
    } catch (error) {
        throw new Error((error as Error).message || 'Failed to update booth details.');
    }
};


// Fetch booth details by ID
export const getBoothDetailsById = async (boothDetailsId: string): Promise<any> => {
    try {
        // Fetch the booth details by ID
        const boothDetails = await BoothDetails.findByPk(boothDetailsId);

        if (!boothDetails) {
            throw new Error("Booth details not found");
        }

        return boothDetails;
    } catch (error) {
        throw new Error((error as Error).message || 'Failed to fetch booth details.');
    }
};

// Get all booths for a specific partner
export const getBoothsForPartner = async (partnerId: string): Promise<any> => {
    try {
        // Fetch booths for the specified partner
        const booths = await BoothDetails.findAll({
            where: { partnerId },
            include: [
                {
                    model: Event,
                    attributes: ["startDate", "startTime", "endDate", "endTime","id","eventType"], // Include event details
                },
            ],
        });

        if (!booths || booths.length === 0) {
            throw new Error("No booths found for this partner");
        }

        // Map over the booths and add the event status
        const boothsWithStatus = await Promise.all(booths.map(async (booth) => {
            const event = booth.toJSON().Event; // Access the associated event
            if (!event) {
                return {
                    ...booth.toJSON(),
                    status: "No event associated",
                };
            }

            // Use the isEventOngoing function to determine the event status
            const { status } = isEventOngoing(
                new Date(event.startDate),
                event.startTime,
                new Date(event.endDate),
                event.endTime
            );
            let passcode = null;
            if (event.eventType === "private") {
                try {
                    passcode = await getPrivateEventCredential(event.id);
                } catch (error) {
                    console.error(`Failed to fetch passcode for event ${event.id}:`, error);
                    passcode = null; // Set passcode to null if fetching fails
                }
            }
            // Return the booth data with the event status
            return {
                ...booth.toJSON(),
                status,
                ...(passcode && { passcode }),
            };
        }));

        return {
            booths: boothsWithStatus,
        };
    } catch (error) {
        console.error("Error in getBoothsForPartner:", error);
        throw new Error((error as Error).message || "Failed to retrieve booths.");
    }
};

// Filter booths by status (past, ongoing, future)
export const filterBoothsByStatus = async (partnerId: string, status: string): Promise<any> => {
    try {
        const today = getTodayDate();
        const currentTime = getTimeNow();

        let whereCondition = {};

        switch (status) {
            case "past":
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
                };
                break;

            case "ongoing":
                whereCondition = {
                    [Op.and]: [
                        { "$Event.startDate$": { [Op.lte]: today } }, // Events starting today or earlier
                        { "$Event.endDate$": { [Op.gte]: today } }, // Events ending today or later
                        {
                            [Op.or]: [
                                // Case 1: Event started today and is ongoing
                                {
                                    [Op.and]: [
                                        { "$Event.startDate$": today },
                                        { "$Event.startTime$": { [Op.lte]: currentTime } }, // Event started before or at current time
                                    ],
                                },
                                // Case 2: Event started before today and ends today or later
                                {
                                    [Op.and]: [
                                        { "$Event.startDate$": { [Op.lt]: today } },
                                        { "$Event.endDate$": { [Op.gte]: today } },
                                    ],
                                },
                            ],
                        },
                        {
                            [Op.or]: [
                                // If the event ends today, ensure the current time is before endTime
                                {
                                    [Op.and]: [
                                        { "$Event.endDate$": today },
                                        { "$Event.endTime$": { [Op.gt]: currentTime } }, // Event ends after current time
                                    ],
                                },
                                // If the event ends after today, it's still ongoing
                                { "$Event.endDate$": { [Op.gt]: today } },
                            ],
                        },
                    ],
                };
                break;

            case "future":
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
                };
                break;

            default:
                throw new Error("Invalid status. Use 'past', 'ongoing', or 'future'.");
        }

        // Fetch booths based on the status filter
        const booths = await BoothDetails.findAll({
            where: { partnerId, ...whereCondition },
            include: [
                {
                    model: Event,
                    attributes: ["startDate", "startTime", "endDate", "endTime"], // Include event details for filtering
                },
            ],
        });

        return {
            booths: booths.map((booth) => booth.toJSON()),
        };
    } catch (error) {
        console.error("Error in filterBoothsByStatus:", error);
        throw new Error((error as Error).message || "Failed to filter booths.");
    }
};