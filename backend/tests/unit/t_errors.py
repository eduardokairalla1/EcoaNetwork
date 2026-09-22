"""
Unit tests for the error envelope.
"""

# --- IMPORTS ---
from fastapi import FastAPI
from fastapi.testclient import TestClient
from src.err.ecoa_error import EcoaError
from src.err.handlers import register_error_handlers
from src.err.invalid_request_error import InvalidRequestError


# --- HELPERS ---
def _client_raising(error: Exception) -> TestClient:
    """Builds an app whose only route raises the given error."""
    app = FastAPI()
    register_error_handlers(app)

    @app.get('/boom')
    def boom() -> None:
        raise error

    return TestClient(app, raise_server_exceptions=False)


# --- TESTS ---
def test_slug_is_derived_from_the_class_name() -> None:
    assert InvalidRequestError.slug() == 'invalid_request_error'
    assert EcoaError.slug() == 'ecoa_error'


def test_ecoa_error_answers_with_its_class_attributes() -> None:
    response = _client_raising(InvalidRequestError('internal detail')).get(
        '/boom'
    )

    assert response.status_code == 400
    assert response.json() == {
        'error': 'invalid_request_error',
        'message': 'Bad Request!',
    }


def test_unhandled_error_answers_500_without_leaking_details() -> None:
    response = _client_raising(RuntimeError('secret')).get('/boom')

    assert response.status_code == 500
    assert response.json()['error'] == 'internal_error'
    assert 'secret' not in response.text


def test_validation_error_lists_each_invalid_field() -> None:
    app = FastAPI()
    register_error_handlers(app)

    @app.get('/items/{item_id}')
    def item(item_id: int) -> int:
        return item_id

    response = TestClient(app).get('/items/abc')

    assert response.status_code == 422
    body = response.json()
    assert body['error'] == 'request_validation_error'
    assert body['message'][0].startswith('item_id: ')
