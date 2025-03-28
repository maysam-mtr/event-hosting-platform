import { Request, Response } from "express";
import { getBoothsForPartner, filterBoothsByStatus } from "../services/boothDetails.service";

// Get all booths for a specific partner
export const getBoothsForPartnerController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { partnerId } = req.params;

        // Call the service function to fetch booths for the partner
        const result = await getBoothsForPartner(partnerId);

        // Return success response
        res.status(200).json(result);
    } catch (error) {
        console.error("Error in getBoothsForPartnerController:", error);
        res.status(400).json({ message: (error as Error).message });
    }
};

// Filter booths by status (past, ongoing, future)
export const filterBoothsByStatusController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { partnerId } = req.params;
        const { status } = req.query;

        if (!status || !["past", "ongoing", "future"].includes(status as string)) {
            res.status(400).json({ message: "Invalid status. Use 'past', 'ongoing', or 'future'." });
            return;
        }

        // Call the service function to filter booths
        const result = await filterBoothsByStatus(partnerId, status as string);

        // Return success response
        res.status(200).json(result);
    } catch (error) {
        console.error("Error in filterBoothsByStatusController:", error);
        res.status(400).json({ message: (error as Error).message });
    }
};