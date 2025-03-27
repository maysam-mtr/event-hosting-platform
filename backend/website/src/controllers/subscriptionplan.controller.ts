import { Request, Response } from 'express';
import { createSubscriptionPlan,getSubscriptionPlans } from '../services/subscriptionplan.service';

const createSubscriptionPlanController = async (req: Request, res: Response): Promise<void> => {
    const planData = req.body;

    try {
        const subscriptionPlan = await createSubscriptionPlan(planData);
        res.status(201).json(subscriptionPlan);
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


const getAllSubscriptionPlanController = async (req: Request, res: Response): Promise<void> => {

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
    createSubscriptionPlanController,
    getAllSubscriptionPlanController
};