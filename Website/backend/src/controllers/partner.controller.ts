import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { getPartnerById, updatePartner } from "../services/partner.service";
import { sendResponse } from "../Utils/responseHelper";

// Update a partner
export const updatePartnerController = async (req: Request, res: Response): Promise<void> => {
    try {
        // Validate the request body
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
           sendResponse(res, false, 400, 'Validation Failed', [], [
                { code: 'VALIDATION_ERROR', message:  errors.array()[0].msg  },
              ]);
            return;
        }

        // Extract the partner ID and updated data from the request
        const { partnerId } = req.params; // Assuming the partner ID is passed as a URL parameter
        const updatedData = req.body;
    if (updatedData.length === 0) {
       sendResponse(res, false, 400, 'At least one valid field must be provided for update.', [], [
        { code: 'INVALID_INPUT', message:  'No valid fields provided for update.'  },
      ]);
      return;
    }
        // Call the service to update the partner
        const updatedPartner = await updatePartner(partnerId, updatedData);

        // Respond with the updated partner
        res.status(200).json({
            success: true,
            statusCode: 200,
            message: "Partner updated successfully",
            data: updatedPartner,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            statusCode: 400,
            message: "Failed to update partner",
            errors: [{ code: "UPDATE_PARTNER_ERROR", message: (error as Error).message }],
        });
    }
};
  /**
   * Get a single partner by ID
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   */
  export const getPartnerByIdController = async (req: any, res: any): Promise<void> =>{
    try {
      const { id } = req.params; // Extract partner ID from URL params
      const partner = await getPartnerById(id);
      res.status(200).json({
        success: true,
        data: partner,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }
