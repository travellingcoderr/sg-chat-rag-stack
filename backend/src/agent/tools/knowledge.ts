import { knowledgeService } from '../../services/knowledge.service.js'

export interface KnowledgeSearchInput {
  query: string
  topK?: number
}

export interface KnowledgeChunk {
  id: string
  title: string
  content: string
  score: number
}

export interface KnowledgeSearchOutput {
  chunks: KnowledgeChunk[]
  totalFound: number
  searchTimeMs: number
}

export async function searchKnowledge(input: KnowledgeSearchInput): Promise<KnowledgeSearchOutput> {
  const topK = input.topK ?? 5
  const { results, searchTimeMs } = await knowledgeService.search(input.query, topK)
  const chunks: KnowledgeChunk[] = results.map(r => ({
    id: r.chunkId,
    title: r.title,
    content: r.snippet ?? r.text,
    score: r.score,
  }))
  return { chunks, totalFound: chunks.length, searchTimeMs }
}
