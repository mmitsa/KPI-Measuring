#!/bin/bash

# Development Environment Setup Script
# نص إعداد بيئة التطوير

set -e

echo "🚀 Setting up Government Performance Management System Development Environment"
echo "============================================================================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
echo -e "${YELLOW}Checking prerequisites...${NC}"

# Check .NET SDK
if ! command -v dotnet &> /dev/null; then
    echo "❌ .NET SDK 8.0 is not installed"
    echo "Install from: https://dotnet.microsoft.com/download"
    exit 1
fi
echo -e "${GREEN}✅ .NET SDK $(dotnet --version) found${NC}"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    echo "Install from: https://nodejs.org/"
    exit 1
fi
echo -e "${GREEN}✅ Node.js $(node --version) found${NC}"

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "⚠️  Docker is not installed (optional)"
else
    echo -e "${GREEN}✅ Docker $(docker --version | cut -d ' ' -f3) found${NC}"
fi

# Setup Backend
echo -e "\n${YELLOW}Setting up Backend...${NC}"
cd backend

# Restore packages
echo "Restoring NuGet packages..."
dotnet restore

# Build
echo "Building backend..."
dotnet build --configuration Debug

# Setup Database (if Docker available)
if command -v docker &> /dev/null; then
    echo -e "\n${YELLOW}Setting up SQL Server in Docker...${NC}"
    docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=YourStrong!Passw0rd" \
        -p 1433:1433 --name sqlserver-dev -d \
        mcr.microsoft.com/mssql/server:2019-latest || echo "Container already exists"
    
    echo "Waiting for SQL Server to start..."
    sleep 10
    
    # Run migrations
    echo "Running database migrations..."
    cd src/PerformanceSystem.Infrastructure
    dotnet ef database update --context PerformanceDbContext
    cd ../..
fi

cd ..

# Setup Frontend
echo -e "\n${YELLOW}Setting up Frontend...${NC}"
cd frontend

# Install dependencies
echo "Installing npm packages..."
npm install

# Create .env.local
if [ ! -f .env.local ]; then
    echo "Creating .env.local..."
    cp ../.env.example .env.local
fi

cd ..

# Create logs directory
mkdir -p logs

echo -e "\n${GREEN}=============================================================================${NC}"
echo -e "${GREEN}✅ Development environment setup complete!${NC}"
echo -e "\n${YELLOW}Next steps:${NC}"
echo "1. Start backend:"
echo "   cd backend/src/PerformanceSystem.API && dotnet run"
echo ""
echo "2. Start frontend:"
echo "   cd frontend && npm run dev"
echo ""
echo "3. Access the application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: https://localhost:5001"
echo "   API Docs: https://localhost:5001/swagger"
echo ""
echo "4. Test accounts:"
echo "   Username: admin     | Password: Admin@123"
echo "   Username: john.doe  | Password: Employee@123"
echo ""
echo -e "${GREEN}Happy coding! 🎉${NC}"
