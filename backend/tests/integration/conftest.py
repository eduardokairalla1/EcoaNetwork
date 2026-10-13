"""
Shared fixtures for the tests that run against a real database.
"""

# --- IMPORTS ---
from collections.abc import Awaitable
from collections.abc import Callable
from collections.abc import Iterator
from datetime import datetime
from sqlalchemy import DateTime
from sqlalchemy import String
from sqlalchemy import func
from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from src.clients.database import Database
from src.models.base import Base
from src.storage.base import Storage

import asyncio
import os
import pytest


# --- GLOBALS ---
# the database infra/local starts; never the one in .env
DATABASE_URL = os.environ.get(
    'TEST_DATABASE_URL',
    'postgresql+asyncpg://backend:goodpassword@localhost:5432/ecoa_backend',
)

# everything the tests create lives here, and is dropped with it
SCHEMA = 'storage_tests'

Run = Callable[[Callable[[Database], Awaitable[None]]], None]


# --- MODELS ---
class Note(Base):
    """A table that only exists while these tests run."""

    __tablename__ = 'notes'
    __table_args__ = {'schema': SCHEMA}

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(50), unique=True)
    body: Mapped[str] = mapped_column(String(200), default='')
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )


class NoteStorage(Storage[Note]):
    """The base storage, bound to the test table."""

    model = Note


# --- HELPERS ---
async def _reset(create: bool) -> None:
    """Drops the test schema and, when asked, builds it again."""
    engine = create_async_engine(DATABASE_URL)

    async with engine.begin() as connection:
        await connection.execute(
            text(f'DROP SCHEMA IF EXISTS {SCHEMA} CASCADE')
        )

        if create:
            await connection.execute(text(f'CREATE SCHEMA {SCHEMA}'))
            await connection.run_sync(
                Base.metadata.tables[f'{SCHEMA}.notes'].create
            )

    await engine.dispose()


# --- FIXTURES ---
@pytest.fixture
def run() -> Iterator[Run]:
    """
    Runs an async test body against a fresh test table.

    The body receives a Database it can open sessions on.
    """

    def runner(body: Callable[[Database], Awaitable[None]]) -> None:
        async def main() -> None:
            await _reset(create=True)
            database = Database(DATABASE_URL)

            try:
                await body(database)
            finally:
                await database.close()
                await _reset(create=False)

        asyncio.run(main())

    yield runner
