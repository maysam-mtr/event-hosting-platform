import Partner from '../models/Partner';
import { getUser } from './user.service';

// Find or create a partner
export const findPartner = async (email: string): Promise<any> => {
    try {
        // Check if a partner with the email exists
        let partner = await Partner.findOne({ where: {primaryContactEmail: email } });
        if(!partner){
            return 0;
        }
        return partner;
    } catch (error) {
        throw new Error((error as Error).message || 'Failed to find or create partner.');
    }
};


// Create a partner with minimal required fields
export const createPartner = async ( userId: string, primaryContactFullName: string, primaryContactEmail: string): Promise<any> => {
    try {
        // Validate that the provided user ID exists
        const user = await getUser(userId);
        if (!user) {
            throw new Error("The provided user ID does not exist");
        }
     
        // Check for uniqueness of primaryContactEmail
        const existingEmail = await Partner.findOne({ where: { primaryContactEmail } });
        if (existingEmail) {
            throw new Error("A partner with this primary contact email already exists");
        }

        // Create the partner with minimal fields
        const partner = await Partner.create({
            userId,
            primaryContactFullName,
            primaryContactEmail
        });

        return partner;
    } catch (error) {
        throw new Error((error as Error).message || 'Failed to create partner.');
    }
};