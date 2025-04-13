import express, { Express, Request, Response } from "express"
import dotenv from "dotenv"
import path from "path"
import cors from "cors"
import { initializeMapData } from "./initialization"

// loading the env file
dotenv.config()

const PORT = process.env.PORT || 3004

const app: Express = express()

// Enable CORS
app.use(
  cors({
    origin: ["http://localhost:5000", "http://localhost:5173", "http://localhost:3004"],
    credentials: true, 
  })
);

app.use("/assets", express.static(path.join(__dirname, "assets")))


initializeMapData()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`)
    })
  })
  .catch(err => {
    console.error("Error running server", err.message)
  })
