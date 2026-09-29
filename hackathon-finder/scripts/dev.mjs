import { spawn } from "node:child_process"
import process from "node:process"

const processes = [
  spawn("python3", ["backend/server.py"], { stdio: "inherit", env: process.env }),
  spawn(process.execPath, ["node_modules/vite/bin/vite.js"], { stdio: "inherit", env: process.env }),
]

let shuttingDown = false

function shutdown(code = 0) {
  if (shuttingDown) return
  shuttingDown = true
  for (const child of processes) child.kill("SIGTERM")
  setTimeout(() => process.exit(code), 250)
}

for (const child of processes) {
  child.on("error", (error) => {
    console.error(`[dev] failed to start process: ${error.message}`)
    shutdown(1)
  })
  child.on("exit", (code, signal) => {
    if (!shuttingDown && code !== 0) {
      console.error(`[dev] process exited with code ${code ?? signal}`)
      shutdown(code ?? 1)
    }
  })
}

process.on("SIGINT", () => shutdown())
process.on("SIGTERM", () => shutdown())
process.on("exit", () => {
  for (const child of processes) child.kill("SIGTERM")
})

console.log("[dev] Vite and the live hackathon collector are running")
console.log("[dev] Collector health: http://localhost:8787/health")
