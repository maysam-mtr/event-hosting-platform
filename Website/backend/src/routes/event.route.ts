import { Router } from 'express';
import { createEventController,updateEventController ,getPublicEventsController ,getEventDetailsController, joinEventController,
    getEventsForHostController, filterEventsByStatusController
} from '../controllers/event.controller';
import { authenticateHost } from '../middleware/authentication';
import { createEventValidation, updateEventValidation } from '../validation/event.validator';

const router = Router();

router.post('/create', authenticateHost,createEventValidation(), createEventController);
router.put('/update/:eventId', authenticateHost,updateEventValidation(), updateEventController);
router.get('/public', getPublicEventsController);
router.get('/details/:eventId', getEventDetailsController);
router.post('/:eventId/join',joinEventController);

// Get all events for a specific host
router.get("/hosts/:hostId", getEventsForHostController);

// Filter events by status (past, ongoing, future)
router.get("/filter/:hostId", filterEventsByStatusController);

export default router;