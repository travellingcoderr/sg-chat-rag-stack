import { invokeMaxAgent, streamMaxAgent } from '../agent/graph.js'
import type { UserContext, ChatContext, TokenUser } from '../agent/state.js'
import type { ChatMessageResponse } from '../types/chat.js'

const userContext: UserContext = {
  userId: 'anonymous',
  name: 'User',
  email: 'user@example.com',
  userType: 'internal',
}

const chatContext: ChatContext = {
  pageType: 'unknown',
}

const tokenUser: TokenUser = { id: 'anonymous', personaId: '0' }

export const chatService = {
  async sendMessage(params: {
    message: string
    conversationId?: string
    userId?: string
  }): Promise<ChatMessageResponse> {
    const result = await invokeMaxAgent(
      params.message,
      userContext,
      chatContext,
      tokenUser,
      params.conversationId,
      []
    )
    return {
      response: result.response,
      toolsUsed: result.toolsUsed,
      executionTime: result.executionTime,
      conversationId: params.conversationId,
    }
  },

  async *streamMessage(params: {
    message: string
    conversationId?: string
    userId?: string
  }): AsyncGenerator<{ type: 'token' | 'done'; data: unknown }> {
    yield* streamMaxAgent(
      params.message,
      userContext,
      chatContext,
      tokenUser,
      params.conversationId,
      []
    )
  },
}
