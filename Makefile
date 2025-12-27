.PHONY: help install dev build docker-build docker-run docker-stop docker-clean k8s-deploy k8s-delete lint test

# Variables
DOCKER_IMAGE_NAME=react-frontend
DOCKER_IMAGE_TAG=latest
DOCKER_CONTAINER_NAME=react-microservice
K8S_NAMESPACE=default

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies
	npm install

dev: ## Start development server
	npm run dev

build: ## Build production bundle
	npm run build

build-dev: ## Build for development environment
	VITE_ENV=development npm run build

build-staging: ## Build for staging environment
	VITE_ENV=staging npm run build

build-prod: ## Build for production environment
	VITE_ENV=production npm run build

docker-build: ## Build Docker image
	docker build -t $(DOCKER_IMAGE_NAME):$(DOCKER_IMAGE_TAG) .

docker-run: ## Run Docker container
	docker run -d \
		--name $(DOCKER_CONTAINER_NAME) \
		-p 8080:80 \
		-e VITE_API_GATEWAY_URL=http://localhost:8000 \
		-e VITE_SERVICE_NAME=react-frontend \
		-e VITE_SERVICE_VERSION=1.0.0 \
		-e VITE_ENV=development \
		$(DOCKER_IMAGE_NAME):$(DOCKER_IMAGE_TAG)

docker-stop: ## Stop Docker container
	docker stop $(DOCKER_CONTAINER_NAME) || true
	docker rm $(DOCKER_CONTAINER_NAME) || true

docker-logs: ## Show Docker container logs
	docker logs -f $(DOCKER_CONTAINER_NAME)

docker-shell: ## Open shell in Docker container
	docker exec -it $(DOCKER_CONTAINER_NAME) sh

docker-clean: docker-stop ## Clean Docker images and containers
	docker rmi $(DOCKER_IMAGE_NAME):$(DOCKER_IMAGE_TAG) || true

docker-compose-up: ## Start services with docker-compose
	docker-compose up -d

docker-compose-down: ## Stop services with docker-compose
	docker-compose down

docker-compose-logs: ## Show docker-compose logs
	docker-compose logs -f

k8s-deploy: ## Deploy to Kubernetes
	kubectl apply -f k8s/configmap.yaml -n $(K8S_NAMESPACE)
	kubectl apply -f k8s/deployment.yaml -n $(K8S_NAMESPACE)
	kubectl apply -f k8s/service.yaml -n $(K8S_NAMESPACE)

k8s-delete: ## Delete from Kubernetes
	kubectl delete -f k8s/service.yaml -n $(K8S_NAMESPACE) || true
	kubectl delete -f k8s/deployment.yaml -n $(K8S_NAMESPACE) || true
	kubectl delete -f k8s/configmap.yaml -n $(K8S_NAMESPACE) || true

k8s-status: ## Check Kubernetes deployment status
	kubectl get pods -l app=react-frontend -n $(K8S_NAMESPACE)
	kubectl get svc react-frontend -n $(K8S_NAMESPACE)

k8s-logs: ## Show Kubernetes pod logs
	kubectl logs -l app=react-frontend -n $(K8S_NAMESPACE) --tail=100 -f

k8s-describe: ## Describe Kubernetes deployment
	kubectl describe deployment react-frontend -n $(K8S_NAMESPACE)

clean: ## Clean build artifacts
	rm -rf build dist node_modules

lint: ## Run linter (if configured)
	@echo "Linting not configured yet"

test: ## Run tests (if configured)
	@echo "Tests not configured yet"
