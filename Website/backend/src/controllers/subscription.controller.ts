import { Request, Response } from 'express';
import { createSubscription,getSubscriptionPlans } from '../services/subscription.service';

const createSubscriptionController = async (req: Request, res: Response): Promise<void> => {
    const subscriptionData = req.body;
    const hostUser = (req as any).hostUser;

    try {
        console.log("hostUser",hostUser);
        const subscription = await createSubscription(subscriptionData,hostUser.id);
        res.status(201).json(subscription);
    } catch (err) {
        res.status(500).json({
            message: "Internal error occurred",
            details: {
                error: (err as Error).message,
                info: (err as any).details
            }
        });
    }
};


const getAllSubscriptionController = async (req: Request, res: Response): Promise<void> => {

    try {
        const subscriptionPlans = await getSubscriptionPlans();
        res.status(201).json(subscriptionPlans);
    } catch (err) {
        res.status(500).json({
            message: "Internal error occurred",
            details: {
                error: (err as Error).message,
                info: (err as any).details
            }
        });
    }
};

export {
    createSubscriptionController,
    getAllSubscriptionController
};