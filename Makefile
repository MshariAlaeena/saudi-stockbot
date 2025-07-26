.PHONY: help install setup dev build clean check-deps install-node install-deps copy-env health-check

.DEFAULT_GOAL := help

RED := \033[0;31m
GREEN := \033[0;32m
YELLOW := \033[1;33m
BLUE := \033[0;34m
NC := \033[0m

PROJECT_NAME := rag-patient-chatbot
NODE_VERSION := 18
PACKAGE_MANAGER := npm

help: ## Show this help message
	@echo "$(BLUE)RAG Patient Chatbot - Local Development Setup$(NC)"
	@echo ""
	@echo "$(YELLOW)Available commands:$(NC)"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  $(GREEN)%-15s$(NC) %s\n", $$1, $$2}' $(MAKEFILE_LIST)
	@echo ""
	@echo "$(YELLOW)Quick start:$(NC)"
	@echo "  make setup    # Install all dependencies and setup environment"
	@echo "  make dev      # Start development server"
	@echo ""
	@echo "$(YELLOW)Included UI Components:$(NC)"
	@echo "  • shadcn/ui components (buttons, cards, dialogs, etc.)"
	@echo "  • react-day-picker for calendar functionality"
	@echo "  • vaul for drawer/sheet components"
	@echo "  • Lucide React icons"

check-deps: ## Check if required dependencies are installed
	@echo "$(BLUE)Checking system dependencies...$(NC)"
	@command -v node >/dev/null 2>&1 || { echo "$(RED)Error: Node.js is not installed$(NC)"; exit 1; }
	@command -v npm >/dev/null 2>&1 || { echo "$(RED)Error: npm is not installed$(NC)"; exit 1; }
	@echo "$(GREEN)✓ Node.js and npm are installed$(NC)"
	@node_version=$$(node --version | cut -d'v' -f2 | cut -d'.' -f1); \
	if [ $$node_version -lt $(NODE_VERSION) ]; then \
		echo "$(YELLOW)Warning: Node.js version $$node_version detected. Recommended: $(NODE_VERSION)+$(NC)"; \
	else \
		echo "$(GREEN)✓ Node.js version is compatible$(NC)"; \
	fi

install-node: ## Install Node.js (macOS/Linux)
	@echo "$(BLUE)Installing Node.js...$(NC)"
	@if command -v brew >/dev/null 2>&1; then \
		echo "$(YELLOW)Installing Node.js via Homebrew...$(NC)"; \
		brew install node; \
	elif command -v curl >/dev/null 2>&1; then \
		echo "$(YELLOW)Installing Node.js via NodeSource...$(NC)"; \
		curl -fsSL https://deb.nodesource.com/setup_$(NODE_VERSION).x | sudo -E bash -; \
		sudo apt-get install -y nodejs; \
	else \
		echo "$(RED)Please install Node.js manually from https://nodejs.org/$(NC)"; \
		exit 1; \
	fi

install-deps: check-deps ## Install project dependencies
	@echo "$(BLUE)Installing project dependencies...$(NC)"
	@if [ -f "package-lock.json" ]; then \
		echo "$(YELLOW)Found package-lock.json, running npm ci...$(NC)"; \
		npm ci; \
	else \
		echo "$(YELLOW)Running npm install...$(NC)"; \
		npm install; \
	fi
	@echo "$(GREEN)✓ Dependencies installed successfully$(NC)"

copy-env: ## Copy environment file template
	@echo "$(BLUE)Setting up environment variables...$(NC)"
	@if [ ! -f ".env.local" ]; then \
		if [ -f ".env.example" ]; then \
			cp .env.example .env.local; \
			echo "$(GREEN)✓ Created .env.local from .env.example$(NC)"; \
			echo "$(YELLOW)Please update .env.local with your API configuration$(NC)"; \
		else \
			echo "$(YELLOW)Creating default .env.local...$(NC)"; \
			echo "NEXT_PUBLIC_API_BASE_URL=http://localhost:8080" > .env.local; \
			echo "$(GREEN)✓ Created default .env.local$(NC)"; \
		fi; \
	else \
		echo "$(GREEN)✓ .env.local already exists$(NC)"; \
	fi

setup: install-deps copy-env ## Complete setup for local development
	@echo "$(BLUE)Running setup tasks...$(NC)"
	@echo "$(GREEN)✓ Setup complete!$(NC)"
	@echo ""
	@echo "$(YELLOW)Next steps:$(NC)"
	@echo "  1. Update .env.local with your API endpoint"
	@echo "  2. Run 'make dev' to start the development server"
	@echo "  3. Open http://localhost:3000 in your browser"

dev: ## Start development server
	@echo "$(BLUE)Starting development server...$(NC)"
	@if [ ! -f ".env.local" ]; then \
		echo "$(YELLOW)No .env.local found, creating default...$(NC)"; \
		make copy-env; \
	fi
	npm run dev

build: ## Build the application for production
	@echo "$(BLUE)Building application...$(NC)"
	npm run build
	@echo "$(GREEN)✓ Build complete$(NC)"

start: build ## Start production server
	@echo "$(BLUE)Starting production server...$(NC)"
	npm start

lint: ## Run linting
	@echo "$(BLUE)Running linter...$(NC)"
	npm run lint

lint-fix: ## Fix linting issues
	@echo "$(BLUE)Fixing linting issues...$(NC)"
	npm run lint -- --fix

type-check: ## Run TypeScript type checking
	@echo "$(BLUE)Running TypeScript type check...$(NC)"
	npx tsc --noEmit

test: ## Run tests
	@echo "$(BLUE)Running tests...$(NC)"
	@if grep -q '"test"' package.json; then \
		npm test; \
	else \
		echo "$(YELLOW)No tests configured$(NC)"; \
	fi

health-check: ## Check if the application is running
	@echo "$(BLUE)Checking application health...$(NC)"
	@if curl -s http://localhost:3000 >/dev/null 2>&1; then \
		echo "$(GREEN)✓ Application is running at http://localhost:3000$(NC)"; \
	else \
		echo "$(RED)✗ Application is not running$(NC)"; \
		echo "$(YELLOW)Run 'make dev' to start the development server$(NC)"; \
	fi

api-health: ## Check if the API is running
	@echo "$(BLUE)Checking API health...$(NC)"
	@api_url=$$(grep NEXT_PUBLIC_API_BASE_URL .env.local 2>/dev/null | cut -d'=' -f2 || echo "http://localhost:8080"); \
	if curl -s $$api_url/api/v1/health >/dev/null 2>&1; then \
		echo "$(GREEN)✓ API is running at $$api_url$(NC)"; \
	else \
		echo "$(RED)✗ API is not running at $$api_url$(NC)"; \
		echo "$(YELLOW)Make sure your backend API is running$(NC)"; \
	fi

clean: ## Clean dependencies and build files
	@echo "$(BLUE)Cleaning project...$(NC)"
	@if [ -d "node_modules" ]; then \
		echo "$(YELLOW)Removing node_modules...$(NC)"; \
		rm -rf node_modules; \
	fi
	@if [ -d ".next" ]; then \
		echo "$(YELLOW)Removing .next build directory...$(NC)"; \
		rm -rf .next; \
	fi
	@if [ -f "package-lock.json" ]; then \
		echo "$(YELLOW)Removing package-lock.json...$(NC)"; \
		rm -f package-lock.json; \
	fi
	@echo "$(GREEN)✓ Project cleaned$(NC)"

reset: clean setup ## Clean and reinstall everything
	@echo "$(GREEN)✓ Project reset complete$(NC)"

update: ## Update dependencies
	@echo "$(BLUE)Updating dependencies...$(NC)"
	npm update
	@echo "$(GREEN)✓ Dependencies updated$(NC)"

info: ## Show project information
	@echo "$(BLUE)Project Information:$(NC)"
	@echo "  Name: $(PROJECT_NAME)"
	@echo "  Node.js: $$(node --version 2>/dev/null || echo 'Not installed')"
	@echo "  npm: $$(npm --version 2>/dev/null || echo 'Not installed')"
	@echo "  Package Manager: $(PACKAGE_MANAGER)"
	@echo ""
	@if [ -f "package.json" ]; then \
		echo "$(BLUE)Package.json scripts:$(NC)"; \
		npm run 2>/dev/null | grep -E "^  [a-zA-Z]" || echo "  No scripts found"; \
	fi

install-tools: ## Install useful development tools globally
	@echo "$(BLUE)Installing development tools...$(NC)"
	@echo "$(YELLOW)Installing TypeScript globally...$(NC)"
	npm install -g typescript
	@echo "$(YELLOW)Installing Next.js CLI globally...$(NC)"
	npm install -g create-next-app
	@echo "$(GREEN)✓ Development tools installed$(NC)"

docker-setup: ## Setup using Docker (alternative)
	@echo "$(BLUE)Setting up with Docker...$(NC)"
	@if command -v docker >/dev/null 2>&1; then \
		echo "$(YELLOW)Building Docker image...$(NC)"; \
		docker build -t $(PROJECT_NAME) .; \
		echo "$(GREEN)✓ Docker image built$(NC)"; \
		echo "$(YELLOW)Run 'make docker-dev' to start with Docker$(NC)"; \
	else \
		echo "$(RED)Docker is not installed$(NC)"; \
		echo "$(YELLOW)Install Docker from https://docker.com$(NC)"; \
	fi

docker-dev: ## Run development server in Docker
	@echo "$(BLUE)Starting development server in Docker...$(NC)"
	docker run -p 3000:3000 -v $$(pwd):/app $(PROJECT_NAME) npm run dev

# Platform-specific installations
install-macos: ## Install dependencies on macOS
	@echo "$(BLUE)Setting up for macOS...$(NC)"
	@if ! command -v brew >/dev/null 2>&1; then \
		echo "$(YELLOW)Installing Homebrew...$(NC)"; \
		/bin/bash -c "$$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"; \
	fi
	@if ! command -v node >/dev/null 2>&1; then \
		echo "$(YELLOW)Installing Node.js via Homebrew...$(NC)"; \
		brew install node; \
	fi
	@make setup

install-ubuntu: ## Install dependencies on Ubuntu/Debian
	@echo "$(BLUE)Setting up for Ubuntu/Debian...$(NC)"
	sudo apt update
	@if ! command -v node >/dev/null 2>&1; then \
		echo "$(YELLOW)Installing Node.js...$(NC)"; \
		curl -fsSL https://deb.nodesource.com/setup_$(NODE_VERSION).x | sudo -E bash -; \
		sudo apt-get install -y nodejs; \
	fi
	@if ! command -v curl >/dev/null 2>&1; then \
		echo "$(YELLOW)Installing curl...$(NC)"; \
		sudo apt-get install -y curl; \
	fi
	@make setup

install-windows: ## Install dependencies on Windows (requires WSL or Git Bash)
	@echo "$(BLUE)Setting up for Windows...$(NC)"
	@echo "$(YELLOW)Please ensure you have Node.js installed from https://nodejs.org/$(NC)"
	@echo "$(YELLOW)Or use Windows Subsystem for Linux (WSL) and run 'make install-ubuntu'$(NC)"
	@make setup

# Troubleshooting
troubleshoot: ## Run troubleshooting checks
	@echo "$(BLUE)Running troubleshooting checks...$(NC)"
	@echo ""
	@echo "$(YELLOW)System Information:$(NC)"
	@echo "  OS: $$(uname -s 2>/dev/null || echo 'Unknown')"
	@echo "  Architecture: $$(uname -m 2>/dev/null || echo 'Unknown')"
	@echo ""
	@echo "$(YELLOW)Node.js Environment:$(NC)"
	@node --version 2>/dev/null && echo "  Node.js: $$(node --version)" || echo "  Node.js: Not installed"
	@npm --version 2>/dev/null && echo "  npm: $$(npm --version)" || echo "  npm: Not installed"
	@echo ""
	@echo "$(YELLOW)Project Status:$(NC)"
	@[ -f "package.json" ] && echo "  ✓ package.json exists" || echo "  ✗ package.json missing"
	@[ -d "node_modules" ] && echo "  ✓ node_modules exists" || echo "  ✗ node_modules missing (run 'make install-deps')"
	@[ -f ".env.local" ] && echo "  ✓ .env.local exists" || echo "  ✗ .env.local missing (run 'make copy-env')"
	@echo ""
	@make health-check
	@make api-health

# Quick commands for common workflows
quick-start: ## Quick start for new developers
	@echo "$(BLUE)Quick start setup...$(NC)"
	@echo "$(YELLOW)This will install all dependencies and start the development server$(NC)"
	@make setup
	@echo ""
	@echo "$(GREEN)Setup complete! Starting development server...$(NC)"
	@make dev

# Documentation
docs: ## Open documentation
	@echo "$(BLUE)Opening documentation...$(NC)"
	@if command -v open >/dev/null 2>&1; then \
		open README.md; \
	elif command -v xdg-open >/dev/null 2>&1; then \
		xdg-open README.md; \
	else \
		echo "$(YELLOW)Please open README.md manually$(NC)"; \
	fi
