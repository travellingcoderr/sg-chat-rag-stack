.PHONY: help install dev run build clean

help:
	@echo "Backend (Node/TS)"
	@echo "  make install - npm install"
	@echo "  make dev    - Run dev server (port 8000)"
	@echo "  make run    - Run production (node dist/index.js)"
	@echo "  make build  - tsc"
	@echo "  make clean  - Remove dist and node_modules"

install:
	npm install

dev:
	npm run dev

run:
	node dist/index.js

build:
	npm run build

clean:
	rm -rf dist node_modules
