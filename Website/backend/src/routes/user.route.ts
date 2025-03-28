import express from 'express';
import {
    getAllUsersController,
    getUserController,
    deleteUserController,
    changePasswordController
} from '../controllers/user.controller';
import { changePasswordValidation } from '../validation/user.validator';

const router = express.Router();

router.post("/cp", changePasswordValidation(), changePasswordController);

router.get("/getAll", getAllUsersController);
router.get("/get", getUserController);
router.delete("/delete", deleteUserController);

export default router;