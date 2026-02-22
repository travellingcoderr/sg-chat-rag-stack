import express from 'express'
import type { Router } from 'express'

const PORT = Number(process.env.PORT) || 8000
const corsOrigin = process.env.CORS_ORIGIN ?? 'http://localhost:3000'

const app = express()
app.use(express.json())
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', corsOrigin)
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.sendStatus(204)
  next()
})

app.get('/health', (_req, res) => res.json({ status: 'ok' }))

// Chat API: lazy-loaded on first /api/chat request so startup stays fast.
let chatRouter: Router | null = null
const chatReady = (async () => {
  const { chatRoutes } = await import('./routes/chat.routes.js')
  chatRouter = chatRoutes
  const { knowledgeService } = await import('./services/knowledge.service.js')
  knowledgeService.seedDemo().catch((err) => {
    console.warn('Seed demo failed (non-fatal):', err?.message ?? err)
  })
})()
app.use('/api/chat', (req, res, next) => {
  if (chatRouter) return chatRouter(req, res, next)
  chatReady.then(() => chatRouter!(req, res, next)).catch(next)
})

app.listen(PORT, () => {
  process.stderr.write(`Backend at http://localhost:${PORT}\n`)
}).on('error', (err) => {
  console.error('Server error:', err)
})
