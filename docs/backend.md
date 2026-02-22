# Backend

Node/TypeScript API with LangChain, LangGraph, and RAG.

## Setup

```bash
cd backend
cp .env.example .env
# Set OPENAI_API_KEY in .env

make install
make dev
```

Runs at http://localhost:8000.

## Structure

- `src/config` — Config from env
- `src/types` — Chat and knowledge types
- `src/lib/chunking` — Text chunking
- `src/lib/embeddings` — OpenAI embeddings
- `src/lib/vector-store` — In-memory vector store
- `src/lib/ingestion` — Document ingestion
- `src/services/knowledge.service.ts` — Search
- `src/agent/tools` — LangChain tools
- `src/agent` — State, graph, prompts
- `src/services/chat.service.ts` — Chat orchestration
- `src/routes` — Express routes

## Makefile

- `make install` — npm install
- `make dev` — Dev server (port 8000)
- `make build` — tsc
- `make run` — Production run
- `make clean` — Remove dist and node_modules
