/**import express from "express"
import http from "http"
import cors from "cors"
import { createServer } from "node:http"
import { Server as SocketIOServer } from "socket.io"
import path from "path"
import fs from "fs/promises"

// Import your initialization logic
import { initializeMapData } from "./initialization"
import dotenv from "dotenv"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3004

// Serve static assets
app.use("/assets", express.static(path.join(__dirname, "assets")))

// CORS middleware
app.use(
  cors({
    origin: ["http://localhost:5000", "http://localhost:5173"],
    credentials: true,
  })
)

// Routes
app.get("/", (req, res) => {
  res.send("Virtual Event Platform - Game Engine")
})

app.get("/getTilesetImages", async (req, res) => {
  try {
    const filePath = path.join(__dirname, "mapInfo.json")
    const fileContent = await fs.readFile(filePath, "utf8")
    const data = JSON.parse(fileContent)

    res.status(200).json({ data })
  } catch (err) {
    console.error("Failed to load tileset images:", err)
    res.status(500).json({ error: "Failed to read layer names" })
  }
})

// Create HTTP server and Socket.IO
const httpServer = createServer(app)
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: ["http://localhost:5000", "http://localhost:5173"],
    credentials: true,
  },
})
const connectedUsers: Record<string, string> = {} // userId -> socket.id
// Socket connection handler
io.on("connection", (socket) => {
  console.log("User connected:", socket.id)
   for(const keys in connectedUsers) {
    if(keys === socket.id) {
      socket.emit("playerConnected", { userId: keys, socketId: connectedUsers[keys] })
    }}
  socket.on("playerMove", (data) => {
    const { userId, name, x, y } = data

    // Store the userId to socket.id mapping (if needed later)
    connectedUsers[userId] = socket.id

    // Broadcast to everyone else
    socket.broadcast.emit('playerMoved', { userId, name, x, y })
  })

  socket.on("disconnect", () => {
    const disconnectedUserId = Object.keys(connectedUsers).find(userId => connectedUsers[userId] === socket.id)
    if (!disconnectedUserId) return // User not found
    console.log("User disconnected:", socket.id)
    delete connectedUsers[disconnectedUserId]
    socket.broadcast.emit('playerDisconnected', disconnectedUserId)
    console.log(`❌ User disconnected: ${disconnectedUserId}`)
    //io.emit("playerDisconnected", socket.id)
  })
})

// Start server after map data loaded
initializeMapData()
  .then(() => {
    httpServer.listen(PORT, () => {
      console.log(`🎮 Game engine running at http://localhost:${PORT}`)
    })
  })
  .catch((err) => {
    console.error("❌ Failed to start game engine:", err.message)
    process.exit(1)
  })
*/

import express from "express"
import http from "http"
import cors from "cors"
import { createServer } from "node:http"
import { Server as SocketIOServer, Socket } from "socket.io"
import path from "path"
import fs from "fs/promises"

// Initialization logic
import { getBoothIdForPartner, initializeMapData } from "./initialization"
import dotenv from "dotenv"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3004

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5000", "http://localhost:5173", "http://localhost:3333"],
    credentials: true,
  })
)

// Static assets
app.use("/assets", express.static(path.join(__dirname, "assets")))

// Routes
app.get("/", (req, res) => {
  res.send("Virtual Event Platform - Game Engine")
})

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


// Add this route
app.get("/getMeetingLink/:boothId", (req, res) => {
  const { boothId } = req.params;

  // Your Cloudflare Tunnel domain
  const jitsiDomain = "fatty-theory-classics-jackets.trycloudflare.com";

  // Room name format: booth_123
  const roomName = `booth_${boothId}`;

  // Full URL to Jitsi meeting
  const meetingUrl = `https://${jitsiDomain}/${roomName}`;

  // Optional: Add JWT token if using authentication
  // const jwtToken = generateJWT({ userId: "guest_" + uuidv4(), role: "guest" });
  // const meetingUrl = `https://${jitsiDomain}/${roomName}?jwt=${jwtToken}`;

  res.json({ meetingUrl });
});


// Create HTTP + Socket.IO server
const httpServer = createServer(app)
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: ["http://localhost:5000", "http://localhost:5173"],
    credentials: true,
  }
})

// Track active users
const userIdToSocketId: Record<string, string> = {} // userId -> socket.id
let booths: { id: string; x: number; y: number; width: number; height: number }[] = []

// Helper: Check if two rectangles overlap
const rectsOverlap = (r1: { x: number, y: number, width: number, height: number }, r2: { x: number, y: number, width: number, height: number }) => {
  return !(
    r1.x > r2.x + r2.width ||
    r2.x > r1.x + r1.width ||
    r1.y > r2.y + r2.height ||
    r2.y > r1.y + r1.height
  )
}
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
io.on("connection", (socket) => {
  console.log("User connected:", socket.id)

  socket.on("joinGame", async (userData) => {
    const { id, name, avatar,partnerId } = userData
    

    if (!id || !name || !avatar) {
      return socket.emit("authError", { message: "Missing required fields" })
    }

    // Save user data in socket.data
    socket.data.userId = id
    socket.data.name = name
    socket.data.avatar = avatar
    socket.data.isPartner = false; // Default to guest
    socket.data.currentBooth = null
    if(partnerId){
      try{
      const boothId = await getBoothIdForPartner(partnerId);
      if( boothId ){
      socket.data.isPartner=true;
      socket.data.boothId= boothId;
      }
      }catch(err){
        console.log(err)
      }
    }
    // If same user already connected → disconnect old socket
    if (userIdToSocketId[id]) {
      const oldSocketId = userIdToSocketId[id]
      const oldSocket = io.sockets.sockets.get(oldSocketId)
      oldSocket?.emit("userKicked")
      oldSocket?.disconnect(true)
    }

    // Update mapping
    userIdToSocketId[id] = socket.id
socket.data.userId = id
socket.data.name = name
socket.data.avatar = avatar
    // Broadcast join with full data
    socket.broadcast.emit("playerMoved", {
      userId: id,
      name,
      avatar,
      x: userData.x || Math.random() * 400,
      y: userData.y || Math.random() * 400
    })

    console.log(`User ${name} [${id}] joined`)
  })
/*
  socket.on("playerMove", (data) => {
    const userId = socket.data.userId
    const name = socket.data.name
    const avatar = socket.data.avatar
    const prevBooth = socket.data.currentBooth || null

    if (!userId || !name || !avatar) return
  
    const payload = {
      userId,
      name,
      avatar,
      x: data.x,
      y: data.y
    }
  
    
    // Define player bounds (e.g., 32x32 area around player)
    const playerBounds = {
      x: data.x - 16,
      y: data.y - 16,
      width: 32,
      height: 32
    }
    let newBooth = null
   // Check if player overlaps any booth
    booths.forEach(booth => {
      const boothBounds = {
        x: booth.x,
        y: booth.y,
        width: booth.width,
        height: booth.height
      }
   if (rectsOverlap(playerBounds, boothBounds)&& prevBooth! == booth.id) {
        socket.data.currentBooth = booth.id
      
        socket.emit("enteredBooth", {
          userId,
          boothId: booth.id
        })
  
        io.emit("userEnteredBooth", {
          userId,
          boothId: booth.id
        })
      }
      else if(!rectsOverlap(playerBounds, boothBounds)&& prevBooth===booth.id){
        console.log(`User ${userId} exited booth ${booth.id}`)
        socket.emit("exitedBooth", { userId, boothId: booth.id })
        socket.data.currentBooth = null
      }
    })
    if (!entered && prevBooth) {
      console.log(`User ${userId} exited previous booth ${prevBooth.id}`)
      socket.emit("exitedBooth", { userId, boothId: prevBooth })
      io.emit("userExitedBooth", { userId, boothId: prevBooth })
  
      socket.data.currentBooth = null
    }

    io.emit("playerMoved", payload)
  
  })*/
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
    y: data.y
  }

  io.emit("playerMoved", payload)

  const playerBounds = {
    x: data.x - 16,
    y: data.y - 16,
    width: 32,
    height: 32
  }

  let newBooth = null

  for (const booth of booths) {
    const boothBounds = {
      x: booth.x,
      y: booth.y,
      width: booth.width,
      height: booth.height
    }

    const overlap = rectsOverlap(playerBounds, boothBounds)

    if (overlap && prevBooth !== booth.id) {
      // Entered a new booth
      socket.data.currentBooth = booth.id
      socket.emit("enteredBooth", {
        userId,
        boothId: booth.id,
        isPartner:socket.data.isPartner,
        meetingUrl:` https://fatty-theory-classics-jackets.trycloudflare.com/booth_${booth.id}?toolbar=false&join=true&prejoin=false&displayName=Player&micEnabled=true&videoEnabled=true`
   
      })
      io.emit("userEnteredBooth", {
        userId,
        boothId: booth.id
      })
    }

    if (!newBooth && overlap) {
      newBooth = booth.id // currently in this booth
    }
  }

  // Check if exited from previous booth
  if (prevBooth && !newBooth) {
    socket.data.currentBooth = null
    socket.emit("exitedBooth", {
      userId,
      boothId: prevBooth
    })
    io.emit("userExitedBooth", {
      userId,
      boothId: prevBooth
    })
    console.log(`User ${userId} exited booth ${prevBooth}`)
  }
})



  socket.on("disconnect", () => {
    const userId = socket.data.userId
    if (userId && userIdToSocketId[userId] === socket.id) {
      delete userIdToSocketId[userId]
      io.emit("playerDisconnected", userId)
      console.log(`User ${userId} disconnected`)
    }
  })
})

initializeMapData()
  .then(async () => {
    await loadBoothsFromMap()
    httpServer.listen(PORT, () => {
      console.log(`🎮 Game engine running at http://localhost:${PORT}`)
    })
  })
  .catch((err) => {
    console.error("❌ Failed to start server:", err.message)
    process.exit(1)
  })