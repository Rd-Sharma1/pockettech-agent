# services/agent.py
# Owner: Mannu Gaurav

import anthropic
from config import settings
from models.schemas import Message
from tools.definitions import TOOLS
from services.shopify import get_product_info, get_order_status, initiate_return
from typing import List

client = anthropic.Anthropic(api_key=settings.anthropic_api_key)

SYSTEM_PROMPT = """You are PocketTech's AI customer support agent. PocketTech is a Shopify store selling phone accessories — cases, cables, chargers, and screen protectors.

Your job is to help customers with:
- Product questions (specs, compatibility, availability)
- Order tracking (status, estimated delivery)
- Returns (initiating a return request)
- Store policies (returns, shipping, warranty)

Rules you must follow:
1. NEVER answer product-specific questions from memory. Always use get_product_info to fetch real data.
2. NEVER guess an order status. Always use get_order_status.
3. If a customer wants to return something, use initiate_return — don't just explain the process.
4. If a query is outside your scope (payment disputes, account issues), use escalate_to_human.
5. Be concise. Customers are on mobile. Short, clear answers.
6. If you don't know something and have no tool for it, say so honestly. Never make things up.

Store policies (answer these directly without a tool):
- Returns accepted within 7 days of delivery, item must be unused and in original packaging
- Shipping: standard 5-7 days, express 2-3 days
- Warranty: 6 months on chargers and cables, 3 months on cases
- Free shipping on orders above Rs.499"""


def _is_retryable(error: anthropic.APIError) -> bool:
    """Only retry on rate limits or server-side errors, not bad requests."""
    status = getattr(error, "status_code", None)
    return status is not None and (status == 429 or status >= 500)


async def run_agent(message: str, history: List[Message]) -> dict:
    messages = []
    for h in history:
        messages.append({"role": h.role, "content": h.content})
    messages.append({"role": "user", "content": message})

    tool_used = None
    escalated = False
    max_iterations = 5

    for _ in range(max_iterations):
        try:
            response = client.messages.create(
                model=settings.model,
                max_tokens=1024,
                system=SYSTEM_PROMPT,
                tools=TOOLS,
                messages=messages,
            )
        except anthropic.APIError as e:
            # FIX: only retry transient errors (rate limit / 5xx),
            # not permanent ones like 400 Bad Request
            if _is_retryable(e):
                try:
                    response = client.messages.create(
                        model=settings.model,
                        max_tokens=1024,
                        system=SYSTEM_PROMPT,
                        tools=TOOLS,
                        messages=messages,
                    )
                except anthropic.APIError:
                    return {
                        "reply": "I'm having trouble right now. Please try again in a moment.",
                        "tool_used": None,
                        "escalated": False,
                    }
            else:
                return {
                    "reply": "I'm having trouble right now. Please try again in a moment.",
                    "tool_used": None,
                    "escalated": False,
                }

        if response.stop_reason == "tool_use":
            tool_result_content = []
            for block in response.content:
                if block.type == "tool_use":
                    tool_used = block.name
                    result = await _execute_tool(block.name, block.input)
                    if block.name == "escalate_to_human":
                        escalated = True
                    tool_result_content.append({
                        "type": "tool_result",
                        "tool_use_id": block.id,
                        "content": str(result),
                    })
            messages.append({"role": "assistant", "content": response.content})
            messages.append({"role": "user", "content": tool_result_content})
            continue

        if response.stop_reason == "end_turn":
            reply = _extract_text(response.content)
            if not reply:
                reply = "I couldn't process that. Could you rephrase your question?"
            return {"reply": reply, "tool_used": tool_used, "escalated": escalated}

    return {
        "reply": "I wasn't able to complete that request. Please try again or contact our support team.",
        "tool_used": tool_used,
        "escalated": False,
    }


async def _execute_tool(name: str, inputs: dict) -> dict:
    try:
        if name == "get_product_info":
            return await get_product_info(inputs["product_id"])
        elif name == "get_order_status":
            return await get_order_status(inputs["order_id"])
        elif name == "initiate_return":
            return await initiate_return(inputs["order_id"], inputs["reason"])
        elif name == "escalate_to_human":
            return {"status": "escalated", "reason": inputs.get("reason", "")}
        else:
            return {"error": f"Unknown tool: {name}"}
    except Exception as e:
        return {"error": f"Tool execution failed: {str(e)}"}


def _extract_text(content: list) -> str:
    for block in content:
        if hasattr(block, "type") and block.type == "text":
            return block.text.strip()
    return ""