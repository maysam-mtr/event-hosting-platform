/**
 * Subscription Plan Service
 * 
 * Handles business logic for subscription plan management including:
 * - Creating new subscription plans with pricing and room limits
 * - Retrieving all available subscription plans
 * - Getting room count limits for specific subscription plans
 * 
 * This service manages the subscription tiers that hosts can purchase
 * to create events with different room capacities and features.
 */
import Subscriptionplan from '../models/Subscriptionplan';

/**
 * Creates a new subscription plan with specified features and pricing
 * @param planData - Object containing plan details (name, price, room count, duration)
 * @returns Promise resolving to the created subscription plan data
 * @throws Error if plan creation fails or validation errors occur
 */
const createSubscriptionPlan = async (planData: any): Promise<any> => {
    try {
        const { planName, price, nbOfRooms,maxDuration } = planData;

        // Create a new subscription plan
        const subscriptionPlan = await Subscriptionplan.create({
            planName,
            price,
            nbOfRooms,
            maxDuration
        });

        console.log("New subscription plan created:", subscriptionPlan.toJSON());
        return subscriptionPlan.toJSON();
    } catch (err) {
        throw new Error((err as Error).message || '');
    }
};

/**
 * Retrieves all available subscription plans from the database
 * @returns Promise resolving to array of all subscription plans
 * @throws Error if database query fails
 */
const  getSubscriptionPlans = async (): Promise<any> => {
    try {
      const subscriptionplans = await Subscriptionplan.findAll();
      return subscriptionplans;
    } catch (err) {
        throw new Error((err as Error).message || '');
    }
  };
  

/**
 * Gets the maximum number of rooms allowed for a specific subscription plan
 * Used to enforce room limits when hosts create events
 * @param subscriptionId - UUID of the subscription plan
 * @returns Promise resolving to the number of rooms allowed
 * @throws Error if subscription plan not found or query fails
 */
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
