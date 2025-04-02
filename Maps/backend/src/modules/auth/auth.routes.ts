import express from "express"
import { adminLoginController, adminLogoutController } from "./auth.controller"

const authRouter = express.Router()

authRouter.get("/login", adminLoginController)
authRouter.get("/logout", adminLogoutController)

export default authRouter