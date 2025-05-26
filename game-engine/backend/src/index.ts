/**
 * Game Engine Server
 *
 * This is the main server file that handles:
 * - Express HTTP server setup with CORS configuration
 * - Socket.IO real-time communication for multiplayer functionality
 * - Player movement tracking and broadcasting
 * - Booth interaction detection (enter/exit events)
 * - Meeting room URL generation for booth interactions
 * - Static asset serving for game resources
 *
 * The server manages real-time player positions, booth interactions, and provides
 * meeting links for virtual booth experiences using Jitsi integration.
 */

import express from "express"
import cors from "cors"
import { createServer } from "node:http"
import { Server as SocketIOServer } from "socket.io"
import path from "path"
import fs from "fs/promises"

import { getBoothIdForPartner, initializeMapData } from "./initialization"
import dotenv from "dotenv"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3004

// Configure CORS to allow connections from frontend applications
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3333"],
    credentials: true,
  }),
)

// Serve static game assets (images, maps, partner logos)
app.use("/assets", express.static(path.join(__dirname, "assets")))

// Health check endpoint
app.get("/", (req, res) => {
  res.send("Virtual Event Platform - Game Engine")
})

/**
 * API endpoint to retrieve map information and partner data
 * Returns both map tileset images and partner information for game initialization
 */
app.use("/getMapInformation", async (req, res) => {
  try {
    const mapFilePath = path.join(__dirname, "mapInfo.json")
    const mapInfo = await fs.readFile(mapFilePath, "utf-8")
    const mapData = JSON.parse(mapInfo)

    const partnersFilePath = path.join(__dirname, "partners.json")
    const partnersInfo = await fs.readFile(partnersFilePath, "utf-8")
    const partnersData = JSON.parse(partnersInfo)

    res.status(200).json({ mapImages: mapData, partners: partnersData })
  } catch (err) {
    console.error("Failed to load tileset images:", err)
    res.status(500).json({ error: "Failed to read layer names" })
  }
})

/**
 * Generate meeting room URLs for booth interactions
 * Creates Jitsi meeting links using Cloudflare Tunnel domain
 */
app.get("/getMeetingLink/:boothId", (req, res) => {
  const { boothId } = req.params
  const jitsiDomain = "descriptions-sas-kathy-sunday.trycloudflare.com";
  const roomName = `booth_${boothId}`
  const meetingUrl = `https://${jitsiDomain}/${roomName}`

  res.json({ meetingUrl })
})

// Create HTTP server and Socket.IO instance for real-time communication
const httpServer = createServer(app)
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: ["http://localhost:5173"],
    credentials: true,
  },
})

// Track active users and booth data
const userIdToSocketId: Record<string, string> = {} // Maps user IDs to socket IDs
let booths: { id: string; x: number; y: number; width: number; height: number }[] = []

/**
 * Collision detection utility
 * Checks if two rectangular areas overlap (used for booth interaction detection)
 */
const rectsOverlap = (
  r1: { x: number; y: number; width: number; height: number },
  r2: { x: number; y: number; width: number; height: number },
) => {
  return !(r1.x > r2.x + r2.width || r2.x > r1.x + r1.width || r1.y > r2.y + r2.height || r2.y > r1.y + r1.height)
}

/**
 * Load booth configuration data from JSON file
 * Booth data includes position and dimensions for collision detection
 */
const loadBoothsFromMap = async () => {
  const boothsJsonPath = path.join(__dirname, "assets", "booths.json")
  try {
    const boothsRaw = await fs.readFile(boothsJsonPath, "utf-8")
    const boothsData = JSON.parse(boothsRaw).booths
    booths = boothsData
    console.log("Booths data loaded:", boothsData)
    console.log("✅ Booths loaded into server memory")
  } catch (err) {
    if (err instanceof Error) {
      console.error("❌ Failed to load booths:", err.message)
    } else {
      console.error("❌ Failed to load booths:", err)
    }
  }
}

// Socket.IO connection handling for real-time multiplayer functionality
io.on("connection", (socket) => {
  console.log("User connected:", socket.id)

  /**
   * Handle player joining the game
   * Validates user data, manages duplicate connections, and broadcasts join event
   */
  socket.on("joinGame", async (userData) => {
    const { id, name, avatar, partnerId } = userData

    if (!id || !name || !avatar) {
      return socket.emit("authError", { message: "Missing required fields" })
    }

    // Store user data in socket session
    socket.data.userId = id
    socket.data.name = name
    socket.data.avatar = avatar
    socket.data.isPartner = false
    socket.data.currentBooth = null

    // Check if user is a partner and assign booth ownership
    if (partnerId) {
      try {
        const boothId = await getBoothIdForPartner(partnerId)
        if (boothId) {
          socket.data.isPartner = true
          socket.data.boothId = boothId
        }
      } catch (err) {
        console.log(err)
      }
    }

    // Handle duplicate connections by disconnecting previous session
    if (userIdToSocketId[id]) {
      const oldSocketId = userIdToSocketId[id]
      const oldSocket = io.sockets.sockets.get(oldSocketId)
      oldSocket?.emit("userKicked")
      oldSocket?.disconnect(true)
    }

    // Update user mapping and broadcast join event
    userIdToSocketId[id] = socket.id

    socket.broadcast.emit("playerMoved", {
      userId: id,
      name,
      avatar,
      x: userData.x || Math.random() * 400,
      y: userData.y || Math.random() * 400,
    })

    console.log(`User ${name} [${id}] joined`)
  })

  /**
   * Handle player movement and booth interaction detection
   * Tracks player position, detects booth entry/exit, and broadcasts movement
   */
  socket.on("playerMove", (data) => {
    const userId = socket.data.userId
    const name = socket.data.name
    const avatar = socket.data.avatar
    const prevBooth = socket.data.currentBooth
    const isPartner = socket.data.isPartner

    if (!userId || !name || !avatar) return

    const payload = {
      userId,
      name,
      avatar,
      x: data.x,
      y: data.y,
    }

    // Broadcast movement to all connected clients
    io.emit("playerMoved", payload)

    // Define player collision bounds for booth interaction
    const playerBounds = {
      x: data.x - 16,
      y: data.y - 16,
      width: 32,
      height: 32,
    }

    let newBooth = null

    // Check collision with all booths
    for (const booth of booths) {
      const boothBounds = {
        x: booth.x,
        y: booth.y,
        width: booth.width,
        height: booth.height,
      }

      const overlap = rectsOverlap(playerBounds, boothBounds)

      // Handle booth entry
      if (overlap && prevBooth !== booth.id) {
        socket.data.currentBooth = booth.id
        socket.emit("enteredBooth", {
          userId,
          boothId: booth.id,
          isPartner: socket.data.isPartner,
          meetingUrl: `https://descriptions-sas-kathy-sunday.trycloudflare.com/booth_${booth.id}?toolbar=false&join=true&prejoin=false&displayName=Player&micEnabled=true&videoEnabled=true`,
        })
        io.emit("userEnteredBooth", {
          userId,
          boothId: booth.id,
        })
      }

      if (!newBooth && overlap) {
        newBooth = booth.id
      }
    }

    // Handle booth exit
    if (prevBooth && !newBooth) {
      socket.data.currentBooth = null
      socket.emit("exitedBooth", {
        userId,
        boothId: prevBooth,
      })
      io.emit("userExitedBooth", {
        userId,
        boothId: prevBooth,
      })
      console.log(`User ${userId} exited booth ${prevBooth}`)
    }
  })

  /**
   * Handle player disconnection
   * Cleans up user data and broadcasts disconnection event
   */
  socket.on("disconnect", () => {
    const userId = socket.data.userId
    if (userId && userIdToSocketId[userId] === socket.id) {
      delete userIdToSocketId[userId]
      io.emit("playerDisconnected", userId)
      console.log(`User ${userId} disconnected`)
    }
  })
})

// Initialize server with map data and booth configuration
initializeMapData()
  .then(async () => {
    await loadBoothsFromMap()
    httpServer.listen(PORT, () => {
      console.log(`🎮 Game engine running at http://host.docker.internal:${PORT}`)
    })
  })
  .catch((err) => {
    console.error("❌ Failed to start server:", err.message)
    process.exit(1)
  })
