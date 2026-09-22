"""
FastAPI application instance.
"""

# --- IMPORTS ---
from fastapi import FastAPI
from importlib.metadata import version
from src.config import config


# --- GLOBALS ---
DESCRIPTION = 'Ecoa platform backend API.'
APP_VERSION = version('ecoa-backend')


# --- CODE ---
app = FastAPI(
    title='Ecoa',
    description=DESCRIPTION,
    summary='Ecoa platform backend API.',
    version=APP_VERSION,
    docs_url=None if config.is_production else f'{config.API_PREFIX}/docs',
    redoc_url=None if config.is_production else f'{config.API_PREFIX}/redoc',
    openapi_url=(
        None if config.is_production else f'{config.API_PREFIX}/openapi.json'
    ),
)
