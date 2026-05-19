# tools/definitions.py
# Owner: Mannu Gaurav

TOOLS = [
    {
        "name": "get_product_info",
        "description": "Fetch product details, specs, and compatibility from the PocketTech store. Use when the customer asks about a specific product.",
        "input_schema": {
            "type": "object",
            "properties": {
                "product_id": {
                    "type": "string",
                    "description": "The Shopify product ID"
                }
            },
            "required": ["product_id"]
        }
    },
    {
        "name": "get_order_status",
        "description": "Fetch live order status and estimated delivery. Use when the customer asks where their order is.",
        "input_schema": {
            "type": "object",
            "properties": {
                "order_id": {
                    "type": "string",
                    "description": "The Shopify order ID or order number"
                }
            },
            "required": ["order_id"]
        }
    },
    {
        "name": "initiate_return",
        "description": "Create a return request for an order. Use when the customer explicitly wants to return an item.",
        "input_schema": {
            "type": "object",
            "properties": {
                "order_id": {
                    "type": "string",
                    "description": "The Shopify order ID"
                },
                "reason": {
                    "type": "string",
                    "description": "Reason for the return"
                }
            },
            "required": ["order_id", "reason"]
        }
    },
    {
        "name": "escalate_to_human",
        "description": "Escalate the conversation to a human support agent. Use when the query is outside your scope or the customer is frustrated.",
        "input_schema": {
            "type": "object",
            "properties": {
                "reason": {
                    "type": "string",
                    "description": "Why this is being escalated"
                }
            },
            "required": []
        }
    }
]