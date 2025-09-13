"""Extracted account data model."""

from datetime import datetime
from decimal import Decimal
from typing import Optional, TYPE_CHECKING
from sqlmodel import SQLModel, Field, Relationship

if TYPE_CHECKING:
    from ...documents.models.document_model import Document


class ExtractedAccount(SQLModel, table=True):
    """Model for account information extracted from financial documents."""
    
    id: Optional[int] = Field(default=None, primary_key=True)
    document_id: int = Field(foreign_key="document.id", index=True)
    
    # Account details
    account_name: str
    account_number: Optional[str] = None
    account_type: Optional[str] = None  # checking, savings, credit, etc.
    balance: Optional[Decimal] = Field(default=None, decimal_places=2)
    
    # Review status
    is_reviewed: bool = Field(default=False)
    reviewed_timestamp: Optional[datetime] = None
    
    # Confidence and extraction metadata
    extraction_confidence: Optional[float] = Field(default=None, ge=0.0, le=1.0)
    raw_text: Optional[str] = None  # Original OCR text for this account
    
    # Relationships
    document: "Document" = Relationship(back_populates="extracted_accounts")
