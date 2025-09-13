"""Configuration settings for Chronicle."""

import os
from typing import Optional
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings."""
    
    # Database
    database_url: str = "sqlite:///./chronicle.db"
    
    # Gemini API
    gemini_api_key: Optional[str] = None
    gemini_model: str = "gemini-1.5-flash"
    
    # API Settings
    api_title: str = "Chronicle Financial Document Processor"
    api_description: str = "API for processing and analyzing financial documents with AI-powered insights"
    api_version: str = "1.0.0"
    
    # CORS
    allowed_origins: list[str] = ["http://localhost:3000", "http://localhost:5173"]
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


# Global settings instance
settings = Settings()

# Validate Gemini API key on startup
def validate_gemini_config() -> bool:
    """Check if Gemini API is properly configured."""
    if not settings.gemini_api_key:
        print("⚠️  Warning: GEMINI_API_KEY not set. AI analysis will use mock data.")
        return False
    return True
