import { StateGraph, END, START, MemorySaver } from '@langchain/langgraph'
import { ChatOpenAI } from '@langchain/openai'
import { ToolMessage } from '@langchain/core/messages'
import { AIMessage, HumanMessage, SystemMessage, type BaseMessage } from '@langchain/core/messages'
import { config } from '../config/index.js'
import {
  AgentState,
  type AgentStateType,
  type UserContext,
  type ChatContext,
  type TokenUser,
} from './state.js'
import { getToolDefinitions, getFilteredTools } from './tools/index.js'
import { buildSystemPrompt } from './prompts.js'

function createApp() {
  const workflow = new StateGraph(AgentState)
    .addNode('agent', agentNode)
    .addNode('tools', toolsNode)
    .addEdge(START, 'agent')
    .addConditionalEdges('agent', shouldContinue, { continue: 'tools', end: END })
    .addEdge('tools', 'agent')
  const checkpointer = new MemorySaver()
  return workflow.compile({ checkpointer })
}

async function agentNode(state: AgentStateType): Promise<Partial<AgentStateType>> {
  const toolDefs = getToolDefinitions()
  const model = new ChatOpenAI({
    openAIApiKey: config.openai.apiKey,
    modelName: config.openai.chatModel,
    temperature: 0.2,
    maxTokens: 4096,
  }).bindTools(toolDefs)

  const messages: BaseMessage[] = []
  if (state.messages.length === 0 || state.messages[0].getType() !== 'system') {
    if (state.userContext && state.chatContext) {
      messages.push(new SystemMessage(buildSystemPrompt(state.userContext, state.chatContext)))
    }
  }
  messages.push(...state.messages)
  const response = await model.invoke(messages)
  return { messages: [response] }
}

async function toolsNode(state: AgentStateType): Promise<Partial<AgentStateType>> {
  const lastMessage = state.messages[state.messages.length - 1]
  if (lastMessage.getType() !== 'ai') return { messages: [] }
  const aiMsg = lastMessage as AIMessage
  const toolCalls = aiMsg.tool_calls
  if (!toolCalls?.length) return { messages: [] }

  const tools = getFilteredTools()
  const toolMap = new Map(tools.map(t => [t.name, t]))
  const toolResults: ToolMessage[] = []

  for (const tc of toolCalls) {
    const tool = toolMap.get(tc.name)
    if (!tool) {
      toolResults.push(
        new ToolMessage({
          tool_call_id: tc.id ?? '',
          content: `Unknown tool: ${tc.name}`,
          name: tc.name,
        })
      )
      continue
    }
    try {
      const result = await tool.invoke(tc.args ?? {})
      toolResults.push(
        new ToolMessage({
          tool_call_id: tc.id ?? '',
          content: typeof result === 'string' ? result : JSON.stringify(result),
          name: tc.name,
        })
      )
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      toolResults.push(
        new ToolMessage({ tool_call_id: tc.id ?? '', content: `Error: ${msg}`, name: tc.name })
      )
    }
  }
  return { messages: toolResults }
}

function shouldContinue(state: AgentStateType): 'continue' | 'end' {
  const last = state.messages[state.messages.length - 1]
  if (last?.getType() === 'ai' && (last as AIMessage).tool_calls?.length) return 'continue'
  return 'end'
}

function extractToolsUsed(messages: BaseMessage[]): string[] {
  const set = new Set<string>()
  for (const msg of messages) {
    if (msg.getType() === 'ai') {
      const ai = msg as AIMessage
      for (const tc of ai.tool_calls ?? []) set.add(tc.name)
    }
  }
  return Array.from(set)
}

export async function invokeMaxAgent(
  message: string,
  userContext: UserContext,
  chatContext: ChatContext,
  tokenUser: TokenUser,
  conversationId?: string,
  conversationHistory?: Array<{ role: string; content: string }>
): Promise<{
  response: string
  toolsUsed: string[]
  executionTime: number
  messages: BaseMessage[]
}> {
  const app = createApp()
  const historyMessages: BaseMessage[] = (conversationHistory ?? []).map(m =>
    m.role === 'user' ? new HumanMessage(m.content) : new AIMessage(m.content)
  )
  const allMessages = [...historyMessages, new HumanMessage(message)]

  const initialState: AgentStateType = {
    messages: allMessages,
    userContext,
    chatContext,
    tokenUser,
    conversationId: conversationId ?? `conv_${Date.now()}`,
  }

  const start = Date.now()
  const result = await app.invoke(initialState, {
    configurable: { thread_id: initialState.conversationId },
  })
  const executionTime = Date.now() - start

  const lastMessage = result.messages[result.messages.length - 1]
  const response =
    lastMessage.getType() === 'ai' ? (lastMessage as AIMessage).content : String(lastMessage)

  return {
    response: typeof response === 'string' ? response : JSON.stringify(response),
    toolsUsed: extractToolsUsed(result.messages),
    executionTime,
    messages: result.messages,
  }
}

export async function* streamMaxAgent(
  message: string,
  userContext: UserContext,
  chatContext: ChatContext,
  tokenUser: TokenUser,
  conversationId?: string,
  conversationHistory?: Array<{ role: string; content: string }>
): AsyncGenerator<{ type: 'token' | 'done'; data: unknown }> {
  const app = createApp()
  const historyMessages: BaseMessage[] = (conversationHistory ?? []).map(m =>
    m.role === 'user' ? new HumanMessage(m.content) : new AIMessage(m.content)
  )
  const allMessages = [...historyMessages, new HumanMessage(message)]

  const initialState: AgentStateType = {
    messages: allMessages,
    userContext,
    chatContext,
    tokenUser,
    conversationId: conversationId ?? `conv_${Date.now()}`,
  }

  const stream = await app.stream(initialState, {
    configurable: { thread_id: initialState.conversationId },
    streamMode: ['messages', 'updates'],
  })

  for await (const event of stream) {
    if (Array.isArray(event) && event.length === 2 && event[0] === 'messages') {
      const [, messageData] = event as [string, [unknown, { langgraph_node?: string }]]
      const [chunk, meta] = messageData as [unknown, { langgraph_node?: string }]
      const content =
        (chunk as { kwargs?: { content?: string }; content?: string })?.kwargs?.content ??
        (chunk as { content?: string })?.content
      if (meta?.langgraph_node === 'agent' && content) {
        yield { type: 'token', data: content }
      }
    }
  }
  yield { type: 'done', data: {} }
}
