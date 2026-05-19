from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import chat
from config import settings

app = FastAPI(
    title="PocketTech AI Support Agent",
    description="Store-native AI customer support for PocketTech Shopify store",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router, prefix="/api", tags=["chat"])

@app.get("/")
async def root():
    return {"status": "PocketTech Agent is running"}

@app.get("/health")
async def health():
    return {"status": "ok"}