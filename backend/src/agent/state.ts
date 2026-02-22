import { Annotation, messagesStateReducer } from '@langchain/langgraph'
import type { BaseMessage } from '@langchain/core/messages'

export interface UserContext {
  userId: string
  name: string
  email: string
  userType: 'internal' | 'external' | 'admin'
}

export interface ChatContext {
  pageType: string
}

export interface TokenUser {
  id: string
  personaId: string
}

export const AgentState = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: messagesStateReducer,
    default: () => [],
  }),
  userContext: Annotation<UserContext | null>({
    reducer: (_, next) => next,
    default: () => null,
  }),
  chatContext: Annotation<ChatContext | null>({
    reducer: (_, next) => next,
    default: () => null,
  }),
  tokenUser: Annotation<TokenUser | null>({
    reducer: (_, next) => next,
    default: () => null,
  }),
  conversationId: Annotation<string | null>({
    reducer: (_, next) => next,
    default: () => null,
  }),
})

export type AgentStateType = typeof AgentState.State
