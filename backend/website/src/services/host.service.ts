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
export{ findHostByEmail, createHost};