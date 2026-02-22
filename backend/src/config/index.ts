import 'dotenv/config'

function env(key: string, defaultValue?: string): string {
  const v = process.env[key] ?? defaultValue
  if (v === undefined) throw new Error(`Missing env: ${key}`)
  return v
}

export const config = {
  port: Number(process.env.PORT) || 8000,
  nodeEnv: (process.env.NODE_ENV ?? 'development') as 'development' | 'production' | 'test',
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',

  openai: {
    apiKey: env('OPENAI_API_KEY'),
    embeddingModel: process.env.OPENAI_EMBEDDING_MODEL ?? 'text-embedding-3-small',
    embeddingDimensions: Number(process.env.OPENAI_EMBEDDING_DIMENSIONS) || 1536,
    chatModel: process.env.OPENAI_CHAT_MODEL ?? 'gpt-4o-mini',
  },

  vectorStore: (process.env.VECTOR_STORE ?? 'memory') as 'memory' | 'pinecone',
  pinecone: {
    apiKey: process.env.PINECONE_API_KEY ?? '',
    indexName: process.env.PINECONE_INDEX_NAME ?? 'chat-rag',
    namespace: process.env.PINECONE_NAMESPACE ?? 'default',
  },
} as const
