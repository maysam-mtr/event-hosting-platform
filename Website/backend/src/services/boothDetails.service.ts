import BoothDetails from '../models/BoothDetails';
import { getTodayDate, getTimeNow } from "../Utils/dateHelper";
import { Op } from "sequelize";
import Event from "../models/Event";

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
           boothDetails: boothDetails.toJSON(),
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
                    attributes: ["eventDate", "eventTime"], // Include event details for filtering
                },
            ],
        });

        if (!booths || booths.length === 0) {
            throw new Error("No booths found for this partner");
        }

        return {
            booths: booths.map((booth) => booth.toJSON()),
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
                        { "$Event.eventDate$": { [Op.lt]: today } }, // Events before today
                        {
                            [Op.and]: [
                                { "$Event.eventDate$": today }, // Events today
                                { "$Event.eventTime$": { [Op.lt]: currentTime } }, // Before current time
                            ],
                        },
                    ],
                };
                break;

            case "ongoing":
                whereCondition = {
                    [Op.and]: [
                        { "$Event.eventDate$": today }, // Events today
                        { "$Event.eventTime$": { [Op.lte]: currentTime } }, // Events starting now or earlier
                    ],
                };
                break;

            case "future":
                whereCondition = {
                    [Op.or]: [
                        { "$Event.eventDate$": { [Op.gt]: today } }, // Events after today
                        {
                            [Op.and]: [
                                { "$Event.eventDate$": today }, // Events today
                                { "$Event.eventTime$": { [Op.gt]: currentTime } }, // After current time
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
                    attributes: ["eventDate", "eventTime"], // Include event details for filtering
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
