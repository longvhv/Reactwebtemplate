
  # React Microservice Frontend

  This is a production-ready React application configured as a microservice frontend, designed to integrate with the @vhvplatform/go-framework microservice architecture.

  ## Original Project

  This is a code bundle for Ứng dụng cơ bản. The original project is available at https://www.figma.com/design/LQfSKRtvCJ8LIb5Nugeobb/%E1%BB%A8ng-d%E1%BB%A5ng-c%C6%A1-b%E1%BA%A3n.

  ## Architecture Overview

  This React application is containerized and designed to work as a frontend microservice in a distributed system:

  - **Dockerized**: Multi-stage build with Vite (build) and Nginx (serve)
  - **Environment-based configuration**: Support for dev/staging/prod environments
  - **Health checks**: Built-in health endpoint for orchestration
  - **API Gateway integration**: Configured to communicate with backend microservices
  - **Monitoring & Logging**: Structured logging and web vitals tracking
  - **Service Discovery**: Support for dynamic service discovery (optional)
  - **Kubernetes-ready**: Complete K8s manifests included

  ## Tech Stack

  - **React 18.3.1** - UI Framework
  - **Vite 6.3.5** - Build tool
  - **TypeScript** - Type safety
  - **Radix UI** - Component library
  - **Tailwind CSS** - Styling (via dependencies)
  - **Nginx** - Production web server
  - **Docker** - Containerization
  - **Kubernetes** - Orchestration

  ## Quick Start

  ### Development

  ```bash
  # Install dependencies
  npm install

  # Start development server (with hot reload)
  npm run dev
  ```

  The app will be available at `http://localhost:3000`.

  ### Environment Variables

  Create a `.env` file (copy from `.env.example`):

  ```bash
  cp .env.example .env
  ```

  Key environment variables:

  - `VITE_API_GATEWAY_URL` - URL of your API Gateway
  - `VITE_SERVICE_NAME` - Name of this service
  - `VITE_SERVICE_VERSION` - Version number
  - `VITE_ENV` - Environment (development/staging/production)

  See `.env.example` for all available options.

  ## Building for Production

  ### Local Build

  ```bash
  # Build for production
  npm run build

  # Build for specific environment
  npm run build:dev
  npm run build:staging
  npm run build:prod

  # Preview production build
  npm run preview
  ```

  Built files will be in the `build/` directory.

  ### Docker Build

  ```bash
  # Build Docker image
  docker build -t react-frontend:latest .

  # Or use npm script
  npm run docker:build

  # Or use Makefile
  make docker-build
  ```

  ### Run Docker Container

  ```bash
  # Run container
  docker run -d \
    -p 8080:80 \
    -e VITE_API_GATEWAY_URL=http://localhost:8000 \
    -e VITE_SERVICE_NAME=react-frontend \
    -e VITE_SERVICE_VERSION=1.0.0 \
    -e VITE_ENV=production \
    --name react-microservice \
    react-frontend:latest

  # Or use npm script
  npm run docker:run

  # Or use Makefile
  make docker-run
  ```

  The app will be available at `http://localhost:8080`.

  ### Docker Compose

  ```bash
  # Start all services
  docker-compose up -d

  # View logs
  docker-compose logs -f

  # Stop all services
  docker-compose down
  ```

  ## Kubernetes Deployment

  ### Prerequisites

  - Kubernetes cluster running
  - `kubectl` configured
  - Docker image pushed to registry

  ### Deploy

  ```bash
  # Using kubectl
  kubectl apply -f k8s/configmap.yaml
  kubectl apply -f k8s/deployment.yaml
  kubectl apply -f k8s/service.yaml

  # Or use Makefile
  make k8s-deploy

  # Check status
  make k8s-status

  # View logs
  make k8s-logs
  ```

  ### Configuration

  Edit `k8s/configmap.yaml` to configure environment variables for your Kubernetes deployment.

  ## Microservice Features

  ### Health Check Endpoint

  The application exposes a `/health` endpoint for health checks:

  ```bash
  curl http://localhost:8080/health
  ```

  Response:
  ```json
  {
    "status": "healthy",
    "service": "react-frontend",
    "version": "1.0.0",
    "environment": "production",
    "timestamp": "2024-01-01T00:00:00Z"
  }
  ```

  ### API Integration

  The application includes an enhanced API client with:

  - **Interceptors**: Request/response interceptors for common logic
  - **Authentication**: Token management built-in
  - **Error handling**: Centralized error handling
  - **Timeout support**: Configurable request timeouts
  - **Logging**: Automatic request/response logging

  Usage example:

  ```typescript
  import { api } from '@/services/api';

  // Set auth token
  api.setAuthToken('your-jwt-token');

  // Make API calls
  const response = await api.get('/users');
  const data = await api.post('/users', { name: 'John' });
  ```

  ### Service Discovery

  The application supports dynamic service discovery (when enabled):

  ```typescript
  import { serviceRegistry } from '@/utils/service-registry';

  // Get service endpoint
  const endpoint = serviceRegistry.getServiceEndpoint('user-service');

  // Check if service is available
  const isAvailable = serviceRegistry.isServiceAvailable('user-service');

  // Build service URL
  const url = serviceRegistry.buildServiceUrl('user-service', '/api/users');
  ```

  ### Structured Logging

  All logs are structured in JSON format for easy integration with logging platforms:

  ```typescript
  import { logger } from '@/utils/logger';

  logger.info('User logged in', { userId: 123 });
  logger.error('Failed to fetch data', error);
  logger.warn('Deprecated API used');
  ```

  ### Web Vitals Monitoring

  Automatic tracking of Core Web Vitals:

  ```typescript
  import { initMonitoring, trackMetric } from '@/utils/monitoring';

  // Initialize monitoring
  initMonitoring();

  // Track custom metrics
  trackMetric('page-load-time', 1234);
  ```

  ## Integration with @vhvplatform/go-framework

  This frontend is designed to work seamlessly with Go-based microservices:

  1. **API Gateway**: Configure `VITE_API_GATEWAY_URL` to point to your API Gateway
  2. **Service Mesh**: Supports Istio/Linkerd with proper headers
  3. **Distributed Tracing**: Propagates trace IDs in requests
  4. **Health Checks**: Compatible with Kubernetes liveness/readiness probes
  5. **12-Factor App**: Follows 12-factor principles for cloud-native apps

  ### Example Architecture

  ```
  ┌─────────────────┐
  │   React App     │ (This service)
  │  (Port 8080)    │
  └────────┬────────┘
           │
           ▼
  ┌─────────────────┐
  │  API Gateway    │ (Go service)
  │  (Port 8000)    │
  └────────┬────────┘
           │
           ├──────────────────┬──────────────────┐
           ▼                  ▼                  ▼
  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐
  │  Auth Service  │  │  User Service  │  │ Profile Service│
  │  (Port 8001)   │  │  (Port 8002)   │  │  (Port 8003)   │
  └────────────────┘  └────────────────┘  └────────────────┘
  ```

  ## Makefile Commands

  ```bash
  make help              # Show all available commands
  make install           # Install dependencies
  make dev              # Start development server
  make build            # Build for production
  make docker-build     # Build Docker image
  make docker-run       # Run Docker container
  make docker-stop      # Stop Docker container
  make k8s-deploy       # Deploy to Kubernetes
  make k8s-status       # Check deployment status
  make k8s-logs         # View pod logs
  ```

  ## Project Structure

  ```
  .
  ├── Dockerfile              # Multi-stage Docker build
  ├── docker-compose.yml      # Docker Compose configuration
  ├── .dockerignore          # Docker build exclusions
  ├── nginx.conf             # Nginx configuration for production
  ├── .env.example           # Environment variables template
  ├── Makefile               # Common tasks automation
  ├── k8s/                   # Kubernetes manifests
  │   ├── deployment.yaml    # K8s deployment
  │   ├── service.yaml       # K8s service & ingress
  │   └── configmap.yaml     # K8s configuration
  ├── scripts/
  │   └── entrypoint.sh      # Docker entrypoint script
  ├── public/
  │   └── health.json        # Health check response
  ├── src/
  │   ├── config/
  │   │   └── env.ts         # Environment configuration
  │   ├── services/
  │   │   ├── api.ts         # Enhanced API client
  │   │   └── client.ts      # Existing API client
  │   └── utils/
  │       ├── logger.ts      # Structured logging
  │       ├── monitoring.ts  # Web vitals tracking
  │       └── service-registry.ts  # Service discovery
  └── README.md              # This file
  ```

  ## Configuration Files

  ### Dockerfile

  Multi-stage build optimized for production:
  - **Stage 1**: Build React app with Node.js
  - **Stage 2**: Serve with lightweight Nginx Alpine

  ### nginx.conf

  Optimized Nginx configuration with:
  - SPA routing support
  - CORS headers for API Gateway
  - Static asset caching
  - Health check endpoint
  - Security headers
  - Gzip compression

  ### vite.config.ts

  Enhanced Vite configuration with:
  - Environment variable loading
  - API proxy for development
  - Path aliases
  - Build optimizations

  ## Environment Modes

  The application supports three environment modes:

  1. **Development** (`npm run build:dev`)
     - Debug logging enabled
     - Source maps included
     - Development API endpoints

  2. **Staging** (`npm run build:staging`)
     - Warning logging
     - Limited source maps
     - Staging API endpoints

  3. **Production** (`npm run build:prod`)
     - Error logging only
     - No source maps
     - Production API endpoints
     - Maximum optimization

  ## Best Practices

  - **Environment Variables**: Never commit `.env` files with secrets
  - **API Keys**: Store sensitive data in Kubernetes Secrets
  - **Logging**: Use structured logging for better observability
  - **Monitoring**: Enable web vitals monitoring in production
  - **Health Checks**: Ensure health endpoint always returns quickly
  - **Docker Images**: Keep images small (current: ~50MB)
  - **Resource Limits**: Set appropriate CPU/memory limits in K8s

  ## Troubleshooting

  ### Container won't start

  ```bash
  # Check container logs
  docker logs react-microservice

  # Check if port is already in use
  lsof -i :8080
  ```

  ### API requests failing

  - Verify `VITE_API_GATEWAY_URL` is set correctly
  - Check CORS configuration in `nginx.conf`
  - Ensure API Gateway is running and accessible

  ### Health check failing

  ```bash
  # Test health endpoint
  curl http://localhost:8080/health

  # Check Nginx configuration
  docker exec react-microservice cat /etc/nginx/nginx.conf
  ```

  ## Contributing

  1. Fork the repository
  2. Create a feature branch
  3. Make your changes
  4. Test with Docker build
  5. Submit a pull request

  ## License

  [Your License Here]

  ## Support

  For issues and questions, please open an issue on the repository.
  