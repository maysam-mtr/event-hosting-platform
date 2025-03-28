import { Router } from 'express';
import { createSubscriptionPlanController,getAllSubscriptionPlanController } from '../controllers/subscriptionplan.controller';

const router = Router();

router.post('/add', createSubscriptionPlanController);

router.get('/get', getAllSubscriptionPlanController);

export default router;