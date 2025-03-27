import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { createHost} from '../services/host.service';
import { clearToken } from '../services/auth.service';

const createHostController = async (req: Request, res: Response): Promise<void> => {
    console.log("hi",(req as any).hostUser)
      if ((req as any).hostUser) {
        res.status(403).json({ message: "You are already logged in and cannot create a new account." });
        return;
    }

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(400).json({ status: 'validation-error', validationErrors: errors.array().map(error => error.msg) });
        return;
    }
    const host = req.body;

    try {
        const newHost = await createHost(host);
        res.status(200).json({ newHost });
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

export { createHostController };
