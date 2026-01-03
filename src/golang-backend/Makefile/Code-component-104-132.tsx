.PHONY: help run build test clean docker-up docker-down docker-build migrate lint format

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

run: ## Run the application
	go run cmd/api/main.go

build: ## Build the application
	go build -o bin/api cmd/api/main.go

test: ## Run tests
	go test -v ./...

test-cover: ## Run tests with coverage
	go test -cover ./...
	go test -coverprofile=coverage.out ./...
	go tool cover -html=coverage.out -o coverage.html

clean: ## Clean build artifacts
	rm -rf bin/
	rm -f coverage.out coverage.html

docker-up: ## Start Docker containers
	docker-compose up -d

docker-down: ## Stop Docker containers
	docker-compose down

docker-build: ## Build and start Docker containers
	docker-compose up --build -d

docker-logs: ## View Docker logs
	docker-compose logs -f api

migrate: ## Run database migrations
	@echo "Running MongoDB migrations..."
	@echo "Migrations should be run automatically on container startup"

lint: ## Run linter
	golangci-lint run

format: ## Format code
	go fmt ./...
	gofmt -s -w .

deps: ## Download dependencies
	go mod download
	go mod tidy

install-tools: ## Install development tools
	go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest

dev: ## Run in development mode with hot reload (requires air)
	air

install-air: ## Install air for hot reload
	go install github.com/cosmtrek/air@latest
