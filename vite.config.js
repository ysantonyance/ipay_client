import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import net from 'node:net'

const BACKEND_HTTP_PORT = 5278
const BACKEND_URLS = 'https://localhost:7137;http://localhost:5278'

function isPortInUse(port) {
  return new Promise((resolve) => {
    const socket = net.connect({ port, host: '127.0.0.1' })
    socket.once('connect', () => { socket.destroy(); resolve(true) })
    socket.once('error', () => resolve(false))
  })
}

function prefixLines(stream, prefix) {
  let buffer = ''
  stream.on('data', (chunk) => {
    buffer += chunk.toString()
    const lines = buffer.split(/\r?\n/)
    buffer = lines.pop() ?? ''
    lines.forEach((line) => line.trim() && console.log(`${prefix} ${line}`))
  })
}

// Starts the ASP.NET backend together with `npm run dev` and stops it again when
// the dev server stops. Dev-only: it never runs for `npm run build`.
//
// Set IPAY_BACKEND_PATH in .env.local (gitignored) to the folder that contains
// ExamTest.WebApi.csproj. Set START_BACKEND=false to turn this off.
function startBackend(env) {
  return {
    name: 'ipay-start-backend',
    apply: 'serve',
    async configureServer(server) {
      const log = (msg) => server.config.logger.info(`  [backend] ${msg}`)

      if (env.START_BACKEND === 'false') return

      const backendPath = env.IPAY_BACKEND_PATH
      if (!backendPath) {
        log('IPAY_BACKEND_PATH is not set (see .env.example) - not starting the backend.')
        return
      }
      if (!existsSync(backendPath)) {
        log(`Folder not found: ${backendPath} - not starting the backend.`)
        return
      }
      if (await isPortInUse(BACKEND_HTTP_PORT)) {
        log(`Something is already listening on port ${BACKEND_HTTP_PORT} - assuming the backend is running.`)
        return
      }

      log('Starting ASP.NET backend (first start may take a while to build)...')

      // --no-launch-profile: don't open a Swagger browser tab on every start.
      const child = spawn(
        'dotnet',
        ['run', '--no-launch-profile', '--urls', BACKEND_URLS],
        {
          cwd: backendPath,
          env: { ...process.env, ASPNETCORE_ENVIRONMENT: 'Development' },
          stdio: ['ignore', 'pipe', 'pipe'],
        }
      )

      prefixLines(child.stdout, '[backend]')
      prefixLines(child.stderr, '[backend]')

      child.on('error', (err) => {
        log(`Could not start "dotnet": ${err.message}. Is the .NET SDK installed and on PATH?`)
      })
      child.on('exit', (code) => {
        if (code) log(`Backend exited with code ${code}.`)
      })

      let stopped = false
      const stop = () => {
        if (stopped || child.exitCode !== null) return
        stopped = true
        if (process.platform === 'win32') {
          // child.kill() would only stop the "dotnet run" wrapper, not the app it launched.
          spawn('taskkill', ['/pid', String(child.pid), '/T', '/F'], { stdio: 'ignore' })
        } else {
          child.kill('SIGTERM')
        }
      }

      server.httpServer?.on('close', stop)
      process.on('exit', stop)
      process.on('SIGINT', () => { stop(); process.exit(0) })
      process.on('SIGTERM', () => { stop(); process.exit(0) })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      tailwindcss(),
      startBackend(env),
    ],
    server: {
      proxy: {
        // Forward /api/* to the ASP.NET backend (launchSettings "https" profile).
        // Going through the proxy avoids CORS and the HTTPS-redirect problem in dev.
        // secure: false accepts the self-signed dev certificate.
        '/api': {
          target: 'https://localhost:7137',
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
})
