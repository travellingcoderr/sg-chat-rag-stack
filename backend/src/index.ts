import express from 'express'
import { config } from './config/index.js'
import { chatRoutes } from './routes/chat.routes.js'
import { knowledgeService } from './services/knowledge.service.js'

const app = express()
app.use(express.json())

const corsOrigin = config.corsOrigin ?? 'http://localhost:3000'
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', corsOrigin)
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.sendStatus(204)
  next()
})

app.use('/api/chat', chatRoutes)
app.get('/health', (_req, res) => res.json({ status: 'ok' }))

knowledgeService.seedDemo().catch(() => {})

app.listen(config.port, () => {
  console.log(`Backend at http://localhost:${config.port}`)
})
