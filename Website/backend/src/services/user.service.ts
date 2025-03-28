import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { Op } from 'sequelize';
import User from '../models/User';

dotenv.config();

const createUser = async (userData: any): Promise<any> => {
    try {
        const { username, email} = userData;

    // Check if the username or email already exists
    const existingUser = await User.findOne({ where: { email } });
    const existingUsername = await User.findOne({ where: { username } });

    if (existingUser) {
        throw new Error("Email is already in use.");
    }
    if (existingUsername) {
        throw new Error("Username is already taken.");
    }console.log("userData",userData);

        const hashedPassword = await bcrypt.hash(userData.password, 10);
        // Replace plain password with hashed password
        const user = await User.create({ ...userData, password: hashedPassword });
        console.log("New user created:", user.toJSON());
        // exclude the password from the returned user object
        const { password, ...userWithoutPassword } = user.toJSON();
        return userWithoutPassword;
    } catch (err) {
        throw new Error((err as Error).message || '');
    }
};

const getAllUsers = async (): Promise<any[]> => {
    try {
        const users = await User.findAll();
        return users;
    } catch (err) {
        throw new Error((err as Error).message || '');
    }
};

const getUser = async (userID: string): Promise<any> => {
    try {
        const user = await User.findByPk(userID);
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    } catch (err) {
        throw new Error((err as Error).message || '');
    }
};

const deleteUser = async (userID: string): Promise<any> => {
    try {
        const user = await User.findByPk(userID);
        if (!user) {
            throw new Error("User not found");
        }
        await user.destroy();
        return user;
    } catch (err) {
        throw new Error((err as Error).message || '');
    }
};

const changePassword = async ({ user, oldPassword, newPassword }: { user: any, oldPassword: string, newPassword: string }): Promise<any> => {
    try {
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            throw new Error('Old password is incorrect');
        }
        user.password = newPassword;
        await user.save();
        return user;
    } catch (err) {
        throw new Error((err as Error).message || '');
    }
};

const findByUsernameOrEmail = async (usernameOrEmail: string): Promise<any> => {
    try {
        console.log("usernameOrEmail",usernameOrEmail);
        const user = await User.findOne({
            where: {
                [Op.or]: [{ email: usernameOrEmail }, { username: usernameOrEmail }]
            }
        });
        if (!user) {
            throw new Error("User not found");
        }
        console.log("user",user);
        return user;
    } catch (err) {
        throw new Error((err as Error).message || '');
    }
};

export {
    createUser,
    getAllUsers,
    getUser,
    deleteUser,
    changePassword,
    findByUsernameOrEmail,
};