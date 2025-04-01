import express from 'express';
import {
    getAllUsersController,
    getUserController,
    deleteUserController,
    changePasswordController,
    updateUserController
} from '../controllers/user.controller';
import { changePasswordValidation, updateUserValidation } from '../validation/user.validator';
import { authenticateUser } from '../middleware/authentication';

const router = express.Router();

router.post("/cp", changePasswordValidation(), changePasswordController);

router.get("/getAll", getAllUsersController);
router.get("/get", getUserController);
router.delete("/delete", deleteUserController);
router.put("/update",authenticateUser, updateUserValidation() ,updateUserController)

export default router;