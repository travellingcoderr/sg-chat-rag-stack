.PHONY: help install dev run build clean port-check free-port

help:
	@echo "Backend (Node/TS)"
	@echo "  make install    - npm install"
	@echo "  make dev        - Run dev server (tsx watch, port 8000)"
	@echo "  make dev-node   - Run dev server (plain Node --watch, faster startup)"
	@echo "  make run        - Run production (node dist/index.js)"
	@echo "  make build      - tsc"
	@echo "  make clean      - Remove dist and node_modules"
	@echo "  make port-check - Show process using port 8000"
	@echo "  make free-port  - Kill process on port 8000"

install:
	npm install

# Show what is using port 8000 (if anything)
port-check:
	@lsof -i :8000 2>/dev/null || echo "Port 8000 is free."

# Free port 8000 by killing the process using it
free-port:
	@pid=$$(lsof -ti :8000 2>/dev/null); \
	if [ -n "$$pid" ]; then kill -9 $$pid; echo "Killed process $$pid on port 8000."; else echo "Port 8000 is already free."; fi

dev: port-check
	npm run dev

dev-node: port-check
	npm run dev:node

run:
	node dist/index.js

build:
	npm run build

clean:
	rm -rf dist node_modules
