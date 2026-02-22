# Frontend

Next.js chat UI. Calls the backend for chat and streaming.

## Setup

```bash
cd frontend
cp .env.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:8000 (default)

make install
make dev
```

Runs at http://localhost:3000.

## Makefile

- `make install` — npm install
- `make dev` — next dev
- `make build` — next build
- `make start` — next start
- `make lint` — next lint
- `make clean` — Remove .next and node_modules
