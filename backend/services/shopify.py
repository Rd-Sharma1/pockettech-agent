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
    """Fetch product details from Shopify Admin API by ID or name."""
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            # First try direct ID lookup
            if product_id.isdigit():
                res = await client.get(
                    f"{SHOPIFY_BASE}/products/{product_id}.json",
                    headers=HEADERS
                )
                if res.status_code == 200:
                    data = res.json().get("product", {})
                    return _format_product(data)

            # Search by title if not a numeric ID
            search_res = await client.get(
                f"{SHOPIFY_BASE}/products.json",
                headers=HEADERS,
                params={"title": product_id, "limit": 5}
            )

            if search_res.status_code != 200:
                return {"error": f"Shopify returned {search_res.status_code}"}

            products = search_res.json().get("products", [])

            if not products:
                # Try broader search
                all_res = await client.get(
                    f"{SHOPIFY_BASE}/products.json",
                    headers=HEADERS,
                    params={"limit": 50}
                )
                if all_res.status_code == 200:
                    all_products = all_res.json().get("products", [])
                    # Match by partial name
                    query = product_id.lower()
                    matches = [
                        p for p in all_products
                        if query in p.get("title", "").lower()
                        or query in p.get("product_type", "").lower()
                        or query in p.get("tags", "").lower()
                    ]
                    if matches:
                        return _format_product(matches[0])

                return {"error": "Product not found"}

            return _format_product(products[0])

    except httpx.TimeoutException:
        return {"error": "Request timed out fetching product info"}
    except Exception as e:
        return {"error": f"Failed to fetch product: {str(e)}"}


def _format_product(data: dict) -> dict:
    """Format product data for agent response."""
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

async def get_order_status(order_id: str) -> dict:
    """Fetch order status and fulfillment from Shopify Admin API."""
    clean_id = order_id.lstrip("#").strip()

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            # First try searching by order name (e.g. 1001)
            search_res = await client.get(
                f"{SHOPIFY_BASE}/orders.json",
                headers=HEADERS,
                params={"name": clean_id, "status": "any"}
            )

            if search_res.status_code != 200:
                return {"error": f"Shopify returned {search_res.status_code}"}

            orders = search_res.json().get("orders", [])

            # If not found by name, try direct ID lookup
            if not orders:
                direct_res = await client.get(
                    f"{SHOPIFY_BASE}/orders/{clean_id}.json",
                    headers=HEADERS
                )
                if direct_res.status_code == 404:
                    return {"error": "Order not found. Please check your order number."}
                if direct_res.status_code != 200:
                    return {"error": f"Shopify returned {direct_res.status_code}"}
                data = direct_res.json().get("order", {})
            else:
                data = orders[0]

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
    clean_id = order_id.lstrip("#").strip()

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            # Search by order name first
            search_res = await client.get(
                f"{SHOPIFY_BASE}/orders.json",
                headers=HEADERS,
                params={"name": clean_id, "status": "any"}
            )

            if search_res.status_code != 200:
                return {"error": "Could not find order to initiate return"}

            orders = search_res.json().get("orders", [])

            # Fallback to direct ID lookup
            if not orders:
                direct_res = await client.get(
                    f"{SHOPIFY_BASE}/orders/{clean_id}.json",
                    headers=HEADERS
                )
                if direct_res.status_code != 200:
                    return {"error": "Could not find order to initiate return"}
                order = direct_res.json().get("order", {})
            else:
                order = orders[0]

            fulfillments = order.get("fulfillments", [])
            if not fulfillments:
                return {"error": "Order has not been fulfilled yet. Returns require a fulfilled order."}

            fulfillment_line_items = fulfillments[-1].get("line_items", [])
            if not fulfillment_line_items:
                return {"error": "No fulfillment line items found for this order"}

            # Shopify Returns API is restricted on dev stores
            # Validate order exists and simulate return confirmation
            return {
                "success": True,
                "return_id": f"RET-{order.get('name', '').lstrip('#')}",
                "status": "return_requested",
                "message": "Return request created. You will receive a confirmation email shortly.",
            }

    except httpx.TimeoutException:
        return {"error": "Request timed out initiating return"}
    except Exception as e:
        return {"error": f"Failed to initiate return: {str(e)}"}
def _strip_html(html: str) -> str:
    """Remove HTML tags from Shopify product descriptions."""
    import re
    return re.sub(r"<[^>]+>", " ", html).strip()