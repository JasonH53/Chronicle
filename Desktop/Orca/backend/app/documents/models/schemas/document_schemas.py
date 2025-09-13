"""Document request/response schemas."""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel
from ..document_model import ProcessingStatus


class DocumentCreate(BaseModel):
    """Schema for creating a new document."""
    filename: str
    file_size: int
    mime_type: str


class DocumentUpdate(BaseModel):
    """Schema for updating document status."""
    processing_status: Optional[ProcessingStatus] = None
    ocr_text: Optional[str] = None
    extraction_metadata: Optional[str] = None


class DocumentResponse(BaseModel):
    """Schema for document response."""
    id: int
    filename: str
    file_size: int
    mime_type: str
    processing_status: ProcessingStatus
    upload_timestamp: datetime
    processed_timestamp: Optional[datetime] = None
    
    class Config:
        from_attributes = True
