.PHONY: help install install-backend install-frontend dev dev-backend dev-frontend docker-up docker-down clean

help:
	@echo "Chat + RAG stack (Node/TS backend + Next.js frontend)"
	@echo ""
	@echo "  make install          - Install backend and frontend dependencies"
	@echo "  make install-backend - Install backend only"
	@echo "  make install-frontend - Install frontend only"
	@echo "  make dev-backend     - Run backend (port 8000)"
	@echo "  make dev-frontend    - Run frontend (port 3000)"
	@echo "  make dev             - Run backend and frontend (use two terminals or docker)"
	@echo "  make docker-up       - Start all services with Docker Compose"
	@echo "  make docker-down     - Stop Docker Compose"
	@echo "  make clean           - Remove node_modules and build artifacts"

install: install-backend install-frontend

install-backend:
	@echo "Installing backend..."
	cd backend && npm install

install-frontend:
	@echo "Installing frontend..."
	cd frontend && npm install

dev-backend:
	@echo "Starting backend..."
	cd backend && npm run dev

dev-frontend:
	@echo "Starting frontend..."
	cd frontend && npm run dev

dev: install
	@echo "Run backend in one terminal: make dev-backend"
	@echo "Run frontend in another:    make dev-frontend"

docker-up:
	docker compose up --build

docker-down:
	docker compose down

clean:
	rm -rf backend/node_modules backend/dist
	rm -rf frontend/node_modules frontend/.next frontend/out
