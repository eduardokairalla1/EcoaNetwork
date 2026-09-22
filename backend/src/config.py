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

    # pydantic settings
    model_config = SettingsConfigDict(env_file='.env', extra='ignore')


# shared singleton: import `config` instead of instantiating Config again
config = Config()
