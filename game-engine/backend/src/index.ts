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
    origin: ["http://localhost:5000", "http://localhost:5173", "http://localhost:3333"],
    credentials: true,
  })
)

app.use("/assets", express.static(path.join(__dirname, "assets")))


app.use("/getTilesetImages", async (req: Request, res: Response) => {
  try {
    const filePath = path.join(__dirname, "mapInfo.json")
    const fileContent = await fs.readFile(filePath, "utf-8")
    const data = JSON.parse(fileContent)
    
    
    res.status(200).json({ data })
  } catch (err) {
    res.status(500).json({ error: "Failed to read layer names" })
  }
})

initializeMapData()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`)
    })
  })
  .catch(err => {
    console.error("Error running server", err.message)
  })
