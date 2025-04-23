import { spawn, ChildProcessWithoutNullStreams } from 'child_process'
import cron, { ScheduledTask } from 'node-cron'
import path from 'path'
import kill from 'tree-kill'
import net from 'net'

interface TaskEntry {
  startTask?: ScheduledTask
  endTask: ScheduledTask
  childProcess?: ChildProcessWithoutNullStreams
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

const isPortInUse = (port: number): Promise<boolean> => {
  return new Promise((resolve) => {
    const tester = net.createServer()
      .once('error', () => resolve(true))
      .once('listening', () => {
        tester
          .once('close', () => resolve(false))
          .close()
      })
      .listen(port)
  })
}

const startGameEngine = async (eventId: string): Promise<void> => {
  const backendPath = path.resolve(__dirname, '../../../Game-engine/backend')
  const targetPort = process.env.GAME_ENEGINE_BACKEND_PORT ?? 3004

  const portBusy = await isPortInUse(targetPort as number)
  if (portBusy) {
    console.warn(`⚠️ [${eventId}] Cannot start backend. Port ${targetPort} is already in use.`)
    return
  }

  const backend = spawn('npm', ['run', 'dev'], {
    cwd: backendPath,
    shell: true,
    detached: true,
    env: {
      ...process.env,
      EVENT_ID: eventId,
      PORT: targetPort.toString()
    }
  })
  backend.unref()

  console.log(`[${eventId}] ✅ Spawned BACKEND pid=${backend.pid} on port ${targetPort}`)

  backend.stdout.on('data', (data) =>
    console.log(`[Backend ${eventId}] ${data.toString().trim()}`)
  )
  backend.stderr.on('data', (data) =>
    console.error(`[Backend ${eventId} Error] ${data.toString().trim()}`)
  )

  const entry = scheduledTasks[eventId]
  if (entry) {
    entry.childProcess = backend
  } else {
    console.warn(`⚠️ [${eventId}] No TaskEntry to attach processes`)
  }
}

function stopGameEngine(eventId: string): void {
  const entry = scheduledTasks[eventId]

  const killProc = (
    proc: ChildProcessWithoutNullStreams | undefined,
    label: string
  ) => {
    if (!proc?.pid) {
      console.warn(`⚠️ [${eventId}] No ${label} process to kill`)
      return
    }
    const pid = proc.pid
    console.log(`[${eventId}] Killing ${label} pid=${pid}`)
    kill(pid, 'SIGINT', (err) => {
      if (err) {
        console.error(`❌ [${eventId}] Failed to kill ${label}: ${err.message}`)
      } else {
        console.log(`✅ [${eventId}] ${label} pid=${pid} terminated`)
      }
    })
  }

  killProc(entry?.childProcess, 'Backend')

  entry?.startTask?.stop()
  entry?.endTask.stop()
  delete scheduledTasks[eventId]
  console.log(`🗑️ [${eventId}] Cron tasks cleaned up.`)
}
