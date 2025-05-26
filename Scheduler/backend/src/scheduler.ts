/**
 * Container scheduling and management module
 *
 * This module handles the scheduling of Docker containers for game engines.
 * It uses cron jobs to start containers 5 minutes before events begin and
 * stop them when events end. Each container runs on a dynamically assigned port.
 *
 * Key features:
 * - Automatic port allocation for containers
 * - Timezone-aware scheduling (Asia/Beirut)
 * - Container lifecycle management (start/stop)
 * - Task tracking and cleanup
 */
import { exec } from "child_process"
import cron, { type ScheduledTask } from "node-cron"
import path from "path"
import net from "net"

/**
 * Interface representing a scheduled task entry
 * Tracks both the cron jobs and container information for an event
 */
interface TaskEntry {
  /** Cron task for starting the container (optional if starting immediately) */
  startTask?: ScheduledTask
  /** Cron task for stopping the container */
  endTask: ScheduledTask
  /** Docker container ID once the container is running */
  containerId?: string
  /** Host port number assigned to the container */
  hostPort?: number
}

/**
 * Global registry of all scheduled tasks
 * Maps event IDs to their corresponding task entries
 */
export const scheduledTasks: Record<string, TaskEntry> = {}

/**
 * Schedules cron jobs to start and stop a game engine container
 *
 * Creates cron jobs that will:
 * 1. Start a Docker container 5 minutes before the event start time
 * 2. Stop the container at the event end time
 *
 * If the start time is within 5 minutes, the container starts immediately.
 *
 * @param eventId - Unique identifier for the event
 * @param startTime - When the event should begin
 * @param endTime - When the event should end
 */
export const scheduleCronJob = (eventId: string, startTime: Date, endTime: Date): void => {
  // Get current time in local timezone (UTC+3)
  const now = new Date()
  now.setHours(now.getHours() + 3)

  // Calculate when to start the container (5 minutes before event)
  const fiveMinutesBefore = new Date(startTime.getTime() - 5 * 60 * 1000)
  const startImmediately = fiveMinutesBefore <= now

  // Initialize task entry in the registry
  const entry: Partial<TaskEntry> = {}
  scheduledTasks[eventId] = entry as TaskEntry

  // Handle immediate start or schedule for later
  if (startImmediately) {
    console.log(`⚡ [${eventId}] Starting immediately at ${now.toISOString()}`)
    startGameEngine(eventId)
  } else {
    // Create cron expression for start time (5 minutes before event)
    const startExpr = [
      fiveMinutesBefore.getMinutes(),
      fiveMinutesBefore.getUTCHours(),
      fiveMinutesBefore.getDate(),
      fiveMinutesBefore.getMonth() + 1,
      "*",
    ].join(" ")

    // Schedule container start
    const startTask = cron.schedule(
      startExpr,
      () => {
        console.log(`🔔 [${eventId}] Starting at ${new Date().toISOString()}`)
        startGameEngine(eventId)
        startTask.stop()
      },
      { scheduled: true, timezone: "Asia/Beirut" },
    )
    entry.startTask = startTask
  }

  // Create cron expression for end time
  const endExpr = [endTime.getMinutes(), endTime.getUTCHours(), endTime.getDate(), endTime.getMonth() + 1, "*"].join(
    " ",
  )

  // Schedule container stop
  const endTask = cron.schedule(
    endExpr,
    () => {
      console.log(`🛑 [${eventId}] Stopping at ${new Date().toISOString()}`)
      stopGameEngine(eventId)
      endTask.stop()
    },
    { scheduled: true, timezone: "Asia/Beirut" },
  )
  entry.endTask = endTask
}

/**
 * Finds an available port on the system
 *
 * Creates a temporary server to find an unused port, then closes it
 * and returns the port number for use by Docker containers.
 *
 * @returns Promise resolving to an available port number
 */
const findFreePort = (): Promise<number> =>
  new Promise((resolve, reject) => {
    const srv = net.createServer()
    srv.listen(0, () => {
      const port = (srv.address() as net.AddressInfo).port
      srv.close((err) => (err ? reject(err) : resolve(port)))
    })
    srv.on("error", reject)
  })

/**
 * Starts a Docker container for the game engine
 *
 * Allocates a free port, then launches a Docker container with:
 * - Port mapping from host to container port 3004
 * - Environment variable for the event ID
 * - Environment file for additional configuration
 *
 * Updates the task entry with container ID and port information.
 *
 * @param eventId - Event ID to start the container for
 */
const startGameEngine = async (eventId: string): Promise<void> => {
  const entry = scheduledTasks[eventId]
  if (!entry) {
    console.warn(`⚠️ [${eventId}] No TaskEntry found`)
    return
  }

  // Allocate a free port for the container
  let hostPort: number
  try {
    hostPort = await findFreePort()
  } catch (err) {
    console.error(`❌ [${eventId}] Error finding free port:`, err)
    return
  }

  // Build Docker run command
  const envFilePath = path.resolve(__dirname, "game-engine-backend.env")
  const cmd = [
    "docker",
    "run",
    "-d",
    "-p",
    `${hostPort}:3004`,
    "--env",
    `EVENT_ID=${eventId}`,
    "--env-file",
    envFilePath,
    "game-engine",
  ].join(" ")

  // Execute Docker command
  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ [${eventId}] Docker run error: ${error.message}`)
      return
    }
    if (stderr) {
      console.error(`❌ [${eventId}] Docker stderr: ${stderr}`)
    }

    // Store container information
    const containerId = stdout.trim()
    entry.containerId = containerId
    entry.hostPort = hostPort
    console.log(`✅ [${eventId}] Container ${containerId} launched on port ${hostPort}`)
  })
}

/**
 * Stops a running game engine container and cleans up resources
 *
 * Performs the following cleanup:
 * 1. Stops the Docker container
 * 2. Stops any remaining cron tasks
 * 3. Removes the task entry from the registry
 *
 * @param eventId - Event ID to stop the container for
 */
function stopGameEngine(eventId: string): void {
  const entry = scheduledTasks[eventId]

  if (!entry) {
    console.warn(`⚠️ [${eventId}] No task entry to stop`)
    return
  }

  // Stop the Docker container if it exists
  const containerId = entry.containerId
  if (containerId) {
    console.log(`[${eventId}] Stopping container ${containerId}`)
    exec(`docker stop ${containerId}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ [${eventId}] Failed to stop container: ${error.message}`)
      } else {
        console.log(`✅ [${eventId}] Container ${containerId} stopped`)
      }
    })
  } else {
    console.warn(`⚠️ [${eventId}] No container ID found to stop`)
  }

  // Clean up cron tasks and registry entry
  entry?.startTask?.stop()
  entry.endTask.stop()
  delete scheduledTasks[eventId]
  console.log(`🗑️ [${eventId}] Cron tasks cleaned up.`)
}
