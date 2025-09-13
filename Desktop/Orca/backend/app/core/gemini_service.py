"""Gemini LLM service for AI-powered financial analysis."""

import json
import logging
from typing import List, Dict, Any, Optional
from datetime import datetime

try:
    import google.generativeai as genai
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False
    genai = None

from .config import settings

logger = logging.getLogger(__name__)


class GeminiService:
    """Service for interacting with Google Gemini API."""
    
    def __init__(self):
        self.model = None
        self.is_configured = False
        
        if GEMINI_AVAILABLE and settings.gemini_api_key:
            try:
                genai.configure(api_key=settings.gemini_api_key)
                self.model = genai.GenerativeModel(settings.gemini_model)
                self.is_configured = True
                logger.info(f"✅ Gemini API configured with model: {settings.gemini_model}")
            except Exception as e:
                logger.error(f"❌ Failed to configure Gemini API: {e}")
                self.is_configured = False
        else:
            if not GEMINI_AVAILABLE:
                logger.warning("⚠️  google-generativeai package not installed")
            if not settings.gemini_api_key:
                logger.warning("⚠️  GEMINI_API_KEY not configured")
    
    def generate_financial_insights(self, financial_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Generate AI insights from financial data using Gemini."""
        
        if not self.is_configured:
            logger.warning("Gemini not configured, returning mock insights")
            return self._generate_mock_insights(financial_data)
        
        try:
            # Prepare the prompt for Gemini
            prompt = self._create_financial_analysis_prompt(financial_data)
            
            # Generate response from Gemini
            response = self.model.generate_content(prompt)
            
            # Parse the response
            insights = self._parse_gemini_response(response.text)
            
            logger.info(f"✅ Generated {len(insights)} insights from Gemini")
            return insights
            
        except Exception as e:
            logger.error(f"❌ Gemini API error: {e}")
            logger.info("Falling back to mock insights")
            return self._generate_mock_insights(financial_data)
    
    def _create_financial_analysis_prompt(self, financial_data: Dict[str, Any]) -> str:
        """Create a detailed prompt for financial analysis."""
        
        summary = financial_data.get('summary', {})
        categories = financial_data.get('category_breakdown', [])
        accounts = financial_data.get('account_summaries', [])
        
        prompt = f"""
You are a financial advisor AI analyzing a user's financial documents. Based on the following data, provide 4-6 actionable insights in JSON format.

FINANCIAL DATA:
- Total Income: ${summary.get('total_income', 0):,.2f}
- Total Expenses: ${summary.get('total_expenses', 0):,.2f}
- Net Cash Flow: ${summary.get('net_cash_flow', 0):,.2f}
- Documents Analyzed: {summary.get('total_documents', 0)}
- Transactions: {summary.get('total_transactions', 0)}

SPENDING BY CATEGORY:
"""
        
        for cat in categories[:5]:  # Top 5 categories
            prompt += f"- {cat['category']}: ${cat['amount']:,.2f} ({cat['percentage']}%)\n"
        
        prompt += f"""
ACCOUNTS:
"""
        for acc in accounts[:3]:  # Top 3 accounts
            balance = acc.get('balance', 0)
            prompt += f"- {acc['account_name']} ({acc.get('account_type', 'unknown')}): ${balance:,.2f}\n"
        
        prompt += """

Please provide insights as a JSON array with this exact structure:
[
  {
    "insight_type": "trend|anomaly|recommendation|observation",
    "title": "Brief insight title",
    "description": "Detailed explanation and actionable advice",
    "confidence": 0.85
  }
]

Focus on:
1. Cash flow analysis and recommendations
2. Spending pattern observations
3. Budget optimization suggestions
4. Account balance health
5. Unusual spending or income patterns
6. Financial goal recommendations

Provide practical, actionable advice. Be specific with numbers when relevant. Keep descriptions under 200 characters.
"""
        
        return prompt
    
    def _parse_gemini_response(self, response_text: str) -> List[Dict[str, Any]]:
        """Parse Gemini's JSON response into insights."""
        
        try:
            # Try to extract JSON from the response
            response_text = response_text.strip()
            
            # Remove markdown code blocks if present
            if response_text.startswith('```json'):
                response_text = response_text[7:]
            if response_text.startswith('```'):
                response_text = response_text[3:]
            if response_text.endswith('```'):
                response_text = response_text[:-3]
            
            response_text = response_text.strip()
            
            # Parse JSON
            insights_data = json.loads(response_text)
            
            # Validate and format insights
            insights = []
            for item in insights_data:
                if isinstance(item, dict) and all(key in item for key in ['insight_type', 'title', 'description']):
                    insight = {
                        'insight_type': item['insight_type'],
                        'title': item['title'],
                        'description': item['description'],
                        'confidence': float(item.get('confidence', 0.8)),
                        'data_points': item.get('data_points')
                    }
                    insights.append(insight)
            
            return insights
            
        except (json.JSONDecodeError, KeyError, ValueError) as e:
            logger.error(f"Failed to parse Gemini response: {e}")
            logger.debug(f"Raw response: {response_text}")
            return []
    
    def _generate_mock_insights(self, financial_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Generate mock insights when Gemini is not available."""
        
        summary = financial_data.get('summary', {})
        net_cash_flow = summary.get('net_cash_flow', 0)
        total_expenses = summary.get('total_expenses', 0)
        
        insights = []
        
        # Cash flow insight
        if net_cash_flow > 0:
            insights.append({
                'insight_type': 'observation',
                'title': 'Positive Cash Flow',
                'description': f'You have a positive net cash flow of ${net_cash_flow:,.2f}. This indicates healthy financial management with income exceeding expenses.',
                'confidence': 0.95
            })
        else:
            insights.append({
                'insight_type': 'recommendation',
                'title': 'Negative Cash Flow Alert',
                'description': f'Your expenses exceed income by ${abs(net_cash_flow):,.2f}. Consider reviewing your spending patterns and identifying areas to reduce costs.',
                'confidence': 0.90
            })
        
        # Add mock category insight
        categories = financial_data.get('category_breakdown', [])
        if categories:
            top_category = max(categories, key=lambda x: x['amount'])
            insights.append({
                'insight_type': 'trend',
                'title': 'Top Spending Category',
                'description': f'Your highest spending category is {top_category["category"]} at ${top_category["amount"]:,.2f} ({top_category["percentage"]}% of total expenses).',
                'confidence': 0.98
            })
        
        # Add AI disclaimer
        insights.append({
            'insight_type': 'observation',
            'title': 'Mock Analysis Mode',
            'description': 'These are sample insights. Configure GEMINI_API_KEY for real AI-powered analysis.',
            'confidence': 1.0
        })
        
        return insights


# Global service instance
gemini_service = GeminiService()
