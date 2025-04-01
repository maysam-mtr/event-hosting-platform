import bcrypt from 'bcrypt';
import Host from '../models/Host';

const createHost = async (hostData: any): Promise<any> => {
    try {
        const hashedPassword = await bcrypt.hash(hostData.password, 10);

        // Replace plain password with hashed password
        const host = await Host.create({ ...hostData, password: hashedPassword });

        // exclude the password from the returned host object
        const { password, ...hostWithoutPassword } = host.toJSON();
        return hostWithoutPassword;
    } catch (err) {
        throw new Error((err as Error).message || '');
    }
};
const findHostByEmail = async (email: string): Promise<any> => {
    try {
        console.log("email",email);
        const host = await Host.findOne({
            where: { email: email }
        });
        if (!host) {
            throw new Error("Host not found");
        }
        console.log("host",host);
        return host;
    } catch (err) {
        throw new Error((err as Error).message || '');
    }
};

const updateHost = async (
    hostId: string,
    updatedData: Partial<Host>
): Promise<any> => {
    try {
        // Fetch the existing host
        const host = await Host.findByPk(hostId);

        if (!host) {
            throw new Error("Host not found");
        }

        // Whitelist the fields that can be updated
        const allowedFields = [
            "fullName",
            "companyName",
            "email",
            "phoneNumber",
            "companyWebsite",
            "companyIndustry",
            "businessRegistrationProof",
            "termsAgreement",
            "privacyAgreement",
        ];

        // Filter out any fields that are not in the whitelist
        const sanitizedData: Partial<Host> = {};
        for (const field of allowedFields) {
            if (field in updatedData) {
                sanitizedData[field as keyof Host] = updatedData[field as keyof Host];
            }
        }

        // Check for unique fields before updating
        if (sanitizedData.email && sanitizedData.email !== host.email) {
            const existingHostWithEmail = await Host.findOne({
                where: { email: sanitizedData.email },
            });

            if (existingHostWithEmail) {
                throw new Error("Email already in use");
            }
        }

        // Update the host's data with the sanitized input
        const updatedHost = await host.update(sanitizedData);

        return updatedHost.toJSON();
    } catch (error) {
        throw new Error((error as Error).message || "Failed to update host");
    }
};
export{ findHostByEmail, createHost,updateHost};