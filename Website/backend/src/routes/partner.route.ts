import express from "express";
import { getPartnerByIdController, updatePartnerController } from "../controllers/partner.controller";
import { updatePartnerValidation } from "../validation/partner.validator";
import { authenticateUser } from "../middleware/authentication";

const router = express.Router();

// Update a partner by ID
router.put("/update/:partnerId",authenticateUser, updatePartnerValidation() ,updatePartnerController);

router.get('/:id', getPartnerByIdController);

export default router;