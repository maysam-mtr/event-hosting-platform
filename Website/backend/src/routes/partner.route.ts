import express from "express";
import { updatePartnerController } from "../controllers/partner.controller";
import { updatePartnerValidation } from "../validation/partner.validator";
import { authenticateUser } from "../middleware/authentication";

const router = express.Router();

// Update a partner by ID
router.put("/update/:partnerId",authenticateUser, updatePartnerValidation() ,updatePartnerController);

export default router;