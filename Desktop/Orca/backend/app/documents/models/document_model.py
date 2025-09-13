"""Document data model for financial document processing."""

from datetime import datetime
from enum import Enum
from typing import Optional, List, TYPE_CHECKING
from sqlmodel import SQLModel, Field, Relationship

if TYPE_CHECKING:
    from ...transactions.models.extracted_transaction_model import ExtractedTransaction
    from ...accounts.models.extracted_account_model import ExtractedAccount


class ProcessingStatus(str, Enum):
    """Document processing status enumeration."""
    UPLOADED = "uploaded"
    PROCESSING = "processing"
    EXTRACTED = "extracted"
    REVIEWED = "reviewed"
    COMPLETED = "completed"
    FAILED = "failed"


class Document(SQLModel, table=True):
    """Document model for uploaded financial documents."""
    
    id: Optional[int] = Field(default=None, primary_key=True)
    filename: str = Field(index=True)
    file_path: str
    file_size: int
    mime_type: str
    processing_status: ProcessingStatus = Field(default=ProcessingStatus.UPLOADED)
    upload_timestamp: datetime = Field(default_factory=datetime.utcnow)
    processed_timestamp: Optional[datetime] = None
    
    # OCR and extraction metadata
    ocr_text: Optional[str] = None
    extraction_metadata: Optional[str] = None  # JSON string for additional metadata
    
    # Relationships
    extracted_transactions: List["ExtractedTransaction"] = Relationship(back_populates="document")
    extracted_accounts: List["ExtractedAccount"] = Relationship(back_populates="document")
