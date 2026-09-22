"""
Unit tests for system endpoints.
"""

# --- IMPORTS ---
from fastapi.testclient import TestClient
from importlib.metadata import version
from src.app import app

import pytest


# --- TESTS ---
def test_health_returns_200(client: TestClient) -> None:
    response = client.get('/api/system/health')
    assert response.status_code == 200


def test_health_status_is_ok_after_startup(client: TestClient) -> None:
    assert client.get('/api/system/health').json()['status'] == 'OK'


def test_info_returns_200(client: TestClient) -> None:
    response = client.get('/api/system/info')
    assert response.status_code == 200


def test_info_body_has_required_fields(client: TestClient) -> None:
    data = client.get('/api/system/info').json()
    assert 'name' in data
    assert 'description' in data
    assert 'version' in data
    assert 'extra' in data


def test_info_version_matches_the_package(client: TestClient) -> None:
    data = client.get('/api/system/info').json()
    assert data['version'] == version('ecoa-backend')


def test_repeated_startups_do_not_duplicate_routes() -> None:
    # route mounting must be idempotent across lifespan restarts (each
    # TestClient run triggers a full startup/shutdown cycle).
    route_count = len(app.routes)
    for _ in range(2):
        with TestClient(app):
            pass
    assert len(app.routes) == route_count


# --- ERROR CONTRACT ---
@pytest.mark.parametrize(
    ('method', 'path', 'status'),
    [
        ('get', '/rota-inexistente', 404),
        ('post', '/api/system/health', 405),
    ],
)
def test_framework_errors_use_the_json_error_envelope(
    client: TestClient, method: str, path: str, status: int
) -> None:
    """404/405 come from Starlette's router, not from our code, and must
    still answer with {'error', 'message'} like every other failure."""
    response = getattr(client, method)(path)

    assert response.status_code == status
    body = response.json()
    assert body['error'] == 'http_error'
    assert isinstance(body['message'], str)
