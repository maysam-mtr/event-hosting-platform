import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { sendResponse } from '../Utils/responseHelper';

const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
    const cookieName = process.env.USER_TOKEN_COOKIE_NAME || 'token'
    const token = req.cookies[cookieName];

    if (!token) {
        sendResponse(res, false, 401, 'You are not logged in' , [], [
            { code: 'AUTHORIZATION_ERROR', message:'You are not logged in'  },
          ]);
        return;
    }

    try {
        console.log(token)
        const verified = jwt.verify(token, process.env.JWT_SECRET as string);
        (req as any).user = verified;
        console.log(verified)
        console.log((req as any).user.id)
        // Attach the user info to the request
        next();
    } catch (err) {
        console.error("Token verification failed:", err);
         sendResponse(res, false, 403, 'Invalid Token', [], [
                    { code: 'TOKEN_ERROR', message: 'Invalid User Token' },
                  ]);
    }
};
const authenticateHost = (req: Request, res: Response, next: NextFunction) => {
    const cookieName = process.env.HOST_TOKEN_COOKIE_NAME || 'hostToken';
    const hostToken = req.cookies[cookieName];
    console.log("Received token:",hostToken);

    if (!hostToken) {
        sendResponse(res, false, 401, 'You are not logged in' , [], [
            { code: 'AUTHORIZATION_ERROR', message:'You are not logged in'  },
          ]);
        return;
    }

    try {
        const verified = jwt.verify(hostToken, process.env.JWT_SECRET_HOST as string);
        (req as any).hostUser = verified;
        next();
    } catch (err) {
        sendResponse(res, false, 403, 'Invalid Token', [], [
            { code: 'TOKEN_ERROR', message: 'Invalid Host Token' },
          ]);
    }
};

export { authenticateUser, authenticateHost };