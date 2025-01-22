# backend/__init__.py

# Import the UserDatabase class to make it available at the package level
from .database import UserDatabase
from .croppredection import app

# Define the list of objects to be exported when using `from backend import *`
__all__ = [
    "UserDatabase",
    "app" # Add the name of the class or other objects you want to export
]