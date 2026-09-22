"""
Application configuration.
"""

# --- IMPORTS ---
from pydantic_settings import BaseSettings
from pydantic_settings import SettingsConfigDict


# --- CONFIG ---
class Config(BaseSettings):
    """
    Reads configuration from environment variables and .env file.
    """

    # general
    ENVIRONMENT: str = 'development'
    LOG_LEVEL: str = 'INFO'

    # routing
    API_PREFIX: str = '/api'

    @property
    def is_production(self) -> bool:
        """
        Whether this instance runs in production.

        :return: True when ENVIRONMENT is 'production'.
        """
        return self.ENVIRONMENT.strip().lower() == 'production'

    # pydantic settings
    model_config = SettingsConfigDict(env_file='.env', extra='ignore')


# shared singleton: import `config` instead of instantiating Config again
config = Config()
