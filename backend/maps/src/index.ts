import express from 'express'
import { PORT, DB_NAME } from './config'
import { initializeDatabase } from './database'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { errorHandler } from '@utils/error-handler'
import router from '@routes/routes'
import { createFolder, uploadFile, generatePublicURL, listFolderContent } from './utils/google-drive'


/*
    Craft a prompt explaining in details how the frontend should be
*/


const mapsFolderId = "1NBUhoUG0pmBN5Kw1Wcii2utU33M2GyrK"
const demoFolderId = "1KHHpshYBoa9PACaxO5tnu70hic2SZzJx"
const indexts = "1YS_1lymwf3sDLiVUArHyd8Eqe7YuUipB"
const utilsGoogle_drivets = "16is-BpPVftP05d8DGGEckLlXpKowx2LQ"
const custom_errorts = "12MI-iWVrJwmXNr8RJA5864DUCgPMypTE"

const demoFolderCreation = async (folderName: string) => {
    try {
        const res = await createFolder(folderName)
        console.log("res:", res);
    } catch (err: any) {
        console.error("err:", err.message)
    }
}

// (async () => {
//     await demoFolderCreation(demoFolder);
// })();

import path from 'path'
import fs from 'fs'
import { Readable } from 'stream'
const demoUploadToFolderFunction = async () => {
    try {
        const fileName = 'index.d.ts'
        const filePath = path.join(__dirname, "types/express/",  fileName)
        const fileBuffer = fs.readFileSync(filePath) // Read the file as a buffer
        const parentId = demoFolderId

        // Convert the buffer to a readable stream
        const fileStream = Readable.from(fileBuffer)

        const uploadedFile = await uploadFile(fileName, fileStream, parentId)
        console.log('Uploaded file:', uploadedFile)
    } catch (err: any) {
        console.error('Error uploading file:', err.message)
    }
}

// (async () => {
//     await demoUploadToFolderFunction()
// })()

const demoGeneratePublicURLInFolder = async () => {
    try {
        const fileId = utilsGoogle_drivets;
        await generatePublicURL(fileId);

    } catch (err: any) {
        throw err
    }
};

// (async () => {
//     await demoGeneratePublicURLInFolder()
// })()

const demoListFolderContent = async () => {
    try {
        await listFolderContent(demoFolderId)
    } catch (err: any) {
        throw err
    }
};

// (async () => {
//     await demoListFolderContent()
// })()

// import { run } from '@/utils/map-splitter'
// run()

const app = express()

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200,
}

// Enable CORS
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight requests for all routes

// Middleware for parsing JSON and URL-encoded bodies
app.use(express.json());
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
app.use(errorHandler)

app.all('*', (req, res) => {
    res.status(404).json({ message: "Sorry! Page not found" })
})

initializeDatabase()
    .then(() => {
        console.log(`Connection to ${DB_NAME} has been established successfully.`);
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`)
        })
    })
    .catch(err => {
        console.error(`Error connecting to ${DB_NAME}:`, err.message);
    })