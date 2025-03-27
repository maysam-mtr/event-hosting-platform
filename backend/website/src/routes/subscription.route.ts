import { Router } from 'express';
import { createSubscriptionController,getAllSubscriptionController } from '../controllers/subscription.controller';
import { authenticateHost } from '../middleware/authentication';

const router = Router();

router.post('/new', authenticateHost,createSubscriptionController);

router.get('/get', getAllSubscriptionController);

export default router;