import { Router } from 'express';
import { createInvitationController, handleSharableLinkController, handleAcceptedInvitationController
    , handleRejectedInvitationController, getInvitationsForEventController, deleteInvitationByIdController,
    handleAcceptedInvitationForNewPartnerController
} from '../controllers/invitation.controller';
import { authenticateUser } from '../middleware/authentication';
import { createInvitationValidation } from '../validation/invitation.validator';
import { createPartnerValidation } from '../validation/partner.validator';
const router = Router();

//dont forget to make sure the host inviting is the host of the event
router.post('/invite/:eventId', createInvitationValidation,createInvitationController);

// Handle an accepted invitation for partner
router.put('/partners/:invitationId/accept',authenticateUser, handleAcceptedInvitationController);

// Handle an accepted invitation for new partner
router.post("/partners/register/:invitationId/accept",authenticateUser, createPartnerValidation(),handleAcceptedInvitationForNewPartnerController);

// Handle a rejected (declined) invitation
router.put('/:invitationId/reject',authenticateUser, handleRejectedInvitationController);

// Sharable link for invitations
router.get('/events/:eventId', authenticateUser, handleSharableLinkController);

// Get all invitations for a specific event
router.get("/events/:eventId/getAll", getInvitationsForEventController);

// Delete an invitation by ID
router.delete("/delete/:invitationId", deleteInvitationByIdController);


export default router;



