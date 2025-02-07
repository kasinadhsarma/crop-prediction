"""
Backend package for the crop prediction application.
This module exports the FastAPI application and its components.
"""

from .results import (  # noqa: F401
    app,
    create_app,
    CropInput,
    DEFAULT_CROP_DETAILS
)

# Export these symbols for public use
__all__ = [
    "app",
    "create_app",
    "CropInput",
    "DEFAULT_CROP_DETAILS"
]
