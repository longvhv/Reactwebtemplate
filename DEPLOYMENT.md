# Deployment Guide

This guide covers deploying the React frontend as a microservice in various environments.

## Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`.

### Docker Development

```bash
# Build Docker image
docker build -t react-frontend:latest .

# Run container
docker run -d \
  -p 8080:80 \
  -e VITE_API_GATEWAY_URL=http://localhost:8000 \
  -e VITE_SERVICE_NAME=react-frontend \
  -e VITE_SERVICE_VERSION=1.0.0 \
  -e VITE_ENV=development \
  --name react-microservice \
  react-frontend:latest

# Check logs
docker logs -f react-microservice

# Stop container
docker stop react-microservice && docker rm react-microservice
```

### Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f react-frontend

# Stop all services
docker-compose down
```

## Production Deployment

### Prerequisites

1. **Docker** installed and running
2. **Container Registry** access (Docker Hub, AWS ECR, GCR, etc.)
3. **Kubernetes cluster** (for K8s deployment)
4. **kubectl** configured to access your cluster

### Step 1: Build Production Image

```bash
# Build with production optimizations
npm run build:prod

# Build Docker image
docker build -t your-registry/react-frontend:1.0.0 .

# Tag as latest
docker tag your-registry/react-frontend:1.0.0 your-registry/react-frontend:latest

# Push to registry
docker push your-registry/react-frontend:1.0.0
docker push your-registry/react-frontend:latest
```

### Step 2: Configure Environment

Update `k8s/configmap.yaml` with your production values:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: react-frontend-config
  namespace: production
data:
  VITE_API_GATEWAY_URL: "https://api.yourdomain.com"
  VITE_SERVICE_NAME: "react-frontend"
  VITE_SERVICE_VERSION: "1.0.0"
  VITE_ENV: "production"
  VITE_ENABLE_SERVICE_DISCOVERY: "true"
  VITE_ENABLE_MONITORING: "true"
  VITE_ENABLE_LOGGING: "true"
```

### Step 3: Deploy to Kubernetes

```bash
# Create namespace (if needed)
kubectl create namespace production

# Apply configurations
kubectl apply -f k8s/configmap.yaml -n production
kubectl apply -f k8s/deployment.yaml -n production
kubectl apply -f k8s/service.yaml -n production

# Check deployment status
kubectl get pods -l app=react-frontend -n production
kubectl get svc react-frontend -n production

# View logs
kubectl logs -l app=react-frontend -n production -f
```

### Step 4: Verify Deployment

```bash
# Check health endpoint
kubectl port-forward svc/react-frontend 8080:80 -n production

# In another terminal
curl http://localhost:8080/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "react-frontend",
  "version": "1.0.0",
  "environment": "production",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## Integration with @vhvplatform/go-framework

### API Gateway Configuration

Your Go-based API Gateway should route requests to this frontend:

```go
// Example Go configuration
router.GET("/app/*path", func(c *gin.Context) {
    proxy := httputil.NewSingleHostReverseProxy(&url.URL{
        Scheme: "http",
        Host:   "react-frontend:80",
    })
    proxy.ServeHTTP(c.Writer, c.Request)
})
```

### Service Discovery

If using service discovery (Consul, Eureka, etc.):

1. Enable service discovery in environment:
   ```bash
   VITE_ENABLE_SERVICE_DISCOVERY=true
   ```

2. Register the service with your discovery system

3. The frontend will automatically discover backend services

### Health Checks

Configure your orchestration platform to use the health endpoint:

**Kubernetes:**
```yaml
livenessProbe:
  httpGet:
    path: /health
    port: 80
  initialDelaySeconds: 10
  periodSeconds: 30

readinessProbe:
  httpGet:
    path: /health
    port: 80
  initialDelaySeconds: 5
  periodSeconds: 10
```

**Docker Compose:**
```yaml
healthcheck:
  test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost/health"]
  interval: 30s
  timeout: 3s
  retries: 3
```

## Scaling

### Horizontal Scaling

**Kubernetes:**
```bash
# Manual scaling
kubectl scale deployment react-frontend --replicas=5 -n production

# Auto-scaling
kubectl autoscale deployment react-frontend \
  --min=2 \
  --max=10 \
  --cpu-percent=70 \
  -n production
```

### Load Balancing

The Kubernetes Service automatically load-balances between pods. For external access:

**Using Ingress:**
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: react-frontend-ingress
spec:
  rules:
  - host: app.yourdomain.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: react-frontend
            port:
              number: 80
```

## Monitoring & Logging

### Viewing Logs

**Docker:**
```bash
docker logs -f react-microservice
```

**Kubernetes:**
```bash
kubectl logs -l app=react-frontend -n production -f
```

### Metrics

The application sends metrics to your API Gateway at `/metrics` endpoint:
- Web Vitals (CLS, FID, FCP, LCP, TTFB)
- Custom performance metrics
- API call metrics

Configure your API Gateway to forward these to your monitoring system (Prometheus, Datadog, etc.).

### Structured Logging

All logs are in JSON format for easy parsing:

```json
{
  "level": "info",
  "message": "User logged in",
  "timestamp": "2024-01-01T00:00:00Z",
  "service": "react-frontend",
  "version": "1.0.0",
  "environment": "production",
  "data": {
    "userId": 123
  }
}
```

## Troubleshooting

### Container Won't Start

```bash
# Check container logs
docker logs react-microservice

# Inspect container
docker inspect react-microservice

# Check if port is already in use
lsof -i :8080
```

### API Requests Failing

1. **Check CORS configuration** in `nginx.conf`
2. **Verify API Gateway URL** in environment variables
3. **Check network connectivity** between frontend and backend
4. **Review CORS headers** in browser developer tools

### Health Check Failures

```bash
# Test health endpoint directly
curl http://localhost:8080/health

# Check Nginx configuration
docker exec react-microservice cat /etc/nginx/nginx.conf

# Check Nginx logs
docker exec react-microservice cat /var/log/nginx/error.log
```

### Build Failures

```bash
# Clean and rebuild
npm run clean
npm install
npm run build

# Check for TypeScript errors
npx tsc --noEmit
```

## Environment-Specific Configurations

### Development
```bash
VITE_API_GATEWAY_URL=http://localhost:8000
VITE_ENV=development
VITE_LOG_LEVEL=debug
VITE_ENABLE_MONITORING=false
```

### Staging
```bash
VITE_API_GATEWAY_URL=https://staging-api.yourdomain.com
VITE_ENV=staging
VITE_LOG_LEVEL=info
VITE_ENABLE_MONITORING=true
```

### Production
```bash
VITE_API_GATEWAY_URL=https://api.yourdomain.com
VITE_ENV=production
VITE_LOG_LEVEL=error
VITE_ENABLE_MONITORING=true
```

## Security Considerations

1. **Never commit `.env` files** with real credentials
2. **Use Kubernetes Secrets** for sensitive data
3. **Enable HTTPS** in production (configure in Ingress/Load Balancer)
4. **Keep dependencies updated**: `npm audit` regularly
5. **Use read-only containers** when possible
6. **Implement rate limiting** at the API Gateway level
7. **Set appropriate CORS policies** for your domain

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Deploy React Frontend

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Build Docker image
      run: docker build -t ${{ secrets.REGISTRY }}/react-frontend:${{ github.sha }} .
    
    - name: Push to registry
      run: |
        echo ${{ secrets.DOCKER_PASSWORD }} | docker login -u ${{ secrets.DOCKER_USERNAME }} --password-stdin
        docker push ${{ secrets.REGISTRY }}/react-frontend:${{ github.sha }}
    
    - name: Deploy to Kubernetes
      run: |
        kubectl set image deployment/react-frontend react-frontend=${{ secrets.REGISTRY }}/react-frontend:${{ github.sha }} -n production
```

## Rollback

### Kubernetes Rollback

```bash
# View rollout history
kubectl rollout history deployment/react-frontend -n production

# Rollback to previous version
kubectl rollout undo deployment/react-frontend -n production

# Rollback to specific revision
kubectl rollout undo deployment/react-frontend --to-revision=2 -n production
```

### Docker Rollback

```bash
# Stop current container
docker stop react-microservice
docker rm react-microservice

# Run previous version
docker run -d \
  -p 8080:80 \
  --name react-microservice \
  your-registry/react-frontend:1.0.0
```

## Performance Optimization

1. **Enable gzip compression** (already configured in nginx.conf)
2. **Cache static assets** (already configured in nginx.conf)
3. **Use CDN** for static assets
4. **Optimize Docker image** size (already using Alpine Linux)
5. **Implement lazy loading** for routes and components
6. **Monitor bundle size**: Keep main bundle < 500KB

## Support

For issues and questions:
1. Check this deployment guide
2. Review README.md for architecture details
3. Check container logs for errors
4. Open an issue on the repository

## Changelog

### v1.0.0 (2024-12-27)
- Initial microservice configuration
- Docker and Kubernetes support
- Health check endpoints
- Structured logging and monitoring
- Integration with @vhvplatform/go-framework
