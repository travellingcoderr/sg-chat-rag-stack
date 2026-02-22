import type { UserContext, ChatContext } from './state.js'

const BASE = `You are a helpful AI assistant. You have access to a knowledge base via the search_knowledge tool.
Use search_knowledge when the user asks about documents or facts. Synthesize answers from the returned chunks.
Be concise and accurate. If you don't know, say so.`

export function buildSystemPrompt(_user: UserContext, _chat: ChatContext): string {
  return BASE
}
