import { Request, Response } from 'express';
import { createInvitation, validateInvitationForUser
    , handleAcceptedInvitation, handleRejectedInvitation ,
    getInvitationsForEvent, deleteInvitationById } from '../services/invitation.service';
import { validationResult } from 'express-validator';

// Create an invitation
const createInvitationController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { eventId } = req.params;
        const { boothTemplateId, assignedEmail } = req.body;
        
        const errors = validationResult(req);
          if (!errors.isEmpty()) {
            res.status(400).json({ message: errors.array()[0].msg });
            return;
          }
        
        // Call the service function to create the invitation
        const result = await createInvitation(eventId, boothTemplateId, assignedEmail);

        // Return success response
        res.status(201).json(result);
    } catch (error) {
        console.error("Error in createInvitationController:", error);
        res.status(400).json({ message: (error as Error).message || 'Failed to create invitation.' });
    }
};

// Handle an accepted invitation
const handleAcceptedInvitationController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { invitationId } = req.params;
        const userId = (req as any).user?.id;
        console.log((req as any).user)
        console.log(userId)
        // Call the service function to handle the accepted invitation
        const result = await handleAcceptedInvitation(userId, invitationId);

        // Return success response
        res.status(200).json(result);
    } catch (error) {
        console.error("Error in handleAcceptedInvitationController:", error);
        res.status(400).json({ message: (error as Error).message });
    }
};

// Handle a rejected (declined) invitation
const handleRejectedInvitationController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { invitationId } = req.params;
        const userId = (req as any).user?.id;

        // Call the service function to handle the rejected invitation
        const result = await handleRejectedInvitation(userId, invitationId);

        // Return success response
        res.status(200).json(result);
    } catch (error) {
        console.error("Error in handleRejectedInvitationController:", error);
        res.status(400).json({ message: (error as Error).message });
    }
};

// Handle the sharable link for invitations
const handleSharableLinkController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { eventId } = req.params;
        const userId = (req as any).user?.id; // Extract email from authenticated user

        // Validate the invitation for the user
        const result = await validateInvitationForUser(eventId, userId);

        // Return success response
        res.status(200).json(result);
    } catch (error) {
        console.error("Error in handleSharableLinkController:", error);
        res.status(404).json({ message: (error as Error).message || 'Failed to validate invitation.' });
    }
};

// Get all invitations for a specific event
const getInvitationsForEventController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { eventId } = req.params;

        // Call the service function to fetch invitations
        const result = await getInvitationsForEvent(eventId);

        // Return success response
        res.status(200).json(result);
    } catch (error) {
        console.error("Error in getInvitationsForEventController:", error);
        res.status(400).json({ message: (error as Error).message });
    }
};

// Delete an invitation by ID
const deleteInvitationByIdController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { invitationId } = req.params;

        // Call the service function to delete the invitation
        const result = await deleteInvitationById(invitationId);

        // Return success response
        res.status(200).json(result);
    } catch (error) {
        console.error("Error in deleteInvitationByIdController:", error);
        res.status(400).json({ message: (error as Error).message });
    }
};

export { createInvitationController,handleSharableLinkController,
    handleAcceptedInvitationController, handleRejectedInvitationController,
    getInvitationsForEventController, deleteInvitationByIdController  };