import PrivateEventCredential from '../models/PrivateEventCredential';

import crypto from 'crypto';

const generateRandomPasscode = (): string => {
    return crypto.randomBytes(3).toString('hex').toUpperCase(); // Example: "A1B2C3"
};

// Create a private event credential
const createPrivateEventCredential = async ( eventId: string, passcode?: string ): Promise<PrivateEventCredential> => {
    try {
        const finalPasscode = passcode || generateRandomPasscode(); // Use provided passcode or generate one

        // Create and save the private event credential
        const credential = await PrivateEventCredential.create({
            eventId,
            passcode: finalPasscode,
        });

        return credential;
    } catch (error) {
        throw new Error((error as Error).message || 'Failed to create private event credential.');
    }
};

// Fetch private event credentials by eventId
 const getPrivateEventCredential = async (eventId: string): Promise<string| null> => {
    try {
        // Find the private event credential associated with the given eventId
        const credential = await PrivateEventCredential.findOne({
            where: { eventId },
        });

        if (!credential) {
            throw new Error("Private event credentials not found");
        }

        return credential.passcode;
    } catch (error) {
        throw new Error((error as Error).message || 'Failed to fetch private event credentials.');
    }
};

// Delete private event credentials by eventId
 const deletePrivateEventCredential = async (eventId: string): Promise<void> => {
    try {
        // Find the private event credential associated with the given eventId
        const credential = await PrivateEventCredential.findOne({
            where: { eventId },
        });

        if (!credential) {
            throw new Error("Private event credentials not found");
        }

        // Delete the credential
        await credential.destroy();

        console.log(`Private event credentials deleted for event ID: ${eventId}`);
    } catch (error) {
        throw new Error((error as Error).message || 'Failed to delete private event credentials.');
    }
};

export {createPrivateEventCredential, getPrivateEventCredential,deletePrivateEventCredential}