"""Document service for business logic."""

from datetime import datetime
from typing import List, Optional
from fastapi import Depends, HTTPException
from sqlmodel import select
from ...db import DatabaseSession, get_db_session
from ..models.document_model import Document, ProcessingStatus
from ..models.schemas.document_schemas import DocumentCreate, DocumentUpdate
from ...transactions.models.extracted_transaction_model import ExtractedTransaction
from ...accounts.models.extracted_account_model import ExtractedAccount


class DocumentService:
    """Service class for document business logic."""
    
    def __init__(self, session: DatabaseSession):
        self.session = session
    
    def create_document(self, document_data: DocumentCreate, file_path: str) -> Document:
        """Create a new document record."""
        document = Document(
            filename=document_data.filename,
            file_path=file_path,
            file_size=document_data.file_size,
            mime_type=document_data.mime_type,
            processing_status=ProcessingStatus.UPLOADED
        )
        self.session.add(document)
        self.session.commit()
        self.session.refresh(document)
        return document
    
    def get_document(self, document_id: int) -> Optional[Document]:
        """Get document by ID."""
        statement = select(Document).where(Document.id == document_id)
        return self.session.exec(statement).first()
    
    def get_documents(self, skip: int = 0, limit: int = 100) -> List[Document]:
        """Get list of documents with pagination."""
        statement = select(Document).offset(skip).limit(limit)
        return list(self.session.exec(statement))
    
    def update_document(self, document_id: int, update_data: DocumentUpdate) -> Optional[Document]:
        """Update document with new data."""
        document = self.get_document(document_id)
        if not document:
            return None
        
        update_dict = update_data.model_dump(exclude_unset=True)
        for field, value in update_dict.items():
            setattr(document, field, value)
        
        if update_data.processing_status:
            document.processed_timestamp = datetime.utcnow()
        
        self.session.add(document)
        self.session.commit()
        self.session.refresh(document)
        return document
    
    def complete_document_review(self, document_id: int) -> Document:
        """Mark document as fully reviewed if all extracted data is reviewed."""
        document = self.get_document(document_id)
        if not document:
            raise HTTPException(status_code=404, detail="Document not found")
        
        # Check if all extracted transactions are reviewed
        unreviewed_transactions = self.session.exec(
            select(ExtractedTransaction).where(
                ExtractedTransaction.document_id == document_id,
                ExtractedTransaction.is_reviewed == False
            )
        ).all()
        
        # Check if all extracted accounts are reviewed
        unreviewed_accounts = self.session.exec(
            select(ExtractedAccount).where(
                ExtractedAccount.document_id == document_id,
                ExtractedAccount.is_reviewed == False
            )
        ).all()
        
        if unreviewed_transactions or unreviewed_accounts:
            raise HTTPException(
                status_code=400,
                detail=f"Cannot complete review: {len(unreviewed_transactions)} transactions and {len(unreviewed_accounts)} accounts remain unreviewed"
            )
        
        # Mark document as reviewed
        document.processing_status = ProcessingStatus.REVIEWED
        document.processed_timestamp = datetime.utcnow()
        
        self.session.add(document)
        self.session.commit()
        self.session.refresh(document)
        return document


def get_document_service(session: DatabaseSession = Depends(get_db_session)) -> DocumentService:
    """Dependency factory that returns a DocumentService instance."""
    return DocumentService(session)
