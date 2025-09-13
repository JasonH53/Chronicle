"""Document controller for API endpoints."""

import os
import uuid
from typing import List
from fastapi import APIRouter, Depends, File, UploadFile, HTTPException, status
from fastapi.responses import JSONResponse

from ..services.document_service import DocumentService, get_document_service
from ..models.schemas.document_schemas import DocumentCreate, DocumentResponse

router = APIRouter(prefix="/documents", tags=["documents"])

# Upload directory
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED)
def upload_document(
    file: UploadFile = File(...),
    document_service: DocumentService = Depends(get_document_service),
):
    """Upload a financial document for processing."""
    # Validate file type
    allowed_types = ["application/pdf", "image/jpeg", "image/png", "image/tiff"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail=f"File type {file.content_type} not supported. Allowed types: {allowed_types}"
        )
    
    # Generate unique filename
    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    # Save file
    try:
        with open(file_path, "wb") as buffer:
            content = file.file.read()
            buffer.write(content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")
    
    # Create document record
    document_data = DocumentCreate(
        filename=file.filename,
        file_size=len(content),
        mime_type=file.content_type
    )
    
    document = document_service.create_document(document_data, file_path)
    return DocumentResponse.model_validate(document)


@router.get("/", response_model=List[DocumentResponse])
def get_documents(
    skip: int = 0,
    limit: int = 100,
    document_service: DocumentService = Depends(get_document_service),
):
    """Get list of documents."""
    documents = document_service.get_documents(skip=skip, limit=limit)
    return [DocumentResponse.model_validate(doc) for doc in documents]


@router.get("/{document_id}", response_model=DocumentResponse)
def get_document(
    document_id: int,
    document_service: DocumentService = Depends(get_document_service),
):
    """Get document by ID."""
    document = document_service.get_document(document_id)
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    return DocumentResponse.model_validate(document)


@router.post("/{document_id}/complete-review")
def complete_document_review(
    document_id: int,
    document_service: DocumentService = Depends(get_document_service),
):
    """Mark document as fully reviewed once all extracted data has been reviewed."""
    document = document_service.complete_document_review(document_id)
    return {
        "message": "Document review completed successfully",
        "document_id": document_id,
        "status": document.processing_status,
        "completed_at": document.processed_timestamp
    }


@router.post("/{document_id}/process")
def process_document(
    document_id: int,
    document_service: DocumentService = Depends(get_document_service),
):
    """Trigger OCR processing for a document (mock implementation for MVP)."""
    document = document_service.get_document(document_id)
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    # Mock OCR processing - in real implementation, this would trigger actual OCR
    from ..models.schemas.document_schemas import DocumentUpdate
    from ..models.document_model import ProcessingStatus
    
    update_data = DocumentUpdate(
        processing_status=ProcessingStatus.EXTRACTED,
        ocr_text="Mock OCR text extracted from document",
        extraction_metadata='{"confidence": 0.95, "pages": 1}'
    )
    
    updated_document = document_service.update_document(document_id, update_data)
    
    return {
        "message": "Document processing completed",
        "document_id": document_id,
        "status": updated_document.processing_status
    }
