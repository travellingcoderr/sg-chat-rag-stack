import { z } from 'zod'
import { searchKnowledge, type KnowledgeSearchInput, type KnowledgeSearchOutput } from './knowledge.js'

export interface AgentTool<TInput = unknown, TOutput = unknown> {
  name: string
  description: string
  schema: z.ZodTypeAny
  invoke: (input: TInput) => Promise<TOutput>
}

export const agentTools: AgentTool[] = [
  {
    name: 'search_knowledge',
    description: 'Search the knowledge base. Use the exact user query for factual questions. Returns ranked chunks with scores.',
    schema: z.object({
      query: z.string().describe('Search query'),
      topK: z.number().optional().default(5).describe('Number of results'),
    }),
    invoke: (input: KnowledgeSearchInput): Promise<KnowledgeSearchOutput> => searchKnowledge(input),
  },
]

function zodToJsonSchema(schema: z.ZodTypeAny): Record<string, unknown> {
  if (schema._def.typeName === 'ZodObject') {
    const shape = (schema as z.ZodObject<z.ZodRawShape>).shape
    const properties: Record<string, unknown> = {}
    const required: string[] = []
    for (const [key, value] of Object.entries(shape)) {
      const v = value as z.ZodTypeAny
      properties[key] = zodToJsonSchema(v)
      if (!v.isOptional()) required.push(key)
    }
    return { type: 'object', properties, required: required.length ? required : undefined }
  }
  if (schema._def.typeName === 'ZodString') return { type: 'string', description: schema._def.description }
  if (schema._def.typeName === 'ZodNumber') return { type: 'number', description: schema._def.description }
  if (schema._def.typeName === 'ZodDefault') return zodToJsonSchema(schema._def.innerType)
  return { type: 'string' }
}

export function getToolDefinitions(): Array<{
  type: 'function'
  function: { name: string; description: string; parameters: Record<string, unknown> }
}> {
  return agentTools.map(tool => ({
    type: 'function' as const,
    function: {
      name: tool.name,
      description: tool.description,
      parameters: zodToJsonSchema(tool.schema),
    },
  }))
}

export function getFilteredTools() {
  return agentTools
}
