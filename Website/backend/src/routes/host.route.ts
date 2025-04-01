import express from "express";
import { updateHostController } from "../controllers/host.controller";
import { updateHostValidation } from "../validation/host.validator";
import { authenticateHost } from "../middleware/authentication";

const router = express.Router();

// Update a host by ID
router.put("/update",authenticateHost, updateHostValidation(), updateHostController);
//router.post("/cp", changePasswordValidation(), changePasswordController);

export default router;