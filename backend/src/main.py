"""
Service entry point.
"""

# --- IMPORTS ---
from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager
from fastapi import FastAPI
from src.app import app
from src.events import on_shutdown
from src.events import on_startup
from src.utils.logging_config import setup_logger


# --- GLOBALS ---
setup_logger()


# --- CODE ---
@asynccontextmanager
async def lifespan(application: FastAPI) -> AsyncGenerator[None, None]:
    """
    Handles startup and shutdown events for the application.
    """
    # startup tasks
    await on_startup(application)

    # run the app
    try:
        yield

    # shutdown tasks
    finally:
        await on_shutdown(application)


# attach lifespan to the app
app.router.lifespan_context = lifespan
