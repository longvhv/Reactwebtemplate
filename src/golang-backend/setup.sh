#!/bin/bash

# Setup script for VHV Platform API
# This script helps you set up the development environment

set -e

echo "========================================="
echo "VHV Platform API - Setup Script"
echo "========================================="
echo ""

# Check Go installation
echo "Checking Go installation..."
if ! command -v go &> /dev/null; then
    echo "❌ Go is not installed!"
    echo "Please install Go 1.21+ from https://golang.org/dl/"
    exit 1
fi

GO_VERSION=$(go version | awk '{print $3}')
echo "✓ Go is installed: $GO_VERSION"
echo ""

# Check Docker installation
echo "Checking Docker installation..."
if ! command -v docker &> /dev/null; then
    echo "⚠️  Docker is not installed"
    echo "Install from https://docs.docker.com/get-docker/"
    DOCKER_INSTALLED=false
else
    echo "✓ Docker is installed"
    DOCKER_INSTALLED=true
fi
echo ""

# Check Docker Compose
if [ "$DOCKER_INSTALLED" = true ]; then
    echo "Checking Docker Compose..."
    if ! command -v docker-compose &> /dev/null; then
        echo "⚠️  Docker Compose is not installed"
        DOCKER_COMPOSE_INSTALLED=false
    else
        echo "✓ Docker Compose is installed"
        DOCKER_COMPOSE_INSTALLED=true
    fi
    echo ""
fi

# Create .env file
echo "Setting up environment variables..."
if [ ! -f .env ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
    
    # Generate random JWT secret
    JWT_SECRET=$(openssl rand -base64 32)
    
    # Update JWT_SECRET in .env
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s/your-super-secret-key-change-in-production-min-32-chars-required/$JWT_SECRET/" .env
    else
        # Linux
        sed -i "s/your-super-secret-key-change-in-production-min-32-chars-required/$JWT_SECRET/" .env
    fi
    
    echo "✓ .env file created with random JWT secret"
else
    echo "✓ .env file already exists"
fi
echo ""

# Download Go dependencies
echo "Downloading Go dependencies..."
go mod download
go mod tidy
echo "✓ Go dependencies downloaded"
echo ""

# Install development tools
echo "Installing development tools..."

# Install Air for hot reload
if ! command -v air &> /dev/null; then
    echo "Installing Air (hot reload)..."
    go install github.com/cosmtrek/air@latest
    echo "✓ Air installed"
else
    echo "✓ Air already installed"
fi

# Install golangci-lint
if ! command -v golangci-lint &> /dev/null; then
    echo "Installing golangci-lint..."
    go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest
    echo "✓ golangci-lint installed"
else
    echo "✓ golangci-lint already installed"
fi
echo ""

# Create necessary directories
echo "Creating directories..."
mkdir -p tmp
mkdir -p logs
mkdir -p uploads
echo "✓ Directories created"
echo ""

# Check MongoDB
echo "Checking MongoDB..."
echo "Choose MongoDB option:"
echo "1) Use Docker MongoDB (recommended for development)"
echo "2) Use local MongoDB installation"
echo "3) Use MongoDB Atlas (cloud)"
echo "4) Skip MongoDB setup"
read -p "Enter choice [1-4]: " mongo_choice

case $mongo_choice in
    1)
        if [ "$DOCKER_COMPOSE_INSTALLED" = true ]; then
            echo "Starting MongoDB with Docker..."
            docker-compose up -d mongodb
            echo "✓ MongoDB started on localhost:27017"
            
            # Wait for MongoDB to be ready
            echo "Waiting for MongoDB to be ready..."
            sleep 5
            
            # Run migrations
            if command -v mongosh &> /dev/null; then
                echo "Running database migrations..."
                chmod +x migrations/run-migrations.sh
                ./migrations/run-migrations.sh
                echo "✓ Database initialized"
            else
                echo "⚠️  mongosh not found. Skipping migrations."
                echo "Install mongosh to run migrations automatically"
            fi
        else
            echo "❌ Docker Compose not available. Please install Docker first."
        fi
        ;;
    2)
        echo "Using local MongoDB installation"
        echo "Make sure MongoDB is running on localhost:27017"
        echo "You can run migrations with: ./migrations/run-migrations.sh"
        ;;
    3)
        echo "Using MongoDB Atlas"
        echo "Please update MONGODB_URI in .env file with your Atlas connection string"
        echo "Example: mongodb+srv://username:password@cluster.mongodb.net/vhv_platform"
        read -p "Press Enter to continue..."
        ;;
    4)
        echo "Skipping MongoDB setup"
        ;;
    *)
        echo "Invalid choice. Skipping MongoDB setup"
        ;;
esac
echo ""

# Build the application
echo "Building application..."
go build -o bin/api cmd/api/main.go
if [ $? -eq 0 ]; then
    echo "✓ Application built successfully"
else
    echo "❌ Build failed"
    exit 1
fi
echo ""

# Setup complete
echo "========================================="
echo "✓ Setup completed successfully!"
echo "========================================="
echo ""
echo "Next steps:"
echo ""
echo "1. Review and update .env file if needed:"
echo "   nano .env"
echo ""
echo "2. Start the development server:"
echo "   make run"
echo "   or"
echo "   go run cmd/api/main.go"
echo ""
echo "3. For hot reload during development:"
echo "   make dev"
echo "   or"
echo "   air"
echo ""
echo "4. Start with Docker (recommended):"
echo "   docker-compose up -d"
echo ""
echo "5. Test the API:"
echo "   curl http://localhost:8080/health"
echo ""
echo "6. View API documentation:"
echo "   cat API_TESTING.md"
echo ""
echo "Happy coding! 🚀"
