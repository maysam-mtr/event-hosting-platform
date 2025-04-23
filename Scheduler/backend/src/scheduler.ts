import { exec } from 'child_process'
import cron, { ScheduledTask } from 'node-cron'
import path from 'path'
import net from 'net'

interface TaskEntry {
  startTask?: ScheduledTask
  endTask: ScheduledTask
  containerId?: string
  hostPort?: number
}

export const scheduledTasks: Record<string, TaskEntry> = {}

export const scheduleCronJob = (
  eventId: string,
  startTime: Date,
  endTime: Date
): void => {
  const now = new Date()
  const fiveMinutesBefore = new Date(startTime.getTime() - 5 * 60 * 1000)
  const startImmediately = fiveMinutesBefore <= now

  const entry: Partial<TaskEntry> = {}
  scheduledTasks[eventId] = entry as TaskEntry

  if (startImmediately) {
    console.log(`⚡ [${eventId}] Starting immediately at ${now.toISOString()}`)
    startGameEngine(eventId)
  } else {
    const startExpr = [
      fiveMinutesBefore.getMinutes(),
      fiveMinutesBefore.getHours(),
      fiveMinutesBefore.getDate(),
      fiveMinutesBefore.getMonth() + 1,
      '*',
    ].join(' ')
    const startTask = cron.schedule(
      startExpr,
      () => {
        console.log(`🔔 [${eventId}] Starting at ${new Date().toISOString()}`)
        startGameEngine(eventId)
        startTask.stop()
      },
      { scheduled: true, timezone: 'Asia/Beirut' }
    )
    entry.startTask = startTask
  }

  const endExpr = [
    endTime.getMinutes(),
    endTime.getHours(),
    endTime.getDate(),
    endTime.getMonth() + 1,
    '*',
  ].join(' ')
  const endTask = cron.schedule(
    endExpr,
    () => {
      console.log(`🛑 [${eventId}] Stopping at ${new Date().toISOString()}`)
      stopGameEngine(eventId)
      endTask.stop()
    },
    { scheduled: true, timezone: 'Asia/Beirut' }
  )
  entry.endTask = endTask
}

// get a free port
const findFreePort = (): Promise<number> =>
  new Promise((resolve, reject) => {
    const srv = net.createServer()
    srv.listen(0, () => {
      const port = (srv.address() as net.AddressInfo).port
      srv.close(err => err ? reject(err) : resolve(port))
    })
    srv.on('error', reject)
})

const startGameEngine = async (eventId: string): Promise<void> => {
  const entry = scheduledTasks[eventId]
  if (!entry) {
    console.warn(`⚠️ [${eventId}] No TaskEntry found`)
    return
  }

  let hostPort: number
  try {
    hostPort = await findFreePort()
  } catch (err) {
    console.error(`❌ [${eventId}] Error finding free port:`, err)
    return
  }

  const envFilePath = path.resolve(__dirname, 'game-engine-backend.env')
  const cmd = [
    'docker', 'run', '-d',
    '-p', `${hostPort}:3004`,
    '--env', `EVENT_ID=${eventId}`,
    '--env-file', envFilePath,
    'game-engine-backend'
  ].join(' ')

  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ [${eventId}] Docker run error: ${error.message}`)
      return
    }
    if (stderr) {
      console.error(`❌ [${eventId}] Docker stderr: ${stderr}`)
    }

    const containerId = stdout.trim()
    entry.containerId = containerId
    entry.hostPort = hostPort
    console.log(`✅ [${eventId}] Container ${containerId} launched on port ${hostPort}`)
  })
}


function stopGameEngine(eventId: string): void {
  const entry = scheduledTasks[eventId]

  if (!entry) {
    console.warn(`⚠️ [${eventId}] No task entry to stop`)
    return
  }

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

  entry?.startTask?.stop()
  entry.endTask.stop()
  delete scheduledTasks[eventId]
  console.log(`🗑️ [${eventId}] Cron tasks cleaned up.`)
}
