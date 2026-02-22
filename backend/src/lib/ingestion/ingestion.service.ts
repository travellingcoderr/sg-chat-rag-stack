import { chunkText } from '../chunking/chunking.service.js'
import { memoryVectorStore } from '../vector-store/memory-vector-store.js'
import type { ChunkForUpsert } from '../../types/knowledge.js'

export interface IngestDocumentInput {
  documentId: string
  title: string
  text: string
}

export async function ingestDocument(input: IngestDocumentInput): Promise<{ chunksCreated: number }> {
  const chunks = chunkText(input.text)
  const toUpsert: ChunkForUpsert[] = chunks.map((c, i) => ({
    id: `${input.documentId}_${i}`,
    documentId: input.documentId,
    title: input.title,
    text: c.text,
  }))
  await memoryVectorStore.upsert(toUpsert)
  return { chunksCreated: toUpsert.length }
}
