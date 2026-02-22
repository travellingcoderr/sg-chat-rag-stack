import { Router, Request, Response } from 'express'
import { chatService } from '../services/chat.service.js'

const router = Router()

router.post('/message', async (req: Request, res: Response) => {
  const { message, conversationId } = req.body as { message?: string; conversationId?: string }
  if (!message || typeof message !== 'string') {
    res.status(400).json({ error: 'message is required' })
    return
  }
  try {
    const result = await chatService.sendMessage({ message, conversationId })
    res.json(result)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err instanceof Error ? err.message : 'Internal server error' })
  }
})

router.post('/message/stream', async (req: Request, res: Response) => {
  const { message, conversationId } = req.body as { message?: string; conversationId?: string }
  if (!message || typeof message !== 'string') {
    res.status(400).json({ error: 'message is required' })
    return
  }
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.flushHeaders()
  try {
    for await (const event of chatService.streamMessage({ message, conversationId })) {
      res.write(`data: ${JSON.stringify(event)}\n\n`)
    }
  } catch (err) {
    console.error(err)
    res.write(
      `data: ${JSON.stringify({ type: 'error', data: (err as Error).message })}\n\n`
    )
  } finally {
    res.end()
  }
})

export const chatRoutes = router
