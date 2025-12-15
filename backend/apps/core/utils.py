"""
Shared utility functions.
"""
from typing import Optional
from datetime import datetime, date


def format_date(date_obj: Optional[date]) -> Optional[str]:
    """
    Format a date object to ISO string.
    
    Args:
        date_obj: Date object to format
        
    Returns:
        ISO formatted date string or None
    """
    if date_obj:
        return date_obj.isoformat()
    return None


def format_datetime(datetime_obj: Optional[datetime]) -> Optional[str]:
    """
    Format a datetime object to ISO string.
    
    Args:
        datetime_obj: Datetime object to format
        
    Returns:
        ISO formatted datetime string or None
    """
    if datetime_obj:
        return datetime_obj.isoformat()
    return None


def validate_email(email: str) -> bool:
    """
    Simple email validation.
    
    Args:
        email: Email string to validate
        
    Returns:
        True if email format is valid
    """
    import re
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))


def calculate_percentage(part: int, total: int, decimal_places: int = 2) -> float:
    """
    Calculate percentage with safe division.
    
    Args:
        part: Part value
        total: Total value
        decimal_places: Number of decimal places to round to
        
    Returns:
        Percentage value
    """
    if total == 0:
        return 0.0
    return round((part / total) * 100, decimal_places)

