"""Analysis request/response schemas."""

from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel


class FinancialSummary(BaseModel):
    """Schema for financial summary data."""
    total_documents: int
    total_transactions: int
    total_accounts: int
    date_range: Dict[str, Optional[str]]  # start_date, end_date
    total_income: float
    total_expenses: float
    net_cash_flow: float


class CategoryBreakdown(BaseModel):
    """Schema for spending by category."""
    category: str
    amount: float
    percentage: float
    transaction_count: int


class AccountSummary(BaseModel):
    """Schema for account summary."""
    account_name: str
    account_type: Optional[str]
    balance: Optional[float]
    transaction_count: int


class AIInsight(BaseModel):
    """Schema for AI-generated insights."""
    insight_type: str  # "trend", "anomaly", "recommendation", "observation"
    title: str
    description: str
    confidence: float  # 0.0 to 1.0
    data_points: Optional[Dict[str, Any]] = None


class FinancialAnalysisResponse(BaseModel):
    """Complete financial analysis response."""
    summary: FinancialSummary
    category_breakdown: List[CategoryBreakdown]
    account_summaries: List[AccountSummary]
    ai_insights: List[AIInsight]
    generated_at: datetime
    
    class Config:
        from_attributes = True


class AnalysisRequest(BaseModel):
    """Request for financial analysis."""
    document_ids: Optional[List[int]] = None  # If None, analyze all documents
    include_ai_insights: bool = True
    analysis_type: str = "comprehensive"  # "summary", "detailed", "comprehensive"
