/**
 * User Service
 * 
 * Handles all user-related business logic including:
 * - User registration with validation and password hashing
 * - User authentication and profile management
 * - Password changes with security validation
 * - User data retrieval and updates
 * - User deletion and account management
 * 
 * This service manages the core user functionality for event attendees
 * and handles secure password operations using bcrypt.
 */
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { Op } from 'sequelize';
import User from '../models/User';

dotenv.config();

/**
 * Creates a new user account with encrypted password and validation
 * Checks for duplicate usernames and emails before creation
 * @param userData - Object containing user registration information
 * @returns Promise resolving to user data (excluding password)
 * @throws Error if username/email already exists or creation fails
 */
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

/**
 * Retrieves all users from the database
 * @returns Promise resolving to array of all user records
 * @throws Error if database query fails
 */
const getAllUsers = async (): Promise<any[]> => {
    try {
        const users = await User.findAll();
        return users;
    } catch (err) {
        throw new Error((err as Error).message || '');
    }
};

/**
 * Retrieves a specific user by their ID
 * @param userID - UUID of the user to retrieve
 * @returns Promise resolving to user data
 * @throws Error if user not found or query fails
 */
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

/**
 * Permanently deletes a user account from the database
 * @param userID - UUID of the user to delete
 * @returns Promise resolving to deleted user data
 * @throws Error if user not found or deletion fails
 */
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

/**
 * Changes a user's password with old password verification
 * @param user - User object to update
 * @param oldPassword - Current password for verification
 * @param newPassword - New password to set
 * @returns Promise resolving to updated user data
 * @throws Error if old password is incorrect or update fails
 */
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

/**
 * Finds a user by either username or email address
 * Used for login functionality where users can use either identifier
 * @param usernameOrEmail - Username or email to search for
 * @returns Promise resolving to user data if found
 * @throws Error if user not found or query fails
 */
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

/**
 * Updates user profile information with validation
 * Prevents updating sensitive fields and enforces uniqueness constraints
 * @param userId - UUID of user to update
 * @param updatedData - Partial user data with fields to update
 * @returns Promise resolving to updated user data
 * @throws Error if user not found, validation fails, or unique constraints violated
 */
const updateUser = async (
    userId: string,
    updatedData: Partial<User>
): Promise<any> => {
    try {
        // Fetch the existing user
        const user = await User.findByPk(userId);

        if (!user) {
            throw new Error("User not found");
        }

        // Prevent updating sensitive fields like `id`
        if (updatedData.id) {
            throw new Error("ID cannot be updated");
        }

        // Check for unique fields before updating
        if (updatedData.username && updatedData.username !== user.username) {
            const existingUserWithUsername = await User.findOne({
                where: { username: updatedData.username },
            });

            if (existingUserWithUsername) {
                throw new Error("Username must be unique");
            }
        }

        if (updatedData.email && updatedData.email !== user.email) {
            const existingUserWithEmail = await User.findOne({
                where: { email: updatedData.email },
            });

            if (existingUserWithEmail) {
                throw new Error("Email must be unique");
            }
        }

        // Whitelist the fields that can be updated
        const allowedFields = [
            "fullName",
            "username",
            "email",
            "profilePic",
            "dateOfBirth",
            "country",
            "educationLevel",
            "fieldOfStudy",
            "preferredEventType",
            "yearsOfExperience",
            "linkedin",
            "github",
        ];

        // Filter out any fields that are not in the whitelist
        const sanitizedData: Partial<User> = {};
        for (const field of allowedFields) {
            if (field in updatedData) {
                sanitizedData[field as keyof User] = updatedData[field as keyof User];
            }
        }

        // Update the user's data with the sanitized input
        const updatedUser = await user.update(sanitizedData);

        return updatedUser.toJSON();
    } catch (error) {
        throw new Error((error as Error).message || "Failed to update user");
    }
};

export {
    createUser,
    getAllUsers,
    getUser,
    deleteUser,
    changePassword,
    findByUsernameOrEmail,
    updateUser
};
