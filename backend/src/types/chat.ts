export interface MessageRecord {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp?: Date
  metadata?: { toolResults?: StoredToolResult[]; [key: string]: unknown }
}

export interface StoredToolResult {
  toolCallId: string
  toolName: string
  args: Record<string, unknown>
  result: string
}

export interface UserContext {
  userId: string
  name: string
  email: string
  userType: 'internal' | 'external' | 'admin'
}

export interface ChatContext {
  pageType: string
}

export interface ChatMessageRequest {
  message: string
  conversationId?: string
}

export interface ChatMessageResponse {
  response: string
  toolsUsed: string[]
  executionTime: number
  conversationId?: string
}
