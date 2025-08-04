include .env
export

BINARY=saudi-stockbot
CMD_DIR=./cmd

.PHONY: all build run test clean

all: build

build:
	go build -o $(BINARY) $(CMD_DIR)

run: build
	@echo "Starting server (with .env)..."
	@./$(BINARY)

dev:
	@echo "Running in dev mode (with .env)..."
	@env $$(grep -v '^#' .env | xargs) go run $(CMD_DIR)

test:
	go test ./internal/... ./cmd/...

clean:
	rm -f $(BINARY)
