from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    groq_api_key: str
    shopify_store_url: str
    shopify_admin_token: str
    shopify_api_version: str = "2024-01"
    model: str = "openai/gpt-oss-20b"

    class Config:
        env_file = ".env"

settings = Settings()