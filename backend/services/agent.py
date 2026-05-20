# services/agent.py
# Owner: Mannu Gaurav

from groq import Groq
import json
from config import settings
from models.schemas import Message
from tools.definition import TOOLS
from services.shopify import get_product_info, get_order_status, initiate_return
from typing import List

client = Groq(api_key=settings.groq_api_key)

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

# Convert Anthropic-style tool schemas to OpenAI/Groq format
GROQ_TOOLS = [
    {
        "type": "function",
        "function": {
            "name": tool["name"],
            "description": tool["description"],
            "parameters": tool["input_schema"],
        }
    }
    for tool in TOOLS
]


async def run_agent(message: str, history: List[Message]) -> dict:
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    for h in history:
        messages.append({"role": h.role, "content": h.content})
    messages.append({"role": "user", "content": message})

    tool_used = None
    escalated = False
    max_iterations = 5

    for _ in range(max_iterations):
        try:
            response = client.chat.completions.create(
                model="openai/gpt-oss-20b",
                max_tokens=1024,
                tools=GROQ_TOOLS,
                tool_choice="auto",
                messages=messages,
            )
        except Exception as e:
            # print(f"GROQ ERROR: {str(e)}")
            return {
                "reply": "I'm having trouble right now. Please try again in a moment.",
                "tool_used": None,
                "escalated": False,
            }

        choice = response.choices[0]

        if choice.finish_reason == "tool_calls":
            tool_calls = choice.message.tool_calls
            messages.append(choice.message)

            for tc in tool_calls:
                tool_used = tc.function.name
                inputs = json.loads(tc.function.arguments)
                result = await _execute_tool(tc.function.name, inputs)

                if tc.function.name == "escalate_to_human":
                    escalated = True

                messages.append({
                    "role": "tool",
                    "tool_call_id": tc.id,
                    "content": json.dumps(result),
                })
            continue

        if choice.finish_reason == "stop":
            reply = choice.message.content or ""
            reply = reply.strip()
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