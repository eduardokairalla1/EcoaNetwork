"""
Shared test fixtures.
"""

# --- IMPORTS ---
from collections.abc import Iterator
from fastapi.testclient import TestClient
from src.app import app

import pytest

# wires routes, handlers, middleware and the lifespan onto the app.
import src.main  # noqa: F401


# --- HTTP CLIENT ---
@pytest.fixture
def client() -> Iterator[TestClient]:
    """
    TestClient running the full app lifespan.
    """
    with TestClient(app) as test_client:
        yield test_client
