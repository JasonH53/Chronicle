# 📚 Chronicle Financial Document Processor

Chronicle is a modern financial document processing platform that extracts, analyzes, and manages financial data from uploaded documents using OCR and AI-powered insights.

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- pip (comes with Python)

### Setup & Installation

1. **Clone and setup the project:**
   ```bash
   git clone <repository-url>
   cd Chronicle
   ./setup.sh
   ```

2. **Start development servers:**
   ```bash
   ./start.sh
   ```
   
   Or manually:
   ```bash
   npm run dev
   ```

3. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## 📁 Project Structure

```
Chronicle/
├── backend/                 # FastAPI backend
│   ├── app/                # Main application package
│   │   ├── documents/      # Document processing module
│   │   ├── transactions/   # Transaction management module
│   │   ├── accounts/       # Account management module
│   │   ├── db/            # Database configuration
│   │   ├── core/          # Core utilities & exceptions
│   │   └── main.py        # FastAPI application entry point
│   ├── requirements.txt   # Python dependencies
│   └── venv/              # Virtual environment
├── frontend/               # React TypeScript frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── store/         # Redux state management
│   │   ├── services/      # API services
│   │   └── types/         # TypeScript definitions
│   └── package.json       # Node dependencies
├── package.json           # Root package.json with scripts
├── setup.sh              # Setup script
└── start.sh              # Development startup script
```

## 🎯 Features

### Current MVP Features
- **Document Upload**: Drag-and-drop interface for financial documents
- **OCR Processing**: Extract text and data from uploaded documents
- **Document Management**: View, track, and manage document processing status
- **Review Workflow**: Mark documents as reviewed when processing is complete
- **Real-time Updates**: Live status updates using Redux state management

### Supported File Types
- PDF documents
- Images: JPEG, PNG, TIFF

## 🛠 Development

### Available Scripts

```bash
# Development
npm run dev              # Start both backend and frontend
npm run backend:dev      # Start only backend (port 8000)
npm run frontend:dev     # Start only frontend (port 3000)

# Installation
npm run setup           # Full setup (equivalent to ./setup.sh)
npm run install:all     # Install all dependencies
npm run backend:install # Install backend dependencies
npm run frontend:install # Install frontend dependencies

# Testing
npm test               # Run all tests
npm run backend:test   # Run backend tests
npm run frontend:test  # Run frontend tests

# Production
npm run build          # Build frontend for production
```

### Backend Development

The backend uses a simple pip + virtual environment setup with:
- **Controllers**: Handle HTTP requests/responses
- **Services**: Contain business logic
- **Models**: Define data structures and database schemas

Key principles:
- Virtual environment for dependency isolation
- Dependency injection for services
- Global exception handling
- SQLModel for database operations
- FastAPI for REST API endpoints

To work on the backend:
```bash
cd backend
source venv/bin/activate  # Activate virtual environment
# Make your changes
python -m uvicorn software_factory.main:app --reload  # Test locally
deactivate  # When done
```

### Frontend Development

The frontend uses:
- **React 18** with TypeScript
- **Redux Toolkit** for state management
- **Axios** for API communication
- Modern React patterns with hooks

## 🗄 Database

Currently using SQLite for development. The database schema includes:
- **Documents**: Uploaded file metadata and processing status
- **ExtractedTransactions**: Financial transactions extracted from documents
- **ExtractedAccounts**: Account information extracted from documents

## 🔄 Workflow

1. **Upload**: Users upload financial documents via drag-and-drop
2. **Process**: Backend performs OCR extraction (mock implementation in MVP)
3. **Review**: Users can review extracted data
4. **Complete**: Mark documents as fully reviewed

## 🧪 Testing

```bash
# Run backend tests
cd backend && source venv/bin/activate && python -m pytest

# Run frontend tests  
cd frontend && npm test

# Or use the npm scripts
npm run backend:test
npm run frontend:test
npm test  # Run both
```

## 📝 API Documentation

When the backend is running, visit http://localhost:8000/docs for interactive API documentation.

### Key Endpoints

- `POST /api/documents/upload` - Upload a document
- `GET /api/documents/` - List all documents
- `GET /api/documents/{id}` - Get document details
- `POST /api/documents/{id}/process` - Process document with OCR
- `POST /api/documents/{id}/complete-review` - Mark document review as complete

## 🚧 Future Enhancements

The current MVP provides a foundation for:
- Real OCR integration (Tesseract, AWS Textract, etc.)
- Machine learning for transaction categorization
- Advanced financial analysis and reporting
- User authentication and multi-tenancy
- Document versioning and audit trails
- Integration with accounting systems

## 🤝 Contributing

1. Follow the established patterns in both backend and frontend
2. Write tests for new features
3. Update documentation as needed
4. Use the provided linting and formatting tools

## 📄 License

MIT License - see LICENSE file for details