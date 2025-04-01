import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { getPrivateEventCredential } from "../services/PrivateEventCredential.service";

// Get private event credential (passcode) by eventId
export const getPrivateEventCredentialController = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        
        // Extract the eventId from the request parameters
        const { eventId } = req.params;

        // Call the service to fetch the private event credential
        const passcode = await getPrivateEventCredential(eventId);

        // Respond with the passcode
        res.status(200).json({
            success: true,
            statusCode: 200,
            message: "Private event credential fetched successfully",
            data: {
                eventId,
                passcode,
            },
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            statusCode: 400,
            message: "Failed to fetch private event credential",
            errors: [{ code: "FETCH_CREDENTIAL_ERROR", message: (error as Error).message }],
        });
    }
};