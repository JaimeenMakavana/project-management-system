"""
Custom exceptions for the application.
"""

class OrganizationMismatchError(Exception):
    """Raised when attempting to access resources from a different organization."""
    pass


class InvalidStatusTransitionError(Exception):
    """Raised when attempting an invalid status transition."""
    pass

