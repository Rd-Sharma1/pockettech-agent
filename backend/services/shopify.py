# services/shopify.py
# Owner: Mannu Gaurav

import httpx
from config import settings

SHOPIFY_BASE = f"https://{settings.shopify_store_url}/admin/api/{settings.shopify_api_version}"
HEADERS = {
    "X-Shopify-Access-Token": settings.shopify_admin_token,
    "Content-Type": "application/json",
}


async def get_product_info(product_id: str) -> dict:
    """Fetch product details from Shopify Admin API."""
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            res = await client.get(
                f"{SHOPIFY_BASE}/products/{product_id}.json",
                headers=HEADERS
            )
            if res.status_code == 404:
                return {"error": "Product not found"}
            if res.status_code != 200:
                return {"error": f"Shopify returned {res.status_code}"}

            data = res.json().get("product", {})
            return {
                "id": data.get("id"),
                "title": data.get("title"),
                "description": _strip_html(data.get("body_html", "")),
                "product_type": data.get("product_type"),
                "tags": data.get("tags", ""),
                "variants": [
                    {
                        "title": v.get("title"),
                        "price": v.get("price"),
                        "inventory_quantity": v.get("inventory_quantity"),
                        "sku": v.get("sku"),
                    }
                    for v in data.get("variants", [])
                ],
            }
    except httpx.TimeoutException:
        return {"error": "Request timed out fetching product info"}
    except Exception as e:
        return {"error": f"Failed to fetch product: {str(e)}"}


async def get_order_status(order_id: str) -> dict:
    """Fetch order status and fulfillment from Shopify Admin API."""
    clean_id = order_id.lstrip("#")

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            res = await client.get(
                f"{SHOPIFY_BASE}/orders/{clean_id}.json",
                headers=HEADERS
            )
            # print(f"SHOPIFY STATUS: {res.status_code}")
            # print(f"SHOPIFY RESPONSE: {res.text[:500]}")
            if res.status_code == 404:
                return {"error": "Order not found. Please check your order number."}
            if res.status_code != 200:
                return {"error": f"Shopify returned {res.status_code}"}

            data = res.json().get("order", {})
            fulfillments = data.get("fulfillments", [])
            tracking = None
            if fulfillments:
                tracking = fulfillments[-1].get("tracking_number")

            return {
                "order_id": data.get("name"),
                "status": data.get("fulfillment_status") or "unfulfilled",
                "financial_status": data.get("financial_status"),
                "created_at": data.get("created_at"),
                "tracking_number": tracking,
                "line_items": [
                    {"title": item.get("title"), "quantity": item.get("quantity")}
                    for item in data.get("line_items", [])
                ],
            }
    except httpx.TimeoutException:
        return {"error": "Request timed out fetching order status"}
    except Exception as e:
        return {"error": f"Failed to fetch order: {str(e)}"}


async def initiate_return(order_id: str, reason: str) -> dict:
    """Create a return request via Shopify API."""
    clean_id = order_id.lstrip("#")

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            order_res = await client.get(
                f"{SHOPIFY_BASE}/orders/{clean_id}.json",
                headers=HEADERS
            )
            if order_res.status_code != 200:
                return {"error": "Could not find order to initiate return"}

            order = order_res.json().get("order", {})
            fulfillments = order.get("fulfillments", [])

            # FIX: fulfillment_line_item_id lives inside fulfillments,
            # not in the top-level line_items array
            if not fulfillments:
                return {"error": "Order has not been fulfilled yet. Returns require a fulfilled order."}

            fulfillment_line_items = fulfillments[-1].get("line_items", [])
            if not fulfillment_line_items:
                return {"error": "No fulfillment line items found for this order"}

            fulfillment_line_item_id = fulfillment_line_items[0].get("id")

            return_payload = {
                "return": {
                    "order_id": int(clean_id),
                    "return_line_items": [
                        {
                            "fulfillment_line_item_id": fulfillment_line_item_id,
                            "quantity": 1,
                            "reason": "other",
                            "customer_note": reason,
                        }
                    ],
                    "notify_customer": True,
                }
            }

            ret_res = await client.post(
                f"{SHOPIFY_BASE}/returns.json",
                headers=HEADERS,
                json=return_payload,
            )

            if ret_res.status_code in (200, 201):
                ret_data = ret_res.json().get("return", {})
                return {
                    "success": True,
                    "return_id": ret_data.get("id"),
                    "status": ret_data.get("status"),
                    "message": "Return request created. You will receive a confirmation email shortly.",
                }
            else:
                return {
                    "error": f"Return could not be created (status {ret_res.status_code}). "
                             "Please contact support directly."
                }

    except httpx.TimeoutException:
        return {"error": "Request timed out initiating return"}
    except Exception as e:
        return {"error": f"Failed to initiate return: {str(e)}"}


def _strip_html(html: str) -> str:
    """Remove HTML tags from Shopify product descriptions."""
    import re
    return re.sub(r"<[^>]+>", " ", html).strip()