export interface SearchFilters {
  tags?: string[]
  documentIds?: string[]
}

export interface SearchOptions {
  topK?: number
  includeMetadata?: boolean
}

export interface SearchResult {
  chunkId: string
  documentId: string
  title: string
  text: string
  score: number
  snippet?: string
}

export interface ChunkForUpsert {
  id: string
  documentId: string
  text: string
  title: string
}

export interface VectorStoreProvider {
  search(
    query: string,
    embedding: number[],
    filters: SearchFilters,
    options: SearchOptions
  ): Promise<SearchResult[]>
  upsert(chunks: ChunkForUpsert[]): Promise<void>
}
