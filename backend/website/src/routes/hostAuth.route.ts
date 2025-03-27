import express from 'express';
import { loginHostController, logoutHostController, verifyHostController } from '../controllers/auth.controller';
import { createHostController } from '../controllers/host.controller';
import { hostValidation } from '../validation/host.validator';
import {authenticateHost}  from '../middleware/authentication';
import {optionalHostAuth} from '../middleware/optionalAuthentication';

const router = express.Router();

router.post("/login", loginHostController);
router.get("/auth/verify", authenticateHost, verifyHostController);
router.post("/register", optionalHostAuth,hostValidation, createHostController);
router.post("/logout", authenticateHost, logoutHostController);

export default router;