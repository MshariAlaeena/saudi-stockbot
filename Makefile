PHONY: help all setup build-backend build-frontend build dev test clean

.DEFAULT_GOAL := help

## ──────────────────────────────────────────────────────────────────────────────
## Help
## ──────────────────────────────────────────────────────────────────────────────
help: ## Show this help
	@echo "Usage: make [target]"
	@echo ""
	@echo "Available targets:"
	@grep -E '^[a-zA-Z_-]+:.*?## ' $(MAKEFILE_LIST) \
	  | sed -e 's/:.*##/:/' -e 's/##//' \
	  | awk 'BEGIN {FS = ":"} {printf "  %-15s %s\n", $$1, $$2}'
	@echo ""

## ──────────────────────────────────────────────────────────────────────────────
## Setup & Dependencies
## ──────────────────────────────────────────────────────────────────────────────
setup: ## Install deps for both backend & frontend
	@echo "→ Setting up backend…"
	@cd backend && make install
	@echo "→ Setting up frontend…"
	@cd frontend && make setup

## ──────────────────────────────────────────────────────────────────────────────
## Build
## ──────────────────────────────────────────────────────────────────────────────
build-backend: ## build the Go backend binary
	@echo "→ Building backend…"
	@cd backend && make build

build-frontend: ## build the Next.js frontend
	@echo "→ Building frontend…"
	@cd frontend && make build

build: build-backend build-frontend ## build both services

## ──────────────────────────────────────────────────────────────────────────────
## Development
## ──────────────────────────────────────────────────────────────────────────────
dev-backend: ## run backend in dev mode
	@echo "→ Starting backend dev…"
	@cd backend && make dev

dev-frontend: ## run frontend in dev mode
	@echo "→ Starting frontend dev…"
	@cd frontend && make dev

dev: ## start backend & frontend concurrently
	@echo "→ Starting backend & frontend in parallel…"
	@$(MAKE) dev-backend &    # run backend in background
	@$(MAKE) dev-frontend &   # run frontend in background
	@wait  

## ──────────────────────────────────────────────────────────────────────────────
## Test
## ──────────────────────────────────────────────────────────────────────────────
test-backend: ## run backend tests
	@echo "→ Testing backend…"
	@cd backend && make test

test-frontend: ## run frontend tests
	@echo "→ Testing frontend…"
	@cd frontend && make test

test: test-backend test-frontend ## run all tests

## ──────────────────────────────────────────────────────────────────────────────
## Clean
## ──────────────────────────────────────────────────────────────────────────────
clean-backend: ## clean backend artifacts
	@echo "→ Cleaning backend…"
	@cd backend && make clean

clean-frontend: ## clean frontend artifacts
	@echo "→ Cleaning frontend…"
	@cd frontend && make clean

clean: clean-backend clean-frontend ## clean both services

## ──────────────────────────────────────────────────────────────────────────────
## Run Docker-compose up -d
## ──────────────────────────────────────────────────────────────────────────────
run-docker-compose: ## run docker-compose up -d
	@echo "→ Running docker-compose up -d…"
	@cd backend && docker-compose up -d