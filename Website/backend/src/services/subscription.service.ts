import Subscription from '../models/Subscription';

const createSubscription = async (subscriptionData: any, hostId: string): Promise<any> => {
    try {
        const { planId} = subscriptionData;
        // Create a new event
        const event = await Subscription.create({
            hostId,
            planId
        });
        return event.toJSON();
    } catch (err) {
        throw new Error((err as Error).message || '');
    }
};

const  getSubscriptionPlans = async (): Promise<any> => {
    try {
      const subscriptionplans = await Subscription.findAll();
      return subscriptionplans;
    } catch (err) {
        throw new Error((err as Error).message || '');
    }
  };

  const markSubscriptionAsUsed = async (subscriptionId: string): Promise<void> => {
    try {
        const subscription = await Subscription.findByPk(subscriptionId);
        if (subscription) {
            await subscription.update({ isUsed: 1 });
            console.log(`Subscription ${subscriptionId} marked as used.`);
        } else {
            throw new Error(`Subscription with ID ${subscriptionId} not found.`);
        }
    } catch (err) {
        console.error("Error updating subscription:", err);
        throw new Error((err as Error).message || 'Failed to update subscription.');
    }
};


 const isSubscriptionValid = async (subscriptionId: string, hostId:string): Promise<{ isValid: boolean; message: string }> => {
    try {
        // Fetch the subscription by ID
        const subscription = await Subscription.findOne({
            where:{
                id: subscriptionId,
                hostId:hostId,
            }
        });

        if (!subscription) {
            return {
                isValid: false,
                message: "No subscriptions",
            };
        }

        // Calculate the expiration date (30 days after creation)
        const createdAt = new Date(subscription.createdAt);
        const expirationDate = new Date(createdAt.getTime() + 30 * 24 * 60 * 60 * 1000); // Add 30 days

        // Check if the subscription is within the 30-day window and not used
        const now = new Date();
        if (now <= expirationDate && subscription.isUsed === 0) {
            return {
                isValid: true,
                message: "Subscription is valid",
            };
        } else if (now > expirationDate) {
            return {
                isValid: false,
                message: "Subscription has expired",
            };
        } else if (subscription.isUsed === 1) {
            return {
                isValid: false,
                message: "Subscription has already been used",
            };
        }

        return {
            isValid: false,
            message: "Invalid subscription status",
        };
    } catch (error) {
        throw new Error((error as Error).message || 'Failed to check subscription validity.');
    }
};

import { getNumberOfRoomsByPlanId } from './subscriptionplan.service';

// Get the number of rooms allowed for a subscription
export const getNumberOfBooths = async (subscriptionId: string): Promise<number> => {
    try {
        // Fetch the subscription and include its associated subscription plan
        const subscription1 = await Subscription.findByPk(subscriptionId);

        if (!subscription1) {
            throw new Error("Subscription or subscription plan not found");
        }
        // Return the number of rooms from the subscription plan
        return await getNumberOfRoomsByPlanId(subscription1.planId);
    } catch (error) {
        throw new Error((error as Error).message || "Failed to fetch number of rooms");
    }
};

export {
    createSubscription,
    getSubscriptionPlans,
    markSubscriptionAsUsed, 
    isSubscriptionValid
};