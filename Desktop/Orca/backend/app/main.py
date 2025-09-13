"""Main FastAPI application."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .db.database import create_db_and_tables
from .exception_handlers import internal_error_handler, general_exception_handler
from .core.exceptions import InternalError
from .core.config import settings, validate_gemini_config
from .documents.controllers import document_controller
from .analysis.controllers import analysis_controller

app = FastAPI(
    title=settings.api_title,
    description=settings.api_description,
    version=settings.api_version
)

# CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception handlers
app.add_exception_handler(InternalError, internal_error_handler)
app.add_exception_handler(Exception, general_exception_handler)

# Include routers
app.include_router(document_controller.router, prefix="/api")
app.include_router(analysis_controller.router, prefix="/api")

@app.on_event("startup")
def on_startup():
    """Initialize database and validate configuration on startup."""
    create_db_and_tables()
    validate_gemini_config()

@app.get("/")
def read_root():
    """Root endpoint."""
    return {"message": "Chronicle Financial Document Processor API", "version": "1.0.0"}

@app.get("/health")
def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}
