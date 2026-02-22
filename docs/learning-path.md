# AI Backend Learning Path

Build order for the components in this stack (backend).

| Step | Component        | Purpose                                      |
|------|------------------|----------------------------------------------|
| 1    | Config           | Env vars, API keys (single place)            |
| 2    | Types            | Chat and knowledge DTOs                      |
| 3    | Models           | Optional DB models (not used in minimal)     |
| 4    | Chunking         | Split documents into chunks for RAG          |
| 5    | Embeddings       | Text → vectors (OpenAI)                      |
| 6    | Vector store     | Store and search vectors (in-memory/Pinecone)|
| 7    | Ingestion        | Document → chunk → embed → upsert            |
| 8    | Knowledge service| search(query) → chunks                       |
| 9    | Tools            | LangChain tools (e.g. search_knowledge)      |
| 10   | Agent            | LangGraph state, graph, invoke/stream        |
| 11   | Prompts          | System prompt                                |
| 12   | Chat service     | Orchestrate agent, return response            |
| 13   | Routes           | HTTP API                                     |
| 15   | MCP (optional)   | Model Context Protocol for external tools    |

**LangChain**: Messages + ChatOpenAI + tool binding.  
**LangGraph**: State graph with agent and tools nodes; loop until no more tool calls.
