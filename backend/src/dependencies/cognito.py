"""
Dependency provider for the Cognito client.
"""

# --- IMPORTS ---
from fastapi import Request
from src.clients.cognito import CognitoClient


# --- CODE ---
def get_cognito(request: Request) -> CognitoClient:
    """
    Provides the Cognito client opened at startup.

    :param request: FastAPI request object.

    :return: The application's Cognito client.
    """
    cognito: CognitoClient = request.app.state.cognito

    return cognito
