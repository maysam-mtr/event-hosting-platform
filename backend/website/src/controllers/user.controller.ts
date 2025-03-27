import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { createUser, getAllUsers, getUser, deleteUser, changePassword } from '../services/user.service';
import { clearToken } from '../services/auth.service';

const createUserController = async (req: Request, res: Response): Promise<void> => {
    // Check if user is already logged in  
    if ((req as any).user) {
        res.status(403).json({ message: "You are already logged in and cannot create a new account." });
        return;
    }

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(400).json({ status: 'validation-error', validationErrors: errors.array().map(error => error.msg) });
        return;
    }
    const user = req.body;

    try {
        const newUser = await createUser(user);
        res.status(200).json({ newUser });
        return;
    } catch (error: any) {
     res.status(400).json({ message: error.message || "Registration failed" });
     return;
    }
};

const getAllUsersController = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await getAllUsers();
        res.status(200).json({ users });
        return;
    } catch (err) {
        res.status(500).json({
            message: "Internal error occurred",
            details: {
                error: (err as Error).message,
                info: (err as any).details
            }
        });
        return;
    }
};

const getUserController = async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(400).json({ status: 'validation-error', validationErrors: errors.array().map(error => error.msg) });
        return;
    }

    try {
        const user = await getUser((req as any).user.id);
        res.status(200).json({ user });
        return;
    } catch (err) {
        res.status(500).json({
            message: "Internal error occurred",
            details: {
                error: (err as Error).message,
                info: (err as any).details
            }
        });
        return;
    }
};

const deleteUserController = async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(400).json({ status: 'validation-error', validationErrors: errors.array().map(error => error.msg) });
        return;
    }
    const userID = (req as any).user.id;

    try {
        const user = await deleteUser(userID);

        // and logout
        clearToken(res);

        res.status(200).json({ user });
        return;
    } catch (err) {
        res.status(500).json({
            message: "Internal error occurred",
            details: {
                error: (err as Error).message,
                info: (err as any).details
            }
        });
        return;
    }
};

const changePasswordController = async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(400).json({ status: 'validation-error', validationErrors: errors.array().map(error => error.msg) });
        return;
    }
    const { oldPassword, newPassword } = req.body;

    try {
        const user = await getUser((req as any).user.id);
        const result = await changePassword({ user, oldPassword, newPassword });
        res.status(200).json({ result });
        return;
    } catch (err) {
        res.status(400).json({
            message: "Internal error occurred",
            details: {
                error: (err as Error).message,
                info: (err as any).details
            }
        });
        return;
    }
};

export {
    createUserController,
    getAllUsersController,
    getUserController,
    deleteUserController,
    changePasswordController,
};