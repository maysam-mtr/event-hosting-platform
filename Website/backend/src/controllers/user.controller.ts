import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { createUser, getAllUsers, getUser, deleteUser, changePassword } from '../services/user.service';
import { clearToken } from '../services/auth.service';
import { sendResponse } from '../Utils/responseHelper';

const createUserController = async (req: Request, res: Response): Promise<void> => {
    // Check if user is already logged in  
    if ((req as any).user) {
       sendResponse(res, false, 403, 'You are already logged in and cannot create a new account.', [], [
            { code: 'LOGIN_ERROR', message: 'You are already logged in and cannot create a new account.'},
          ]);
        return;
    }

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        sendResponse(res, false, 400, 'Validation Failed', [], [
            { code: 'VALIDATION_ERROR', message:  errors.array()[0].msg  },
          ]);  return;
    }
    const user = req.body;

    try {
        const newUser = await createUser(user);
        sendResponse(res, true, 200, 'User created successfully', newUser);
    } catch (err) {
        sendResponse(res, false, 500, 'Failed to create user', [], [
            { code: 'USER_CREATE_ERROR', message: (err as Error).message },
          ]);
    }
};

const getAllUsersController = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await getAllUsers();
        sendResponse(res, true, 200, 'Users returned successfully', users);
    } catch (err) {
        sendResponse(res, false, 500, 'Failed to return users', [], [
            { code: 'RETURN_USERS_ERROR', message: (err as Error).message },
          ]);
    }
};

const getUserController = async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        sendResponse(res, false, 400, 'Validation Failed', [], [
            { code: 'VALIDATION_ERROR', message:  errors.array()[0].msg  },
          ]);  return;
    }

    try {
        const user = await getUser((req as any).user.id);
        sendResponse(res, true, 200, 'User returned successfully', [user]);
    } catch (err) {
        sendResponse(res, false, 500, 'Failed to return user', [], [
            { code: 'USER_GET_ERROR', message: (err as Error).message },
          ]);
          return;
    }
};

const deleteUserController = async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        sendResponse(res, false, 400, 'Validation Failed', [], [
            { code: 'VALIDATION_ERROR', message:  errors.array()[0].msg  },
          ]);  return;
    }
    const userID = (req as any).user.id;

    try {
        const user = await deleteUser(userID);
        // and logout
        clearToken(res);
        sendResponse(res, true, 200, 'User deleted successfully', [user]);
    } catch (err) {
        sendResponse(res, false, 500, 'Failed to delete user', [], [
            { code: 'DELETE_USER_ERROR', message: (err as Error).message },
          ]);
        return;
    }
};

const changePasswordController = async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
     sendResponse(res, false, 400, 'Validation Failed', [], [
            { code: 'VALIDATION_ERROR', message:  errors.array()[0].msg  },
          ]);
             return;
    }
    const { oldPassword, newPassword } = req.body;

    try {
        const user = await getUser((req as any).user.id);
        const result = await changePassword({ user, oldPassword, newPassword });
        sendResponse(res, true, 200, 'Password changed successfully', result);
    } catch (err) {
        sendResponse(res, false, 500, 'Failed to change password', [], [
            { code: 'CHANGE_PASSWORD_ERROR', message: (err as Error).message },
          ]);
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