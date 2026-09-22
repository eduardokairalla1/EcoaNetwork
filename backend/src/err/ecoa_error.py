"""
Base Ecoa error.
"""

# --- IMPORTS ---
from typing import Any

import logging
import re


# --- ERROR CLASS ---
class EcoaError(Exception):
    """
    Base Ecoa error.
    """

    MESSAGE = 'Generic Ecoa error'
    STATUS_CODE = 500
    LOG_LEVEL = logging.ERROR

    def __init__(self, *args: Any) -> None:
        """
        Initialize an Ecoa error.

        :param *args: Optional additional context or details for the error.

        :return: None.
        """
        super().__init__(self.MESSAGE, *args)


    @classmethod
    def slug(cls) -> str:
        """
        Stable snake_case error slug derived from the class name.

        :return: The error slug.
        """
        return re.sub(r'(?<!^)(?=[A-Z])', '_', cls.__name__).lower()
