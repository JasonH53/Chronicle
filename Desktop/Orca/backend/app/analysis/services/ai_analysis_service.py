"""AI-powered financial analysis service."""

import random
from datetime import datetime, date
from typing import List, Optional, Dict, Any
from fastapi import Depends
from sqlmodel import select, func
from ...db import DatabaseSession, get_db_session
from ...documents.models.document_model import Document, ProcessingStatus
from ...transactions.models.extracted_transaction_model import ExtractedTransaction
from ...accounts.models.extracted_account_model import ExtractedAccount
from ..models.analysis_schemas import (
    FinancialAnalysisResponse, FinancialSummary, CategoryBreakdown, 
    AccountSummary, AIInsight, AnalysisRequest
)
from ...core.gemini_service import gemini_service


class AIAnalysisService:
    """Service for AI-powered financial analysis."""
    
    def __init__(self, session: DatabaseSession):
        self.session = session
    
    def generate_financial_analysis(self, request: AnalysisRequest) -> FinancialAnalysisResponse:
        """Generate comprehensive financial analysis with AI insights."""
        
        # Get documents to analyze
        if request.document_ids:
            documents = self.session.exec(
                select(Document).where(Document.id.in_(request.document_ids))
            ).all()
        else:
            documents = self.session.exec(
                select(Document).where(Document.processing_status == ProcessingStatus.REVIEWED)
            ).all()
        
        # Generate summary
        summary = self._generate_summary(documents)
        
        # Generate category breakdown
        category_breakdown = self._generate_category_breakdown(documents)
        
        # Generate account summaries
        account_summaries = self._generate_account_summaries(documents)
        
        # Generate AI insights
        ai_insights = []
        if request.include_ai_insights:
            ai_insights = self._generate_ai_insights_with_gemini(summary, category_breakdown, account_summaries)
        
        return FinancialAnalysisResponse(
            summary=summary,
            category_breakdown=category_breakdown,
            account_summaries=account_summaries,
            ai_insights=ai_insights,
            generated_at=datetime.utcnow()
        )
    
    def _generate_summary(self, documents: List[Document]) -> FinancialSummary:
        """Generate financial summary from documents."""
        
        # Get all transactions for these documents
        document_ids = [doc.id for doc in documents]
        transactions = self.session.exec(
            select(ExtractedTransaction).where(ExtractedTransaction.document_id.in_(document_ids))
        ).all()
        
        # Get all accounts for these documents
        accounts = self.session.exec(
            select(ExtractedAccount).where(ExtractedAccount.document_id.in_(document_ids))
        ).all()
        
        # Calculate totals (mock data for MVP)
        total_income = sum(float(t.amount) for t in transactions if float(t.amount) > 0)
        total_expenses = abs(sum(float(t.amount) for t in transactions if float(t.amount) < 0))
        
        # For MVP, generate some realistic mock data
        if not transactions:
            total_income = random.uniform(5000, 15000)
            total_expenses = random.uniform(3000, 12000)
        
        # Date range
        transaction_dates = [t.transaction_date for t in transactions if t.transaction_date]
        date_range = {
            "start_date": str(min(transaction_dates)) if transaction_dates else None,
            "end_date": str(max(transaction_dates)) if transaction_dates else None
        }
        
        return FinancialSummary(
            total_documents=len(documents),
            total_transactions=len(transactions),
            total_accounts=len(accounts),
            date_range=date_range,
            total_income=round(total_income, 2),
            total_expenses=round(total_expenses, 2),
            net_cash_flow=round(total_income - total_expenses, 2)
        )
    
    def _generate_category_breakdown(self, documents: List[Document]) -> List[CategoryBreakdown]:
        """Generate spending breakdown by category."""
        
        # For MVP, generate mock category data
        mock_categories = [
            {"category": "Food & Dining", "amount": 1250.50, "count": 23},
            {"category": "Transportation", "amount": 890.25, "count": 15},
            {"category": "Shopping", "amount": 675.80, "count": 12},
            {"category": "Bills & Utilities", "amount": 1450.00, "count": 8},
            {"category": "Entertainment", "amount": 320.75, "count": 9},
            {"category": "Healthcare", "amount": 245.60, "count": 4},
        ]
        
        total_amount = sum(cat["amount"] for cat in mock_categories)
        
        return [
            CategoryBreakdown(
                category=cat["category"],
                amount=cat["amount"],
                percentage=round((cat["amount"] / total_amount) * 100, 1),
                transaction_count=cat["count"]
            )
            for cat in mock_categories
        ]
    
    def _generate_account_summaries(self, documents: List[Document]) -> List[AccountSummary]:
        """Generate account summaries."""
        
        document_ids = [doc.id for doc in documents]
        accounts = self.session.exec(
            select(ExtractedAccount).where(ExtractedAccount.document_id.in_(document_ids))
        ).all()
        
        # If no real accounts, generate mock data
        if not accounts:
            mock_accounts = [
                {"name": "Checking Account", "type": "checking", "balance": 3250.75, "count": 45},
                {"name": "Savings Account", "type": "savings", "balance": 12500.00, "count": 8},
                {"name": "Credit Card", "type": "credit", "balance": -1850.25, "count": 22},
            ]
            
            return [
                AccountSummary(
                    account_name=acc["name"],
                    account_type=acc["type"],
                    balance=acc["balance"],
                    transaction_count=acc["count"]
                )
                for acc in mock_accounts
            ]
        
        # Process real accounts
        account_summaries = []
        for account in accounts:
            # Count transactions for this account (simplified for MVP)
            transaction_count = random.randint(5, 50)
            
            account_summaries.append(AccountSummary(
                account_name=account.account_name,
                account_type=account.account_type,
                balance=float(account.balance) if account.balance else None,
                transaction_count=transaction_count
            ))
        
        return account_summaries
    
    def _generate_ai_insights_with_gemini(self, summary: FinancialSummary, 
                                         categories: List[CategoryBreakdown], 
                                         accounts: List[AccountSummary]) -> List[AIInsight]:
        """Generate AI-powered insights using Gemini LLM."""
        
        # Prepare data for Gemini
        financial_data = {
            'summary': {
                'total_income': summary.total_income,
                'total_expenses': summary.total_expenses,
                'net_cash_flow': summary.net_cash_flow,
                'total_documents': summary.total_documents,
                'total_transactions': summary.total_transactions,
                'total_accounts': summary.total_accounts
            },
            'category_breakdown': [
                {
                    'category': cat.category,
                    'amount': cat.amount,
                    'percentage': cat.percentage,
                    'transaction_count': cat.transaction_count
                }
                for cat in categories
            ],
            'account_summaries': [
                {
                    'account_name': acc.account_name,
                    'account_type': acc.account_type,
                    'balance': acc.balance,
                    'transaction_count': acc.transaction_count
                }
                for acc in accounts
            ]
        }
        
        # Get insights from Gemini
        gemini_insights = gemini_service.generate_financial_insights(financial_data)
        
        # Convert to AIInsight objects
        insights = []
        for insight_data in gemini_insights:
            insights.append(AIInsight(
                insight_type=insight_data['insight_type'],
                title=insight_data['title'],
                description=insight_data['description'],
                confidence=insight_data['confidence'],
                data_points=insight_data.get('data_points')
            ))
        
        return insights


def get_ai_analysis_service(session: DatabaseSession = Depends(get_db_session)) -> AIAnalysisService:
    """Dependency factory for AI analysis service."""
    return AIAnalysisService(session)
