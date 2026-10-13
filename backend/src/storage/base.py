"""
Base storage.
"""

# --- IMPORTS ---
from src.clients.database import Database
from src.models.base import Base
from typing import Any


# --- CODE ---
class Storage[Model: Base]:
    """
    The operations every table has.
    """

    model: type[Model]

    def __init__(self, database: Database) -> None:
        """
        Initialize the storage.

        :param database: The database every operation opens a session on.

        :return: None.
        """
        self._database = database


    async def insert(self, **values: Any) -> Model:
        """
        Adds a row.

        :param values: Column names and their values.

        :return: The row, with what the database filled in.
        """
        instance = self.model(**values)

        async with self._database.session() as session:
            session.add(instance)

        return instance
