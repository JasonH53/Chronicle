#!/bin/bash

# Chronicle Setup Script

echo "📚 Setting up Chronicle Financial Document Processor..."

# Check Python version
python_version=$(python3 --version 2>/dev/null || python --version 2>/dev/null)
echo "📍 Using Python: $python_version"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Setup backend with virtual environment
echo "📦 Setting up backend with virtual environment..."
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "🔧 Creating Python virtual environment..."
    python3 -m venv venv 2>/dev/null || python -m venv venv
fi

# Activate virtual environment and install dependencies
echo "📦 Installing backend dependencies..."
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
deactivate

cd ..

# Install frontend dependencies  
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Create uploads directory
mkdir -p backend/uploads

echo "✅ Setup complete!"
echo ""
echo "🚀 To start development:"
echo "  ./start.sh"
echo ""
echo "📚 Available commands:"
echo "  npm run dev          - Start both backend and frontend"
echo "  npm run backend:dev  - Start only backend"
echo "  npm run frontend:dev - Start only frontend"
echo "  npm test            - Run all tests"
echo ""
