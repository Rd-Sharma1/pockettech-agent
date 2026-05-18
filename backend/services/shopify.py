# services/shopify.py
# Owner: Mannu Gaurav
#
# This module handles all Shopify Admin API interactions.
# Each function maps to one agent tool.
# All functions are async and return structured dicts.

from config import settings
import httpx

SHOPIFY_BASE = f"https://{settings.shopify_store_url}/admin/api/{settings.shopify_api_version}"
HEADERS = {
    "X-Shopify-Access-Token": settings.shopify_admin_token,
    "Content-Type": "application/json",
}

async def get_product_info(product_id: str) -> dict:
    # TODO: GET /products/{product_id}.json
    # TODO: return name, description, compatibility, price
    raise NotImplementedError

async def get_order_status(order_id: str) -> dict:
    # TODO: GET /orders/{order_id}.json
    # TODO: return status, fulfillment, estimated delivery
    raise NotImplementedError

async def initiate_return(order_id: str, reason: str) -> dict:
    # TODO: POST return request via Shopify API
    # TODO: return confirmation number
    raise NotImplementedError