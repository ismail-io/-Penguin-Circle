@echo off
REM Community Connection Platform - Setup Script for Windows
REM This script helps you get the platform running quickly

echo.
echo 🚀 Community Connection Platform - Setup Script
echo ============================================== 
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    echo    Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js version: 
node --version

echo ✅ npm version:
npm --version
echo.

echo ⚠️  Note: Using MongoDB
echo    1. Install locally: https://docs.mongodb.com/manual/installation/
echo    2. Or use MongoDB Atlas: https://www.mongodb.com/cloud/atlas
echo.

echo 📁 Setting up project structure...
echo.

REM Install backend dependencies
echo 1️⃣  Installing backend dependencies...
cd backend
call npm install
if %errorlevel% equ 0 (
    echo ✅ Backend dependencies installed
) else (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)
cd ..
echo.

REM Install frontend dependencies
echo 2️⃣  Installing frontend dependencies...
cd frontend
call npm install
if %errorlevel% equ 0 (
    echo ✅ Frontend dependencies installed
) else (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)
cd ..
echo.

REM Create backend .env file if it doesn't exist
if not exist backend\.env (
    echo 3️⃣  Creating backend .env file...
    copy backend\.env.example backend\.env
    echo ✅ Backend .env created (update with your MongoDB URI)
) else (
    echo ✅ Backend .env already exists
)
echo.

echo ============================================== 
echo ✨ Setup Complete!
echo ============================================== 
echo.
echo 📚 Next Steps:
echo.
echo 1. Update backend\.env with your MongoDB connection string
echo    - Local MongoDB: mongodb://localhost:27017/community-connection
echo    - MongoDB Atlas: mongodb+srv://user:pass@cluster.mongodb.net/community-connection
echo.
echo 2. Start the backend (Terminal 1):
echo    cd backend
echo    npm run dev
echo.
echo 3. Start the frontend (Terminal 2):
echo    cd frontend
echo    npm start
echo.
echo 4. Open browser:
echo    http://localhost:3000
echo.
echo 5. Register and start using the platform!
echo.
echo 📖 Documentation:
echo    - QUICK_START.md - 5-minute setup guide
echo    - README.md - Complete documentation
echo    - ARCHITECTURE.md - System design
echo    - API_DOCUMENTATION.md - API reference
echo.
echo 🎉 Happy building!
echo.
pause
