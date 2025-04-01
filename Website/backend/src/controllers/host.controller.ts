import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { createHost, updateHost} from '../services/host.service';
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


// Update a host
const updateHostController = async (req: Request, res: Response): Promise<void> => {
    try {
      const hostId = (req as any).hostUser?.id;
        // Validate the request body
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
           sendResponse(res, false, 400, 'Validation Failed', [], [
                { code: 'VALIDATION_ERROR', message:  errors.array()[0].msg  },
              ]);
            return;
        }

         const updatedData = req.body;

        // Call the service to update the host
        const updatedHost = await updateHost(hostId, updatedData);

        // Respond with the updated host
        res.status(200).json({
            success: true,
            statusCode: 200,
            message: "Host updated successfully",
            data: updatedHost,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            statusCode: 400,
            message: "Failed to update host",
            errors: [{ code: "UPDATE_HOST_ERROR", message: (error as Error).message }],
        });
    }
};
export { createHostController, updateHostController };
