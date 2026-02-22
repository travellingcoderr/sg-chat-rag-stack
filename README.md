# Chat + RAG Stack

AI chatbot with **Node/TypeScript backend** (LangChain, LangGraph, RAG) and **Next.js frontend**. For learning and reuse.

- **Backend**: Express, OpenAI, LangGraph agent, in-memory vector store, `search_knowledge` tool.
- **Frontend**: Next.js, chat UI, streaming support.

## Project structure

- **backend/** — Node/TS API (see [docs/backend.md](docs/backend.md))
- **frontend/** — Next.js app (see [docs/frontend.md](docs/frontend.md))
- **docs/** — Documentation

## Quick start (local)

```bash
# 1. Env
cp backend/.env.example backend/.env
# Set OPENAI_API_KEY in backend/.env

# 2. Install
make install

# 3. Run backend (terminal 1)
make dev-backend
# Backend: http://localhost:8000

# 4. Run frontend (terminal 2)
make dev-frontend
# Frontend: http://localhost:3000
```

## Quick start (Docker)

```bash
cp backend/.env.example backend/.env
# Set OPENAI_API_KEY in backend/.env

make docker-up
# Backend: http://localhost:8000
# Frontend: http://localhost:3000
```

## Backend — Quick reference

From the **backend** directory (`cd backend`):

| Goal | Command |
|------|---------|
| Dev (tsx, watch) | `make dev` or `npm run dev` |
| Dev (after build) | `npm run build` then `make dev-node` |
| Production | `npm run build` then `npm start` |
| Health check | `curl http://localhost:8000/health` |

- **Dev (tsx)**: runs TypeScript with watch; no build step. First startup may take a few seconds.
- **Dev (node)**: run `npm run build` once, then `make dev-node`; server restarts when `dist/` changes.
- **Production**: build then `npm start` (runs `node dist/index.js`).

## Features

- Streaming chat via SSE
- RAG: in-memory knowledge base, seeded with demo docs
- LangGraph agent with tools (search_knowledge)
- TypeScript throughout
- Makefiles and Docker

## Download as zip

From the repo root, create a zip for distribution:

```bash
zip -r chat-rag-stack.zip chat-rag-stack -x "chat-rag-stack/node_modules/*" -x "chat-rag-stack/*/node_modules/*" -x "chat-rag-stack/frontend/.next/*" -x "chat-rag-stack/backend/dist/*"
```

Then unzip elsewhere and run `make install` and `make dev-backend` / `make dev-frontend`, or `make docker-up`.

## Docs

- [Learning path & components](docs/learning-path.md)
- [API reference](docs/API.md)
- [Backend setup](docs/backend.md)
- [Frontend setup](docs/frontend.md)
