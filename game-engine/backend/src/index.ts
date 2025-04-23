import express, { Express, Request, Response } from "express"
import dotenv from "dotenv"
import path from "path"
import fs from "fs/promises"
import cors from "cors"
import { initializeMapData } from "./initialization"

// loading the env file
dotenv.config()

const PORT = process.env.PORT || 3004

const app: Express = express()

// Enable CORS
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3333"],
    credentials: true,
  })
)

app.use("/assets", express.static(path.join(__dirname, "assets")))


app.use("/getMapInformation", async (req: Request, res: Response) => {
  try {
    const mapFilePath = path.join(__dirname, "mapInfo.json")
    const mapInfo = await fs.readFile(mapFilePath, "utf-8")
    const mapData = JSON.parse(mapInfo)
    
    const partnersFilePath = path.join(__dirname, "partners.json")
    const partnersInfo = await fs.readFile(partnersFilePath, "utf-8")
    const partnersData = JSON.parse(partnersInfo)
    
    
    res.status(200).json({ mapImages: mapData, partners: partnersData })
  } catch (err) {
    res.status(500).json({ error: "Failed to read layer names" })
  }
})

initializeMapData()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running at http://host.docker.internal:${PORT}`)
    })
  })
  .catch(err => {
    console.error("Error running server", err.message)
  })
