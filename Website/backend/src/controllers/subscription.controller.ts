import { Request, Response } from 'express';
import { createSubscription,getSubscriptionPlans } from '../services/subscription.service';
import { sendResponse } from '../Utils/responseHelper';

const createSubscriptionController = async (req: Request, res: Response): Promise<void> => {
    const subscriptionData = req.body;
    const hostUser = (req as any).hostUser;

    try {
        console.log("hostUser",hostUser);
        const subscription = await createSubscription(subscriptionData,hostUser.id);
       sendResponse(res, true, 201, 'Subscription created successfully', subscription);
        } catch (err) {
            sendResponse(res, false, 500, 'Failed to create subscription', [], [
                { code: 'CREATE_SUBSCRIPTION_ERROR', message: (err as Error).message },
              ]);
        }
};

const getAllSubscriptionController = async (req: Request, res: Response): Promise<void> => {

    try {
        const subscriptionPlans = await getSubscriptionPlans();
        sendResponse(res, true, 200, 'Subscriptions returned successfully',subscriptionPlans);
    } catch (err) {
        sendResponse(res, false, 500, 'Failed to get subscription', [], [
            { code: 'GET_SUBSCRIPTION_ERROR', message: (err as Error).message },
          ]);
    }
};

export {
    createSubscriptionController,
    getAllSubscriptionController
};