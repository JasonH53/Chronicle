"""Global exception handlers for the FastAPI application."""

from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from .core.exceptions import InternalError
import logging

logger = logging.getLogger(__name__)


async def internal_error_handler(request: Request, exc: InternalError) -> JSONResponse:
    """Handle InternalError exceptions."""
    logger.error(f"Internal error: {exc.message}", extra={"details": exc.details})
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "message": "A system error occurred. Please contact support.",
            "request_id": getattr(request.state, "request_id", None)
        }
    )


async def general_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Handle unexpected exceptions."""
    logger.exception("Unexpected error occurred", exc_info=exc)
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error", 
            "message": "An unexpected error occurred. Please contact support.",
            "request_id": getattr(request.state, "request_id", None)
        }
    )
