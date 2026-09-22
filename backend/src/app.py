"""
FastAPI application instance.
"""

# --- IMPORTS ---
from fastapi import FastAPI
from importlib.metadata import version


# --- GLOBALS ---
DESCRIPTION = 'Ecoa platform backend API.'
APP_VERSION = version('ecoa-backend')


# --- CODE ---
app = FastAPI(
    title='Ecoa',
    description=DESCRIPTION,
    summary='Ecoa platform backend API.',
    version=APP_VERSION,
)
