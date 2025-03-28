import Invitation from '../models/Invitation';
import BoothDetails from '../models/BoothDetails';
import { getBoothDetailsById, getOrCreateBoothDetails } from './boothDetails.service';
import { createPartner, findPartner } from './partner.service';
import { getUser } from './user.service';
import { Sequelize } from 'sequelize';
import nodemailer from "nodemailer";

// Create an invitation
export const createInvitation = async ( eventId: string, boothTemplateId: string, assignedEmail: string ): Promise<any> => {
    try {
        // Fetch or create the booth details
        const boothResult = await getOrCreateBoothDetails(eventId, boothTemplateId);
        const boothDetails = boothResult.boothDetails;
 
        const acceptedInvitation = await Invitation.findOne({
            where:{boothDetailsId: boothDetails.id, status:'accepted'},
        })

        if(acceptedInvitation){
            throw new Error("This booth already has an accepted invitation");
        }

        const existingAcceptedInvitationInEvent = await Invitation.findOne({
            include: [
                {
                    model: BoothDetails,
                    where: { eventId }, // Ensure the booth belongs to the same event
                },
            ],
            where: {
                assignedEmail,
                status: "accepted",
            },
        });

        if (existingAcceptedInvitationInEvent) {
            throw new Error("This email is already assigned to a booth in this event");
        }

        // Check if an invitation already exists for this booth and email
        const existingInvitation = await Invitation.findOne({
            where: { boothDetailsId: boothDetails.id, assignedEmail, status:'pending'},
        });
        if (existingInvitation) {
            throw new Error("An invitation for this booth and email already exists");
        }

        const pendingInvitations = await Invitation.findAll({
            include: [
                {
                    model: BoothDetails,
                    where: { eventId }, // Ensure the booth belongs to the same event
                },
            ],
            where: {
                assignedEmail,
                status: "pending",
            },
        });

        // Delete the pending invitations
        for (const invitation of pendingInvitations) {
            await invitation.destroy();
        }
        // Create the invitation
        const invitation = await Invitation.create({
            boothDetailsId: boothDetails.id,
            assignedEmail,
            status: 'pending',
        });

        await sendInvitationEmail(assignedEmail,eventId);

        return {
            boothDetails: boothDetails,
            invitation: invitation.toJSON(),
        };
    } catch (error) {
        throw new Error((error as Error).message || 'Failed to create invitation.');
    }
};

// Update the status of an invitation
export const updateInvitationStatus = async (userId: string, invitationId: string,  status: 'accepted' | 'declined'): Promise<any> => {
    try {
        // Find the invitation by ID
        const invitation = await Invitation.findByPk(invitationId);
        if (!invitation) {
            throw new Error("Invitation not found");
        }
        const user = await getUser(userId);
        if (!user) {
            throw new Error("User not found");
        }
        console.log(invitation.assignedEmail)
        console.log(user.email)
        if(invitation.assignedEmail !== user.email ){
            throw new Error("You are not authorized to join this event as partner")
        }

        if (invitation.status !== 'pending') {
            throw new Error("Only pending invitations can be accepted or rejected ");
        }
        const acceptedInvitation = await Invitation.findOne({
            where:{boothDetailsId: invitation.boothDetailsId, status:'accepted'},
        })

        if(acceptedInvitation){
            throw new Error("This booth already has an accepted invitation");
        }

        // Update the status
        invitation.status = status;
        await invitation.save();

        // If the invitation is accepted, link the partner to the booth

        return {
           invitation: invitation.toJSON(),
        };
    } catch (error) {
        throw new Error((error as Error).message || 'Failed to update invitation status.');
    }
};

// Assign a partner to a booth
export const assignPartnerToBooth = async ( boothDetailsId: string, assignedEmail: string, userId: string  ): Promise<any> => {
    try {
        // Fetch the booth details
        const boothDetails = await getBoothDetailsById(boothDetailsId);
        console.log(boothDetails instanceof Sequelize)
        if (!boothDetails) {
            throw new Error("Booth details not found");
        }

        // Find or create the partner
        let partner = await findPartner(assignedEmail);

        if (partner===0) {
            // If no partner exists, create one using the user's details
            const user = await getUser(userId);
            if (!user) {
                throw new Error("User not found");
            }

            // Update the user's role to partner
            if(user.isPartner===0){
            user.isPartner = 1;
            await user.save();}

            // Create the partner
            partner = await createPartner(userId, user.fullName, user.email);
        }

        const existingBooth = await BoothDetails.findOne({
            where: {
                partnerId: partner.id,
                eventId: boothDetails.eventId,
            },
        });

        if (existingBooth) {
            throw new Error("This partner is already assigned to a booth in this event");
        }

        // Assign the partner to the booth
        boothDetails.partnerId = partner.id;
        console.log("before",boothDetails)
        await boothDetails.save();
        console.log(boothDetails)

        return {
          boothDetails: boothDetails,
        };
    } catch (error) {
        throw new Error((error as Error).message || 'Failed to assign partner to booth.');
    }
};


// Handle an accepted invitation
export const handleAcceptedInvitation = async (userId: string, invitationId: string ): Promise<any> => {
    try {
        // Update the invitation status to "accepted"
        const updatedInvitation = await updateInvitationStatus(userId,invitationId, 'accepted');

        // Assign the partner to the booth
        const boothDetails = await assignPartnerToBooth(
            updatedInvitation.invitation.boothDetailsId,
            updatedInvitation.invitation.assignedEmail,
            userId
        );

        return {
             invitation: updatedInvitation.invitation,
            boothDetails: boothDetails.boothDetails,
        };
    } catch (error) {
        throw new Error((error as Error).message || 'Failed to handle accepted invitation.');
    }
}; 


// Handle an accepted invitation
export const handleRejectedInvitation = async ( userId:string, invitationId: string ): Promise<any> => {
    try {
        // Update the invitation status to "declined"
        const updatedInvitation = await updateInvitationStatus(userId,invitationId, 'declined');

        return {
           invitation: updatedInvitation.invitation,
    
        };
    } catch (error) {
        throw new Error((error as Error).message || 'Failed to handle accepted invitation.');
    }
}; 

// Validate invitation for a signed-in user
export const validateInvitationForUser = async (  eventId: string, userId: string ): Promise<any> => {
    try {
        const user = await getUser(userId);
        const userEmail=user.email
        // Find the invitation for the event and user email
        const invitation = await Invitation.findOne({
            include: [
              {
                model: BoothDetails,
                where: { eventId }, // Ensure the booth belongs to the specified event
              },
            ],
            where: {
              assignedEmail: userEmail, // Check for the specific email
              status: "pending", // Only check for pending invitations
            },
          });
        if (!invitation) {
            throw new Error("No pending invitation found for this event and user.");
        }

        return {
            invitation: invitation.toJSON(),
        };
    } catch (error) {
        throw new Error((error as Error).message || 'Failed to validate invitation.');
    }
};

export const sendInvitationEmail = async (partnerEmail: string, eventId: string): Promise<void> => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "uobseniors2025@gmail.com",  // Replace with your email
                pass: "bazxkrxfbehtrrgj"  // Replace with your Gmail app password
            }
        });
        const mailOptions = {
            from: '"Virtual Event" <uobseniors2025@gmail.com>',
            to: partnerEmail,
            subject: "You are invited to join the Virtual Event",
            html: `
                 <p>Click the link below to accept your invitation:</p>
                 <a href="http:/localhost:5000/api/invitations/events/${eventId}" target="_blank">
                 <strong>Click Here</strong>
                 </a>
                `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info.response);
    } catch (err) {
        console.error("Error sending email:", err);
    }
};


// Get all invitations for a specific event
export const getInvitationsForEvent = async (eventId: string): Promise<any> => {
    try {
        // Fetch invitations for the specified event
        const invitations = await Invitation.findAll({
            include: [
                {
                    model: BoothDetails,
                    where: { eventId }, // Ensure the booth belongs to the specified event
                },
            ],
        });

        if (!invitations || invitations.length === 0) {
            throw new Error("No invitations found for this event");
        }

        return {
            invitations: invitations.map((invitation) => invitation.toJSON()),
        };
    } catch (error) {
        console.error("Error in getInvitationsForEvent:", error);
        throw new Error((error as Error).message || "Failed to retrieve invitations.");
    }
};

// Delete an invitation by ID
export const deleteInvitationById = async (invitationId: string): Promise<any> => {
    try {
        // Find the invitation by ID
        const invitation = await Invitation.findByPk(invitationId);

        if (!invitation) {
            throw new Error("Invitation not found");
        }

        // Delete the invitation
        await invitation.destroy();

        return;
    } catch (error) {
        console.error("Error in deleteInvitationById:", error);
        throw new Error((error as Error).message || "Failed to delete invitation.");
    }
};