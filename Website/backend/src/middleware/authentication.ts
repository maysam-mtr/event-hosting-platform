import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.token;

    if (!token) {
        res.status(401).json({ message: 'You are not logged in' });
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
        res.status(403).json({ message: 'Invalid Token' });
    }
};
const authenticateHost = (req: Request, res: Response, next: NextFunction) => {
    const hostToken = req.cookies?.hostToken;
    console.log("Received token:",hostToken);

    if (!hostToken) {
        res.status(401).json({ message: 'You are not logged in' });
        return;
    }

    try {
        const verified = jwt.verify(hostToken, process.env.JWT_SECRET_HOST as string);
        (req as any).hostUser = verified;
        next();
    } catch (err) {
        res.status(403).json({ message: 'Invalid Host Token' });
    }
};

export { authenticateUser, authenticateHost };