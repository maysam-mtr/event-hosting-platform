import { Request, Response } from 'express';
import { createInvitation, validateInvitationForUser
    , handleAcceptedInvitation, handleRejectedInvitation ,
    getInvitationsForEvent, deleteInvitationById } from '../services/invitation.service';
import { validationResult } from 'express-validator';
import { sendResponse } from '../Utils/responseHelper';
import {createPartnerValidation} from '../validation/partner.validator'
import { getUser } from '../services/user.service';
import { createPartner, findPartner } from '../services/partner.service';

// Create an invitation
const createInvitationController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { eventId } = req.params;
        const { boothTemplateId, assignedEmail,invitationLink } = req.body;
        
        const errors = validationResult(req);
          if (!errors.isEmpty()) {
            sendResponse(res, false, 400, 'Validation Failed', [], [
                { code: 'VALIDATION_ERROR', message:  errors.array()[0].msg  },
              ]); return;
          }
        
        // Call the service function to create the invitation
        const result = await createInvitation(eventId, boothTemplateId, assignedEmail,invitationLink);

        // Return success response
        sendResponse(res, true, 201, 'Invitation sent successfully', [result]);
    } catch (err) {
        sendResponse(res, false, 500, 'Failed to send invitation', [], [
            { code: 'CREATE_INVITATION_ERROR', message: (err as Error).message },
          ]);
    }
};

// Handle an accepted invitation
const handleAcceptedInvitationForNewPartnerController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { invitationId } = req.params;
        const {companyName, companyLogo,primaryContactFullName,primaryContactEmail} = req.body;
        const userId = (req as any).user?.id;

        // Validate partner details only if the user is not a partner
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          sendResponse(res, false, 400, 'Validation Failed', [], [
              { code: 'VALIDATION_ERROR', message:  errors.array()[0].msg  },
            ]); return;
        }
         const result = await handleAcceptedInvitation(userId, invitationId,{
            companyName, companyLogo, primaryContactFullName,primaryContactEmail
        });
         sendResponse(res, true, 200, 'Invitation accepted successfully', result);
     
    } catch (err) {
        sendResponse(res, false, 500, 'Failed to accept invitation', [], [
            { code: 'ACCEPT_INVITATION_ERROR', message: (err as Error).message },
          ]);
    }
};

const handleAcceptedInvitationController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { invitationId } = req.params;
        const userId = (req as any).user?.id;
         
        // Validate partner details only if the user is not a partner
        const user = await getUser(userId);
            if (!user || user.isPartner===0) {
                sendResponse(res, false, 400, 'User is not partner', [],[
                    { code: 'NOT_A_PARTNER', message: 'The user is not registered as a partner' },
                ]);
                return;
            }
       console.log(userId)
         const result = await handleAcceptedInvitation(userId, invitationId);
         sendResponse(res, true, 200, 'Invitation accepted successfully', result);
     
    } catch (err) {
        sendResponse(res, false, 500, 'Failed to accept invitation', [], [
            { code: 'ACCEPT_INVITATION_ERROR', message: (err as Error).message },
          ]);
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
        sendResponse(res, true, 200, 'Invitation rejected successfully', result);
    } catch (err) {
        sendResponse(res, false, 500, 'Failed to reject invitation', [], [
            { code: 'REJECT_INVITATION_ERROR', message: (err as Error).message },
          ]);
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
        sendResponse(res, true, 200, 'Invitation validated successfully', result);
    } catch (err) {
        sendResponse(res, false, 500, 'Failed to validate invitation', [], [
            { code: 'VALIDATE_INVITATION_ERROR', message: (err as Error).message },
          ]);
    }
};

// Get all invitations for a specific event
const getInvitationsForEventController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { eventId } = req.params;

        // Call the service function to fetch invitations
        const result = await getInvitationsForEvent(eventId);

        // Return success response
        sendResponse(res, true, 200, 'Invitations returned successfully', result);
    } catch (err) {
        sendResponse(res, false, 500, 'Failed to get invitation', [], [
            { code: 'GET_INVITATION_ERROR', message: (err as Error).message },
          ]);
    }
};

// Delete an invitation by ID
const deleteInvitationByIdController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { invitationId } = req.params;

        // Call the service function to delete the invitation
        const result = await deleteInvitationById(invitationId);

        // Return success response
        sendResponse(res, true, 200, 'Invitations deleted successfully', result);
    } catch (err) {
        sendResponse(res, false, 500, 'Failed to delete invitation', [], [
            { code: 'DELETE_INVITATION_ERROR', message: (err as Error).message },
          ]);
    }
};

export { 
    createInvitationController,handleSharableLinkController,
    handleAcceptedInvitationForNewPartnerController, handleAcceptedInvitationController,
    handleRejectedInvitationController,
    getInvitationsForEventController, deleteInvitationByIdController  };