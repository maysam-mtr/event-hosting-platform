import { Request, Response } from 'express';
import { loginUser, loginHost, clearToken ,clearHostToken} from '../services/auth.service';
import jwt from 'jsonwebtoken';

const loginController = async (req: Request, res: Response): Promise<void> => {
    const credentials = req.body;
    try {
        const user = await loginUser(credentials);
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
        console.log(token);
        res.cookie('token', token, {
            httpOnly: true, // Prevents client-side access
            sameSite: 'strict', // Helps prevent CSRF attacks
            maxAge: 3600000, // 1 hour in milliseconds
            secure: false
        });
        res.clearCookie('hostToken');
        res.status(200).json({ userId: user.id });
    } catch (err) {
        res.status(401).json({
            message: "Internal error occurred",
            details: {
                error: (err as Error).message,
                info: (err as any).details
            }
        });
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
            maxAge: 3600000, // 1 hour in milliseconds
            secure: false
        });
        res.clearCookie('token');

        res.status(200).json({ hostId: host.id });
    } catch (err) {
        res.status(401).json({
            message: "Internal error occurred",
            details: {
                error: (err as Error).message,
                info: (err as any).details
            }
        });
    }
};

const logoutHostController = (req: Request, res: Response): void => {
    clearHostToken(res);
    res.status(200).json({ message: "Logout successful" });
};

const logoutController = (req: Request, res: Response): void => {
    clearToken(res);
    res.status(200).json({ message: "Logout successful" });
};
const verifyUserController = (req: Request, res: Response): void => {
    res.status(200).json({ message: "User verified" });
};

const verifyHostController = (req: Request, res: Response): void => {
    res.status(200).json({ message: "Host verified" });
};

export {
    loginController,
    logoutController,
    logoutHostController,
    verifyUserController,
    loginHostController,
    verifyHostController,
};