import { embeddingService } from '../lib/embeddings/embedding-service.js'
import { memoryVectorStore } from '../lib/vector-store/memory-vector-store.js'
import { ingestDocument } from '../lib/ingestion/ingestion.service.js'
import type { SearchResult } from '../types/knowledge.js'

export interface KnowledgeSearchOutput {
  results: SearchResult[]
  searchTimeMs: number
}

export const knowledgeService = {
  async search(query: string, topK = 5): Promise<KnowledgeSearchOutput> {
    const start = Date.now()
    const queryEmbedding = await embeddingService.embed(query)
    const results = await memoryVectorStore.search(
      query,
      queryEmbedding,
      {},
      { topK, includeMetadata: true }
    )
    return { results, searchTimeMs: Date.now() - start }
  },

  async seedDemo(): Promise<void> {
    const docs = [
      {
        documentId: 'doc1',
        title: 'Getting started',
        text: 'This stack uses a Node/TypeScript backend with LangChain and LangGraph. The agent has a search_knowledge tool that queries an in-memory vector store. You can add Pinecone or another vector DB later.',
      },
      {
        documentId: 'doc2',
        title: 'Components',
        text: 'Components: config, types, chunking, embeddings, vector store, ingestion, knowledge service, tools, LangGraph agent (state, graph, prompts), chat service, and API routes. Optional: MCP.',
      },
    ]
    for (const doc of docs) await ingestDocument(doc)
  },
}
