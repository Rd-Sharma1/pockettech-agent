from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    anthropic_api_key: str
    shopify_store_url: str
    shopify_admin_token: str
    shopify_api_version: str = "2024-01"
    model: str = "claude-sonnet-4-20250514"

    class Config:
        env_file = ".env"

settings = Settings()