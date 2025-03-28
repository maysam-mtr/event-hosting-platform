import { Request, Response } from 'express';
import { createSubscriptionPlan,getSubscriptionPlans } from '../services/subscriptionplan.service';
import { sendResponse } from '../Utils/responseHelper';

const createSubscriptionPlanController = async (req: Request, res: Response): Promise<void> => {
    const planData = req.body;

    try {
        const subscriptionPlan = await createSubscriptionPlan(planData);
         sendResponse(res, true, 201, 'Subscription plan created successfully', subscriptionPlan);
          } catch (err) {
              sendResponse(res, false, 500, 'Failed to create subscription plan', [], [
                  { code: 'CREATE_SUBSCRIPTIONPLAN_ERROR', message: (err as Error).message },
                ]);
          }
};


const getAllSubscriptionPlanController = async (req: Request, res: Response): Promise<void> => {

    try {
        const subscriptionPlans = await getSubscriptionPlans();
        sendResponse(res, true, 200, 'Subscription plans returned successfully', subscriptionPlans);
    } catch (err) {
        sendResponse(res, false, 500, 'Failed to get subscription plans', [], [
            { code: 'GET_SUBSCRIPTIONPLANS_ERROR', message: (err as Error).message },
          ]);
    }
};

export {
    createSubscriptionPlanController,
    getAllSubscriptionPlanController
};