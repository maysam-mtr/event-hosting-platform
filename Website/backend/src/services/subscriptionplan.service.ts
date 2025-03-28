import Subscriptionplan from '../models/Subscriptionplan';

const createSubscriptionPlan = async (planData: any): Promise<any> => {
    try {
        const { planName, price } = planData;

        // Create a new subscription plan
        const subscriptionPlan = await Subscriptionplan.create({
            planName,
            price
        });

        console.log("New subscription plan created:", subscriptionPlan.toJSON());
        return subscriptionPlan.toJSON();
    } catch (err) {
        throw new Error((err as Error).message || '');
    }
};
const  getSubscriptionPlans = async (): Promise<any> => {
    try {
      const subscriptionplans = await Subscriptionplan.findAll();
      return subscriptionplans;
    } catch (err) {
        throw new Error((err as Error).message || '');
    }
  };
export {
    createSubscriptionPlan,
    getSubscriptionPlans
};