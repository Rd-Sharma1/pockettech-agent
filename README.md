# PocketTech — AI Customer Support Agent

> **Kasparro Hackathon 2026 · Track 4: AI Customer Support Agent for Commerce**  
> Team: Ridam & Mannu Gaurav

---

## What This Is

PocketTech is a Shopify-based phone accessories store. This project is a store-native AI support agent that handles the full first-line customer support lifecycle — pre-purchase questions, policy explanations, order tracking, and return initiation — without escalating everything to a human.

This is not a FAQ wrapper. The agent has access to real Shopify store data and takes real actions via tool calls.

---

## Problem Statement

Customers shopping on small Shopify stores are impatient. When they have a question mid-purchase — compatibility, return policy, order status — they don't want to send an email and wait 24 hours. They abandon. The sale is lost.

PocketTech's AI agent answers instantly, in context, with grounded store data.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite) |
| Backend | FastAPI (Python) |
| LLM | Claude API (claude-sonnet-4-20250514) |
| Store Platform | Shopify Admin API + Storefront API |
| Data | Synthetic Shopify development store |

---

## Agent Capabilities (Tools)

| Tool | What it does |
|---|---|
| `get_product_info` | Fetches specs, compatibility, description from Shopify |
| `get_order_status` | Returns live order status and estimated delivery |
| `initiate_return` | Creates a return request via Shopify API |
| `escalate_to_human` | Graceful handoff with context for edge cases |

---

## Project Structure

```
pockettech-agent/
├── backend/
│   ├── main.py              # App entry point, router registration
│   ├── config.py            # Environment config
│   ├── models/
│   │   └── schemas.py       # Pydantic request/response models
│   ├── routers/
│   │   └── chat.py          # Chat API endpoint
│   ├── services/
│   │   ├── agent.py         # LLM + tool calling logic
│   │   └── shopify.py       # Shopify API integration
│   └── tools/
│       └── definitions.py   # Claude tool schemas
├── frontend/
│   └── src/
│       ├── App.jsx
│       └── components/
│           └── ChatInterface.jsx
├── docs/
│   ├── product_document.pdf
│   └── technical_document.pdf
├── .env.example
├── requirements.txt
└── README.md
```

---

## Setup Instructions

### Prerequisites
- Python 3.11+
- Node.js 18+
- Anthropic API key
- Shopify development store + Admin API token

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp ../.env.example .env         # Fill in your API keys
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173`. Backend at `http://localhost:8000`.

---

## Environment Variables

```env
ANTHROPIC_API_KEY=your_key_here
SHOPIFY_STORE_URL=your_store.myshopify.com
SHOPIFY_ADMIN_TOKEN=your_token_here
SHOPIFY_API_VERSION=2024-01
```

---

## Demo Video

> Link: *(to be added before submission)*

---

## Documents

- [Product Document](docs/product_document.pdf)
- [Technical Document](docs/technical_document.pdf) *(to be added)*
- [Decision Log](docs/decision_log.md) *(to be added)*

---

## Contribution Note

**Ridam** — Product thinking, scope decisions, frontend (React UI, chat interface, animations), backend scaffolding (project structure, schemas, router definitions, config), README, documentation.

**Mannu Gaurav** — Core agent logic (LLM tool calling, prompt design), Shopify API integration, tool definitions, failure handling, system architecture.

---

## Known Limitations

- Agent handles English only
- Return initiation runs against a development store (safe/reversible)
- Payment disputes always escalate — not handled autonomously
- No persistent conversation history across sessions (in-memory only)

---

*Built for Kasparro Hackathon 2026 · Submission deadline: 20th May 2026, 11:59 PM IST*