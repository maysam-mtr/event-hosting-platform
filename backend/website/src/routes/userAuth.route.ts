import express from 'express';
import { loginController, logoutController, verifyUserController } from '../controllers/auth.controller';
import { createUserController } from '../controllers/user.controller';
import { userValidation } from '../validation/user.validator';
import { authenticateUser } from '../middleware/authentication';
import {optionalAuth} from '../middleware/optionalAuthentication';

const router = express.Router();

router.post("/login", loginController);
router.get("/auth/verify", authenticateUser, verifyUserController);
router.post("/register", optionalAuth,userValidation, createUserController);
router.post("/logout", authenticateUser, logoutController);

export default router;