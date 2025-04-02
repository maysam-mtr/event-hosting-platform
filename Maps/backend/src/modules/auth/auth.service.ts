import { ADMIN_USERNAME, ADMIN_PASSWORD, JWT_ADMIN_ACCESS_TOKEN_SECRET } from "@/config"
import { generateJWT } from "@/middlewares/jwt.service"
import { CustomError } from "@/utils/Response & Error Handling/custom-error"

export const adminLoginService = async (loginData: { username: string, password: string }) => {
  try {
    // Check admin credentials
    if (loginData.username !== ADMIN_USERNAME || loginData.password !== ADMIN_PASSWORD) {
      throw new CustomError("Invalid admin credentials", 401)
    }

    const payload = {
      username: loginData.username,
      role: "admin",
    }

    const accessToken = await generateJWT(payload, JWT_ADMIN_ACCESS_TOKEN_SECRET as string)

    return {
      user: {
        username: loginData.username,
        role: "admin",
      },
      accessToken,
    }
  } catch (err: any) {
    throw new CustomError("An error occurred during admin login", 500, err)
  }
}
