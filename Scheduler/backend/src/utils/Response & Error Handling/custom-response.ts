import { ApiResponse } from "@/interfaces/response.interface"
import { Response } from "express"

export function CustomResponse<T>(
    res: Response,
    statusCode: number,
    messages: string | string[],
    data: T | null = null,
    errors: any | null = null
) {
    if (typeof messages === "string") messages = [messages]
    const response: ApiResponse<T> = { statusCode, messages, data, errors }
    res.status(statusCode).json(response)
}