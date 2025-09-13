"""AI Analysis controller for financial insights."""

from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status

from ..services.ai_analysis_service import AIAnalysisService, get_ai_analysis_service
from ..models.analysis_schemas import FinancialAnalysisResponse, AnalysisRequest

router = APIRouter(prefix="/analysis", tags=["ai-analysis"])


@router.post("/financial-summary", response_model=FinancialAnalysisResponse)
def generate_financial_analysis(
    request: AnalysisRequest = AnalysisRequest(),
    analysis_service: AIAnalysisService = Depends(get_ai_analysis_service),
):
    """Generate comprehensive AI-powered financial analysis."""
    try:
        analysis = analysis_service.generate_financial_analysis(request)
        return analysis
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate financial analysis: {str(e)}"
        )


@router.get("/financial-summary", response_model=FinancialAnalysisResponse)
def get_financial_analysis(
    document_ids: Optional[str] = None,
    include_ai_insights: bool = True,
    analysis_type: str = "comprehensive",
    analysis_service: AIAnalysisService = Depends(get_ai_analysis_service),
):
    """Get financial analysis via GET request with query parameters."""
    
    # Parse document_ids if provided
    parsed_document_ids = None
    if document_ids:
        try:
            parsed_document_ids = [int(id.strip()) for id in document_ids.split(",")]
        except ValueError:
            raise HTTPException(
                status_code=400,
                detail="Invalid document_ids format. Use comma-separated integers."
            )
    
    request = AnalysisRequest(
        document_ids=parsed_document_ids,
        include_ai_insights=include_ai_insights,
        analysis_type=analysis_type
    )
    
    try:
        analysis = analysis_service.generate_financial_analysis(request)
        return analysis
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate financial analysis: {str(e)}"
        )


@router.get("/insights")
def get_ai_insights_only(
    document_ids: Optional[str] = None,
    analysis_service: AIAnalysisService = Depends(get_ai_analysis_service),
):
    """Get only AI insights without full analysis."""
    
    # Parse document_ids if provided
    parsed_document_ids = None
    if document_ids:
        try:
            parsed_document_ids = [int(id.strip()) for id in document_ids.split(",")]
        except ValueError:
            raise HTTPException(
                status_code=400,
                detail="Invalid document_ids format. Use comma-separated integers."
            )
    
    request = AnalysisRequest(
        document_ids=parsed_document_ids,
        include_ai_insights=True,
        analysis_type="summary"
    )
    
    try:
        analysis = analysis_service.generate_financial_analysis(request)
        return {
            "insights": analysis.ai_insights,
            "generated_at": analysis.generated_at
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate AI insights: {str(e)}"
        )
