import express, { ErrorRequestHandler } from 'express'
import { PORT, DB_NAME } from './config'
import { initializeDatabase } from './database'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { errorHandler } from '@/middlewares/error.handler'
import router from '@routes/routes'

const app = express()

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200,
}

// Enable CORS
app.use(cors(corsOptions))
app.options('*', cors(corsOptions)) // Handle preflight requests for all routes

// Middleware for parsing JSON and URL-encoded bodies
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


// Serve static files from the 'public' directory
app.use(express.static('public'))

// Middleware for parsing cookies
app.use(cookieParser())

// Use the router with the /api prefix
app.use('/api', router)
/**
 * Handles errors globally 
 * Usage example:
 *  In the controller when there is an error it calls next(err)
 *  which would be caught by this errorHandler function :)
 */
app.use(errorHandler as ErrorRequestHandler)

app.all('*', (req, res) => {
    res.status(404).json({ message: "Sorry! Page not found" })
})

initializeDatabase()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`)
        })
    })
    .catch(err => {
        console.error(`Error connecting to ${DB_NAME}:`, err.message)
    })