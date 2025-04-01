import express from "express";
import { getPrivateEventCredentialController } from "../controllers/credential.controller";
import { authenticateHost } from "../middleware/authentication";


const router = express.Router();

// Get private event credential by eventId
router.get("/:eventId",authenticateHost, getPrivateEventCredentialController);

export default router;