import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { createUser, getAllUsers, getUser, deleteUser, changePassword, updateUser } from '../services/user.service';
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
const updateUserController = async (req: Request, res: Response): Promise<void> => {
    try {
        // Validate the request body
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
         sendResponse(res, false, 400, 'Validation Failed', [], [
                { code: 'VALIDATION_ERROR', message:  errors.array()[0].msg  },
              ]);
                 return;
        }

        // Extract the user ID and updated data from the request
       const id = (req as any).user?.id;
        const updatedData = req.body;

        // Call the service to update the user
        const updatedUser = await updateUser(id, updatedData);

        // Respond with the updated user
        res.status(200).json({
            success: true,
            statusCode: 200,
            message: "User updated successfully",
            data: updatedUser,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            statusCode: 400,
            message: "Failed to update user",
            errors: [{ code: "UPDATE_USER_ERROR", message: (error as Error).message }],
        });
    }
};
export {
    createUserController,
    getAllUsersController,
    getUserController,
    deleteUserController,
    changePasswordController,
    updateUserController
};