# services/agent.py
# Owner: Mannu Gaurav
#
# This module is the brain of the support agent.
# It receives a user message + conversation history,
# calls the Claude API with tool definitions,
# handles tool execution, and returns a structured response.
#
# Expected return shape from run_agent():
# {
#   "reply": str,
#   "tool_used": str | None,
#   "escalated": bool
# }

from models.schemas import Message
from typing import List

async def run_agent(message: str, history: List[Message]) -> dict:
    # TODO: implement Claude API call with tool calling
    # TODO: handle tool responses (get_product_info, get_order_status, etc.)
    # TODO: implement retry on malformed LLM response
    raise NotImplementedError("agent.py not implemented yet")