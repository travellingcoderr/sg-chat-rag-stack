import OpenAI from 'openai'
import { config } from '../../config/index.js'

export class EmbeddingService {
  private client: OpenAI

  constructor() {
    this.client = new OpenAI({ apiKey: config.openai.apiKey })
  }

  async embed(text: string): Promise<number[]> {
    const res = await this.client.embeddings.create({
      model: config.openai.embeddingModel,
      input: text,
      dimensions: config.openai.embeddingDimensions,
    })
    return res.data[0].embedding
  }

  async embedMany(texts: string[]): Promise<number[][]> {
    if (texts.length === 0) return []
    const res = await this.client.embeddings.create({
      model: config.openai.embeddingModel,
      input: texts,
      dimensions: config.openai.embeddingDimensions,
    })
    return res.data.sort((a, b) => a.index - b.index).map(d => d.embedding)
  }
}
