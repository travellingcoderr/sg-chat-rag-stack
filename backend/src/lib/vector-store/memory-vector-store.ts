import type {
  SearchFilters,
  SearchOptions,
  SearchResult,
  VectorStoreProvider,
  ChunkForUpsert,
} from '../../types/knowledge.js'
import { embeddingService } from '../embeddings/embedding-service.js'

interface StoredChunk extends ChunkForUpsert {
  embedding: number[]
}

const store: StoredChunk[] = []

function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0
  let dot = 0, na = 0, nb = 0
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    na += a[i] * a[i]
    nb += b[i] * b[i]
  }
  const den = Math.sqrt(na) * Math.sqrt(nb)
  return den === 0 ? 0 : dot / den
}

export const memoryVectorStore: VectorStoreProvider = {
  async search(_query, queryEmbedding, _filters, options) {
    const topK = options.topK ?? 5
    const scored = store.map(chunk => ({
      chunk,
      score: cosineSimilarity(queryEmbedding, chunk.embedding),
    }))
    scored.sort((a, b) => b.score - a.score)
    return scored.slice(0, topK).map(({ chunk, score }) => ({
      chunkId: chunk.id,
      documentId: chunk.documentId,
      title: chunk.title,
      text: chunk.text,
      score,
      snippet: chunk.text.slice(0, 300),
    }))
  },

  async upsert(chunks: ChunkForUpsert[]) {
    const texts = chunks.map(c => c.text)
    const embeddings = await embeddingService.embedMany(texts)
    for (let i = 0; i < chunks.length; i++) {
      const c = chunks[i]
      const row: StoredChunk = { ...c, embedding: embeddings[i] }
      const idx = store.findIndex(s => s.id === c.id)
      if (idx >= 0) store[idx] = row
      else store.push(row)
    }
  },
}
