from fastapi import APIRouter, HTTPException
from models.schemas import ChatRequest, ChatResponse
from services.agent import run_agent
import uuid

router = APIRouter()

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Main chat endpoint. Receives a user message + conversation history,
    returns the agent's reply along with metadata (tool used, escalation flag).
    """
    try:
        session_id = request.session_id or str(uuid.uuid4())
        result = await run_agent(
            message=request.message,
            history=request.conversation_history
        )
        return ChatResponse(
            reply=result["reply"],
            tool_used=result.get("tool_used"),
            escalated=result.get("escalated", False),
            session_id=session_id
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))