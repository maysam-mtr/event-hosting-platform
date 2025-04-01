import { Request, Response } from 'express';
import { loginUser, loginHost, clearToken ,clearHostToken} from '../services/auth.service';
import jwt from 'jsonwebtoken';
import { sendResponse } from '../Utils/responseHelper';

const loginController = async (req: Request, res: Response): Promise<void> => {
    const credentials = req.body;
    try {
        const user = await loginUser(credentials);
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
        console.log(token);
        res.cookie('token', token, {
            httpOnly: true, // Prevents client-side access
            sameSite: 'strict', // Helps prevent CSRF attacks
            maxAge: 12 * 60 * 60 * 1000, // 12 hours in milliseconds
            secure: false
        });
        res.clearCookie('hostToken');
        // Success response
    sendResponse(res, true, 200, 'Login successful', [{ userId: user.id }]);
    } catch (err) {
        sendResponse(res, false, 401, 'Login failed', [], [
            { code: 'LOGIN_ERROR', message: (err as Error).message },
          ]);
    }
};

const loginHostController = async (req: Request, res: Response): Promise<void> => {
    const credentials = req.body;
    try {
        const host = await loginHost(credentials);
        console.log("host id _",host._id);
        console.log("host id without -",host.id)
        const token = jwt.sign({ id: host.id }, process.env.JWT_SECRET_HOST as string, { expiresIn: '1h' });
        console.log(token);
        res.cookie('hostToken', token, {
            httpOnly: true, // Prevents client-side access
            sameSite: 'strict', // Helps prevent CSRF attacks
            maxAge: 12 * 60 * 60 * 1000, // 12 hours in milliseconds
            secure: false
        });
        res.clearCookie('token');

      sendResponse(res, true, 200, 'Host login successful', [{ hostId: host.id }]);
    } catch (err) {
        sendResponse(res, false, 401, 'Host Login failed', [], [
            { code: 'HOST_LOGIN_ERROR', message: (err as Error).message },
          ]);
        
    }
};

const logoutHostController = (req: Request, res: Response): void => {
  try {
    clearHostToken(res);

    // Success response
    sendResponse(res, true, 200, 'Host logout successful', []);
  } catch (err) {
    console.error(err);

    // Error response
    sendResponse(res, false, 500, 'Host logout failed', [], [
      { code: 'HOST_LOGOUT_ERROR', message: (err as Error).message },
    ]);
  }
};

const logoutController = (req: Request, res: Response): void => {
  try {
    clearToken(res);

    // Success response
    sendResponse(res, true, 200, 'Logout successful', []);
  } catch (err) {
    console.error(err);

    // Error response
    sendResponse(res, false, 500, 'Logout failed', [], [
      { code: 'LOGOUT_ERROR', message: (err as Error).message },
    ]);
  }
};
const verifyUserController = (req: Request, res: Response): void => {
  try {
    // Success response
    sendResponse(res, true, 200, 'User verified', []);
  } catch (err) {
    console.error(err);

    // Error response
    sendResponse(res, false, 500, 'User verification failed', [], [
      { code: 'USER_VERIFICATION_ERROR', message: (err as Error).message },
    ]);
  }
};

const verifyHostController = (req: Request, res: Response): void => {
  try {
    // Success response
    sendResponse(res, true, 200, 'Host verified', []);
  } catch (err) {
    console.error(err);

    // Error response
    sendResponse(res, false, 500, 'Host verification failed', [], [
      { code: 'HOST_VERIFICATION_ERROR', message: (err as Error).message },
    ]);
  }
};

export {
    loginController,
    logoutController,
    logoutHostController,
    verifyUserController,
    loginHostController,
    verifyHostController,
};