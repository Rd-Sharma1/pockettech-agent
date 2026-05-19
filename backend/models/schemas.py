from pydantic import BaseModel
from typing import List, Optional
from enum import Enum

class Role(str, Enum):
    user = "user"
    assistant = "assistant"

class Message(BaseModel):
    role: Role
    content: str

class ChatRequest(BaseModel):
    message: str
    conversation_history: List[Message] = []
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    reply: str
    tool_used: Optional[str] = None   # e.g. "get_order_status" — shown in UI
    escalated: bool = False
    session_id: Optional[str] = None

class HealthResponse(BaseModel):
    status: str