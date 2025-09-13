"""Custom exceptions for the application."""


class InternalError(Exception):
    """Exception for internal system errors that indicate configuration or system issues."""
    
    def __init__(self, message: str, details: str = None):
        self.message = message
        self.details = details
        super().__init__(self.message)
