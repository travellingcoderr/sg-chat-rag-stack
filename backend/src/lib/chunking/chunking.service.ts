export interface ChunkingConfig {
  chunkSize: number
  chunkOverlap: number
}

export interface TextChunk {
  text: string
  index: number
}

const DEFAULT_CONFIG: ChunkingConfig = {
  chunkSize: 800,
  chunkOverlap: 100,
}

export function chunkText(text: string, config: Partial<ChunkingConfig> = {}): TextChunk[] {
  const { chunkSize, chunkOverlap } = { ...DEFAULT_CONFIG, ...config }
  const chunks: TextChunk[] = []
  let start = 0
  let index = 0
  while (start < text.length) {
    let end = Math.min(start + chunkSize, text.length)
    if (end < text.length) {
      const lastSpace = text.lastIndexOf(' ', end)
      if (lastSpace > start) end = lastSpace
    }
    chunks.push({ text: text.slice(start, end).trim(), index })
    index++
    start = end - chunkOverlap
    if (start >= end) start = end
  }
  return chunks.filter(c => c.text.length > 0)
}
