import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { createHost} from '../services/host.service';
import { clearToken } from '../services/auth.service';
import { sendResponse } from '../Utils/responseHelper';

const createHostController = async (req: Request, res: Response): Promise<void> => {
    console.log("hi",(req as any).hostUser)
      if ((req as any).hostUser) {
        sendResponse(res, false, 403, '"You are already logged in and cannot create a new account.', [], [
                { code: 'HOST_LOGIN_ERROR', message:  '"You are already logged in and cannot create a new account.'  },
              ]);
              return;
    }

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        sendResponse(res, false, 400, 'Validation Failed', [], [
            { code: 'VALIDATION_ERROR', message:  errors.array()[0].msg  },
          ]);
        return;
    }

    try {
        const host = req.body;
        const newHost = await createHost(host);
        sendResponse(res, true, 200, 'Host login successful', [{ newHost }]);
        return;
    } catch (err) {
        sendResponse(res, false, 500, 'Internal Server Error', [], [
            { code: 'CREATE_HOST_ERROR', message: (err as Error).message },
          ]);
        return;
    }
};

export { createHostController };
