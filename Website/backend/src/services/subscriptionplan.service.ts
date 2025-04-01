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
  

  // Get the number of rooms allowed for a subscription
  export const getNumberOfRoomsByPlanId = async (subscriptionId: string): Promise<number> => {
      try {
          // Fetch the subscription and include its associated subscription plan
          const subscriptionplan = await Subscriptionplan.findByPk(subscriptionId)
  
          if (!subscriptionplan ) {
              throw new Error("subscription plan not found");
          }
  
          // Return the number of rooms from the subscription plan
          return subscriptionplan.nbOfRooms;
      } catch (error) {
          throw new Error((error as Error).message || "Failed to fetch number of rooms");
      }
  };
export {
    createSubscriptionPlan,
    getSubscriptionPlans
};