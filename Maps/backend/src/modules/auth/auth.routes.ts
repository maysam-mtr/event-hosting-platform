import express from "express"
import { adminLoginController, adminLogoutController, checkAdminLoggedInController as checkAdminLoginController } from "./auth.controller"

const authRouter = express.Router()

authRouter.post("/login", adminLoginController)
authRouter.get("/check", checkAdminLoginController)
authRouter.get("/logout", adminLogoutController)

export default authRouter