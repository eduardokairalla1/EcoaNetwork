"""
Invalid request error.
"""

# --- IMPORTS ---
from src.err.ecoa_error import EcoaError

import logging


# --- ERROR ---
class InvalidRequestError(EcoaError):
    """
    Raised when the request payload is malformed or fails validation.
    """

    MESSAGE = 'Bad Request!'
    STATUS_CODE = 400
    LOG_LEVEL = logging.WARNING
