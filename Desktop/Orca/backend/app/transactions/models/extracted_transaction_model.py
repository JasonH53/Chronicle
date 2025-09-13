"""Extracted transaction data model."""

from datetime import datetime, date
from decimal import Decimal
from typing import Optional, TYPE_CHECKING
from sqlmodel import SQLModel, Field, Relationship

if TYPE_CHECKING:
    from ...documents.models.document_model import Document


class ExtractedTransaction(SQLModel, table=True):
    """Model for transactions extracted from financial documents."""
    
    id: Optional[int] = Field(default=None, primary_key=True)
    document_id: int = Field(foreign_key="document.id", index=True)
    
    # Transaction details
    transaction_date: Optional[date] = None
    description: str
    amount: Decimal = Field(decimal_places=2)
    transaction_type: Optional[str] = None  # debit, credit, etc.
    category: Optional[str] = None
    
    # Review status
    is_reviewed: bool = Field(default=False)
    reviewed_timestamp: Optional[datetime] = None
    
    # Confidence and extraction metadata
    extraction_confidence: Optional[float] = Field(default=None, ge=0.0, le=1.0)
    raw_text: Optional[str] = None  # Original OCR text for this transaction
    
    # Relationships
    document: "Document" = Relationship(back_populates="extracted_transactions")
