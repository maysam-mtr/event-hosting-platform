import Partner from '../models/Partner';
import { getUser } from './user.service';

// Find or create a partner
export const findPartner = async (userId: string): Promise<any> => {
    try {
        console.log("userid he",userId)
        // Check if a partner with the email exists
        let partner = await Partner.findOne({ where: { userId } });
        console.log(partner)
        if(!partner){
            return 0;
        }
        return partner;
    } catch (error) {
        throw new Error((error as Error).message || 'Failed to find partner.');
    }
};


// Create a partner with minimal required fields
export const createPartner = async ( userId: string, primaryContactFullName: string, primaryContactEmail: string,
    companyName:string,companyLogo:string
): Promise<any> => {
    try {
        console.log("s",userId)
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

        const existingCompanyName = await Partner.findOne({ where: {  companyName } });
        if (existingCompanyName) {
            throw new Error("A partner with this company name already exists");
        } 


        // Create the partner with minimal fields
        const partner = await Partner.create({
            userId,
            primaryContactFullName,
            primaryContactEmail,
            companyName,
            companyLogo,
        });

        return partner;
    } catch (error) {
        throw new Error((error as Error).message || 'Failed to create partner.');
    }
};

// Update a partner by ID
export const updatePartner = async (
    partnerId: string,
    updatedData: Partial<Partner>
): Promise<any> => {
    try {
        // Fetch the existing partner
        const partner = await Partner.findByPk(partnerId);

        if (!partner) {
            throw new Error("Partner not found");
        }
        if (updatedData.id) {
            throw new Error("ID cannot be updated");
        }
        if (updatedData.userId) {
            throw new Error("User ID cannot be updated");
        }
        
        // Check for unique fields before updating
        if (updatedData.companyName && updatedData.companyName !== partner.companyName) {
            const existingPartnerWithCompanyName = await Partner.findOne({
                where: { companyName: updatedData.companyName },
            });

            if (existingPartnerWithCompanyName) {
                throw new Error("Company name must be unique");
            }
        }

        if (updatedData.primaryContactEmail && updatedData.primaryContactEmail !== partner.primaryContactEmail) {
            const existingPartnerWithEmail = await Partner.findOne({
                where: { primaryContactEmail: updatedData.primaryContactEmail },
            });

            if (existingPartnerWithEmail) {
                throw new Error("Primary contact email must be unique");
            }
        }

        // Update the partner's data
        const updatedPartner = await partner.update(updatedData);

        return updatedPartner.toJSON();
    } catch (error) {
        throw new Error((error as Error).message || "Failed to update partner");
    }
};