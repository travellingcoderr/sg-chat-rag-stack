# API Reference

Base URL: `http://localhost:8000` (backend).

## Health

- **GET** `/health`  
  Returns `{ "status": "ok" }`.

## Chat

- **POST** `/api/chat/message`  
  **Body:** `{ "message": string, "conversationId"?: string }`  
  **Response:** `{ "response": string, "toolsUsed": string[], "executionTime": number, "conversationId"?: string }`

- **POST** `/api/chat/message/stream`  
  **Body:** `{ "message": string, "conversationId"?: string }`  
  **Response:** Server-Sent Events (SSE). Each event: `data: {"type":"token"|"done","data":...}\n\n`
