#!/bin/bash

# Community Connection Platform - Setup Script
# This script helps you get the platform running quickly

echo "🚀 Community Connection Platform - Setup Script"
echo "=============================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Check if MongoDB is available
if command -v mongod &> /dev/null; then
    echo "✅ MongoDB found locally"
else
    echo "⚠️  Local MongoDB not found"
    echo "   Options:"
    echo "   1. Install MongoDB locally: https://docs.mongodb.com/manual/installation/"
    echo "   2. Use MongoDB Atlas: https://www.mongodb.com/cloud/atlas"
    echo ""
fi

echo "📁 Setting up project structure..."
echo ""

# Install backend dependencies
echo "1️⃣  Installing backend dependencies..."
cd backend
npm install
if [ $? -eq 0 ]; then
    echo "✅ Backend dependencies installed"
else
    echo "❌ Failed to install backend dependencies"
    exit 1
fi
cd ..
echo ""

# Install frontend dependencies
echo "2️⃣  Installing frontend dependencies..."
cd frontend
npm install
if [ $? -eq 0 ]; then
    echo "✅ Frontend dependencies installed"
else
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi
cd ..
echo ""

# Create backend .env file if it doesn't exist
if [ ! -f backend/.env ]; then
    echo "3️⃣  Creating backend .env file..."
    cp backend/.env.example backend/.env
    echo "✅ Backend .env created (update with your MongoDB URI)"
else
    echo "✅ Backend .env already exists"
fi
echo ""

echo "=============================================="
echo "✨ Setup Complete!"
echo "=============================================="
echo ""
echo "📚 Next Steps:"
echo ""
echo "1. Update backend/.env with your MongoDB connection string"
echo "   - Local MongoDB: mongodb://localhost:27017/community-connection"
echo "   - MongoDB Atlas: mongodb+srv://user:pass@cluster.mongodb.net/community-connection"
echo ""
echo "2. Start the backend (Terminal 1):"
echo "   cd backend"
echo "   npm run dev"
echo ""
echo "3. Start the frontend (Terminal 2):"
echo "   cd frontend"
echo "   npm start"
echo ""
echo "4. Open browser:"
echo "   http://localhost:3000"
echo ""
echo "5. Register and start using the platform!"
echo ""
echo "📖 Documentation:"
echo "   - QUICK_START.md - 5-minute setup guide"
echo "   - README.md - Complete documentation"
echo "   - ARCHITECTURE.md - System design"
echo "   - API_DOCUMENTATION.md - API reference"
echo ""
echo "🎉 Happy building!"
