# Deployment Guide - Golang Backend API

## 📦 Cách Copy Code từ Figma Make sang Local

### Step 1: Tạo Project Folder
```bash
# Tạo thư mục project
mkdir -p ~/projects/vhv-platform-backend
cd ~/projects/vhv-platform-backend
```

### Step 2: Copy Structure từ Figma Make

Trong Figma Make, bạn đã có folder `/golang-backend/` với structure:
```
/golang-backend/
├── cmd/api/main.go
├── internal/
│   ├── auth/
│   ├── user/
│   ├── platform/
│   └── middleware/
├── .env.example
├── Dockerfile
├── docker-compose.yml
├── go.mod
├── Makefile
└── README.md
```

**Copy từng file từ Figma Make sang local:**

#### Option A: Manual Copy (Recommended)
1. Mở mỗi file trong Figma Make
2. Copy content
3. Paste vào file tương ứng ở local

```bash
# Tạo structure
mkdir -p cmd/api
mkdir -p internal/{auth,user,platform,middleware}

# Tạo từng file và paste content
nano cmd/api/main.go          # Paste content từ Figma Make
nano internal/auth/model.go   # Paste content từ Figma Make
# ... tiếp tục với tất cả files
```

#### Option B: Download từ Figma Make (nếu có feature)
Nếu Figma Make có nút "Export" hoặc "Download", sử dụng để download toàn bộ project.

### Step 3: Initialize Go Module
```bash
# Initialize module
go mod init github.com/vhvplatform/react-framework-api

# Download dependencies
go mod download
go mod tidy
```

### Step 4: Setup Environment
```bash
# Copy và edit .env
cp .env.example .env
nano .env

# Update các giá trị:
# - JWT_SECRET (phải đổi thành key mới)
# - MONGODB_URI (nếu dùng MongoDB cloud)
# - CORS_ORIGINS (frontend URL của bạn)
```

### Step 5: Install Shared Libraries

**QUAN TRỌNG**: Bạn cần clone `vhvplatform/go-shared` repository:

```bash
# Clone go-shared vào workspace
cd ~/projects
git clone https://github.com/vhvplatform/go-shared.git

# Setup go workspace (Go 1.18+)
cd ~/projects/vhv-platform-backend
go work init
go work use . ../go-shared

# Hoặc dùng replace trong go.mod
# Thêm vào go.mod:
replace (
    github.com/vhvplatform/go-shared/config => ../go-shared/config
    github.com/vhvplatform/go-shared/logger => ../go-shared/logger
    github.com/vhvplatform/go-shared/mongodb => ../go-shared/mongodb
)
```

### Step 6: Test Local Run
```bash
# Start MongoDB (Docker)
docker run -d -p 27017:27017 --name mongodb mongo:7

# Run application
go run cmd/api/main.go

# Hoặc dùng Makefile
make run
```

## 🐳 Docker Deployment

### Local Development với Docker

```bash
# Start tất cả services
docker-compose up -d

# Check logs
docker-compose logs -f api

# Stop services
docker-compose down
```

### Production Docker Build

```bash
# Build production image
docker build -t vhv-platform-api:v1.0.0 .

# Tag cho registry
docker tag vhv-platform-api:v1.0.0 your-registry.com/vhv-platform-api:v1.0.0

# Push to registry
docker push your-registry.com/vhv-platform-api:v1.0.0
```

## ☁️ Cloud Deployment Options

### Option 1: Deploy trên VPS (DigitalOcean, AWS EC2, etc.)

#### 1.1. SSH vào server
```bash
ssh user@your-server-ip
```

#### 1.2. Install Docker
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.23.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

#### 1.3. Clone code
```bash
# Clone repository
git clone https://github.com/vhvplatform/react-framework-api.git
cd react-framework-api

# Setup environment
cp .env.example .env
nano .env  # Update production values
```

#### 1.4. Run với Docker
```bash
# Start services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

#### 1.5. Setup Nginx Reverse Proxy
```bash
# Install Nginx
sudo apt update
sudo apt install nginx

# Create nginx config
sudo nano /etc/nginx/sites-available/vhv-api
```

Nginx config:
```nginx
server {
    listen 80;
    server_name api.vhvplatform.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/vhv-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Setup SSL với Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.vhvplatform.com
```

### Option 2: Deploy trên Railway.app

#### 2.1. Create `railway.json`
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "Dockerfile"
  },
  "deploy": {
    "startCommand": "./api",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

#### 2.2. Deploy
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway up
```

### Option 3: Deploy trên Fly.io

#### 3.1. Create `fly.toml`
```toml
app = "vhv-platform-api"
primary_region = "sin"

[build]
  dockerfile = "Dockerfile"

[env]
  APP_PORT = "8080"

[[services]]
  http_checks = []
  internal_port = 8080
  protocol = "tcp"

  [[services.ports]]
    force_https = true
    handlers = ["http"]
    port = 80

  [[services.ports]]
    handlers = ["tls", "http"]
    port = 443
```

#### 3.2. Deploy
```bash
# Install flyctl
curl -L https://fly.io/install.sh | sh

# Login
fly auth login

# Launch app
fly launch

# Deploy
fly deploy

# Set secrets
fly secrets set JWT_SECRET=your-secret-key
fly secrets set MONGODB_URI=your-mongodb-uri
```

### Option 4: Deploy trên Heroku

#### 4.1. Create `heroku.yml`
```yaml
build:
  docker:
    web: Dockerfile
```

#### 4.2. Create `Procfile`
```
web: ./api
```

#### 4.3. Deploy
```bash
# Install Heroku CLI
curl https://cli-assets.heroku.com/install.sh | sh

# Login
heroku login

# Create app
heroku create vhv-platform-api

# Set stack to container
heroku stack:set container

# Set config
heroku config:set JWT_SECRET=your-secret
heroku config:set MONGODB_URI=your-mongodb-uri

# Push to Heroku
git push heroku main
```

## 🗄️ Database Setup

### Option 1: MongoDB Cloud (MongoDB Atlas)

```bash
# 1. Tạo free cluster tại https://www.mongodb.com/cloud/atlas

# 2. Get connection string
MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/vhv_platform"

# 3. Update .env
nano .env
# Set MONGODB_URI=mongodb+srv://...
```

### Option 2: Self-hosted MongoDB

```bash
# Docker
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -v mongodb_data:/data/db \
  mongo:7

# Hoặc install trực tiếp
# Ubuntu/Debian
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
```

## 🔐 Security Checklist

### Production Environment

- [ ] Đổi `JWT_SECRET` thành random string 32+ characters
- [ ] Set `APP_ENV=production`
- [ ] Disable Mongo Express trong production
- [ ] Enable HTTPS/SSL
- [ ] Setup firewall (chỉ mở port 80, 443)
- [ ] Restrict CORS origins
- [ ] Enable rate limiting
- [ ] Setup monitoring và logging
- [ ] Backup database định kỳ
- [ ] Use secrets manager (AWS Secrets Manager, etc.)

### Generate Secure JWT Secret
```bash
# Generate random 32-byte key
openssl rand -base64 32

# Hoặc
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## 📊 Monitoring

### Setup Logging
```bash
# View logs
docker-compose logs -f api

# Hoặc nếu chạy trực tiếp
tail -f /var/log/vhv-api.log
```

### Health Checks
```bash
# Health check endpoint
curl http://localhost:8080/health

# Version endpoint
curl http://localhost:8080/version
```

## 🔄 CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build Docker image
        run: docker build -t vhv-api .
      
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /app/vhv-platform-api
            git pull
            docker-compose up -d --build
```

## 📝 Troubleshooting

### Common Issues

#### 1. MongoDB connection failed
```bash
# Check MongoDB status
docker-compose ps mongodb

# View MongoDB logs
docker-compose logs mongodb

# Test connection
mongosh "mongodb://localhost:27017/vhv_platform"
```

#### 2. Port already in use
```bash
# Find process using port 8080
lsof -i :8080

# Kill process
kill -9 <PID>
```

#### 3. Go module issues
```bash
# Clean cache
go clean -modcache

# Re-download
go mod download
go mod tidy
```

## 🎯 Next Steps

1. ✅ Copy code từ Figma Make
2. ✅ Setup local development
3. ✅ Test API locally
4. ✅ Setup MongoDB (Atlas hoặc self-hosted)
5. ✅ Deploy to staging
6. ✅ Setup monitoring
7. ✅ Deploy to production
8. ✅ Setup CI/CD

## 📚 Resources

- [Go Documentation](https://go.dev/doc/)
- [Gin Framework](https://gin-gonic.com/)
- [MongoDB Go Driver](https://www.mongodb.com/docs/drivers/go/current/)
- [Docker Documentation](https://docs.docker.com/)
