"""
Database connection.
"""

# --- IMPORTS ---
from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager
from sqlalchemy.exc import IntegrityError
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.ext.asyncio import async_sessionmaker
from sqlalchemy.ext.asyncio import create_async_engine
from src.err.data_integrity_error import DataIntegrityError
from src.err.database_unavailable_error import DatabaseUnavailableError
from src.err.ecoa_error import EcoaError


# --- GLOBALS ---
CONNECT_TIMEOUT = 5


# --- CODE ---
class Database:
    """
    Holds the connections to the database and hands out sessions.
    """

    def __init__(self, url: str) -> None:
        """
        Initialize the database connection.

        Nothing connects here: the first connection opens on the first query.

        :param url: Where the database is, as 'postgresql+asyncpg://...'.

        :return: None.
        """
        self._engine = create_async_engine(
            url,
            pool_pre_ping=True,
            connect_args={'timeout': CONNECT_TIMEOUT},
            hide_parameters=True,
        )
        self._sessions = async_sessionmaker(
            self._engine,
            expire_on_commit=False,
        )


    @asynccontextmanager
    async def session(self) -> AsyncGenerator[AsyncSession, None]:
        """
        Opens a session for a single storage operation.

        The block is committed when it ends and rolled back when it raises.

        :raises DataIntegrityError: If the write breaks a database rule.
        :raises DatabaseUnavailableError: If the database cannot be reached
            or rejects the operation for any other reason.

        :return: The session, as an async context manager.
        """
        session = self._sessions()

        try:
            yield session
            await session.commit()

        # error already carries its HTTP contract: roll back and re-raise
        except EcoaError:
            await session.rollback()
            raise

        # the database answered and rejected the data
        except IntegrityError as error:
            await session.rollback()
            raise DataIntegrityError(str(error.orig)) from error

        # the database could not be reached, or failed the operation
        except (SQLAlchemyError, OSError) as error:
            await session.rollback()
            raise DatabaseUnavailableError(
                str(getattr(error, 'orig', None) or error)
            ) from error

        # any other error: roll back and re-raise
        except Exception:
            await session.rollback()
            raise

        # no matter what: close the session
        finally:
            await session.close()


    async def close(self) -> None:
        """
        Closes every connection.

        :return: None.
        """
        await self._engine.dispose()
