import { CustomError } from "@/utils/Response & Error Handling/custom-errorutils/Response & Error Handling/custom-error"
import { Request, Response, NextFunction } from "express"

export const errorHandler = (
    err: Error | CustomError,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    if (err instanceof CustomError) {
        return res.status(err.statusCode).json(err.toResponse())
    }

    res.status(500).json({
        statusCode: 500,
        messages: ["Internal Server Error"],
        data: null,
        errors: err.message || null,
    })
}