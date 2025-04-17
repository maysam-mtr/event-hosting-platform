import express, { ErrorRequestHandler, Request, Response } from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import http from 'http'
import { errorHandler } from './middlewares/error.handler'
import { Schedule } from './interfaces/schedule.interface'
import { scheduleCronJob } from './scheduler'
import { CustomError } from './utils/Response & Error Handling/custom-errorutils/Response & Error Handling/custom-error'
import { CustomResponse } from './utils/Response & Error Handling/custom-errorutils/Response & Error Handling/custom-response'
import { hostAuthMiddleware } from './middlewares/auth.middleware'

const app = express()
const server = http.createServer(app)
const PORT = process.env.PORT || 3333

app.use(cors({ origin: ["http://localhost:5000", "http://localhost:3004"], credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.post('/schedule', hostAuthMiddleware, (req, res, next) => {
    try {
        const { data, startTime, endTime }: Schedule = req.body

        if (!data || !data.eventId || !startTime || !endTime) {
            throw new CustomError("Failed to extracting data inorder to schedule", 400)
        }

        const dateValidation = (time: Date) : string[] => {
            const now = Date.now()
            const maxTime = now + 30 * 24 * 60 * 60 * 1000 // 30 days from now
            
            const errors = []    
            
            if (isNaN(time.getTime())) {
                errors.push("Invalid date format")
            }
            
            if (time.getTime() < now) {
                errors.push("Start time cannot be in the past.")
            }
            
            if (time.getTime() > maxTime) {
                errors.push("Start time cannot exceed 30 days.")
            }
            return errors
        }

        const parsedStartTime = new Date(startTime)
        const parsedEndTime = new Date(endTime)

        const errors = dateValidation(parsedStartTime).concat(dateValidation(parsedEndTime))
        
        if (errors.length) {
            throw new CustomError("Error in the set date and time", 400, errors)
        }

        scheduleCronJob(data.eventId, parsedStartTime, parsedEndTime)
        CustomResponse(res, 200, "Successfully scheduled event start")
    } catch (err: any) {
        next(err)
    }
})

app.use(errorHandler as ErrorRequestHandler)

app.all('/', (req: Request, res: Response) => {
    res.status(404).json({ message: "Sorry! Page not found" })
})

server.listen(PORT, () => {
    console.log(`Scheduler running on port ${PORT}`)
})
