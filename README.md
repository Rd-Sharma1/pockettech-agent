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

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | React (Vite), CSS Modules           |
| Backend  | FastAPI (Python)                    |
| LLM      | Groq API (openai/gpt-oss-20b)       |
| Platform | Shopify Admin API                   |
| Data     | Synthetic Shopify development store |

---

## Agent Capabilities

| Tool                | What it does                                                         |
|---------------------|----------------------------------------------------------------------|
| `get_product_info`  | Fetches specs, compatibility, description from Shopify by name or ID |
| `get_order_status`  | Returns live order status and estimated delivery by order number     |
| `initiate_return`   | Validates order and creates a return request                         |
| `escalate_to_human` | Graceful handoff with context for edge cases                         |

---

## Project Structure
pockettech-agent/
│
├── backend/
│   ├── main.py                   # FastAPI app, CORS, router registration
│   ├── config.py                 # Env vars via pydantic-settings
│   ├── requirements.txt
│   │
│   ├── models/
│   │   ├── init.py
│   │   └── schemas.py            # Pydantic models: ChatRequest, ChatResponse, Message
│   │
│   ├── routers/
│   │   ├── init.py
│   │   └── chat.py               # POST /api/chat endpoint
│   │
│   ├── services/
│   │   ├── init.py
│   │   ├── agent.py              # Groq API + tool calling loop
│   │   └── shopify.py            # Shopify Admin API integration
│   │
│   └── tools/
│       ├── init.py
│       └── definition.py         # Tool schemas for all 4 agent tools
│
├── frontend/
│   └── src/
│       ├── App.jsx               # Layout orchestrator
│       ├── App.module.css
│       │
│       ├── styles/
│       │   └── global.css        # CSS variables, resets, keyframes
│       │
│       ├── constants/
│       │   ├── tokens.js         # Design tokens (JS mirror of CSS vars)
│       │   └── chat.js           # Suggestions, tool labels, initial message
│       │
│       ├── hooks/
│       │   └── useChat.js        # API state, conversation history, session
│       │
│       └── components/
│           ├── LeftPanel.jsx
│           ├── LeftPanel.module.css
│           ├── ChatMessage.jsx
│           ├── ChatMessage.module.css
│           ├── ChatInput.jsx
│           ├── ChatInput.module.css
│           ├── SuggestionPills.jsx
│           ├── SuggestionPills.module.css
│           ├── TypingIndicator.jsx
│           └── TypingIndicator.module.css
│
├── docs/
│   ├── product_document.pdf
│   └── technical_document.pdf
│
├── .env.example
├── .gitignore
└── README.md

---

## Setup Instructions

### Prerequisites
- Python 3.11+
- Node.js 18+
- Groq API key (free at console.groq.com)
- Shopify development store + Admin API token

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp ../.env.example .env         # Add your API keys
uvicorn main:app --reload
```

Backend runs at `http://localhost:8000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

---

## Environment Variables

```env
GROQ_API_KEY=your_groq_key_here
SHOPIFY_STORE_URL=your-store.myshopify.com
SHOPIFY_ADMIN_TOKEN=shpat_your_token_here
SHOPIFY_API_VERSION=2025-01
```

---

## Demo Video

> Link: *(to be added before submission)*

---

## Documents

- [Product Document](docs/product_document.pdf)
- [Technical Document](docs/technical_document.pdf)

---

## Contribution Note

**Ridam** — Product thinking, scope decisions, and end-to-end UI/UX ownership (React, CSS Modules, full component architecture including ChatMessage, ChatInput, SuggestionPills, TypingIndicator, and LeftPanel), backend scaffolding (project structure, FastAPI setup, Pydantic schemas, chat router, config management), README, and project documentation.

**Mannu Gaurav** — Designed and implemented the full AI agent layer: Groq API tool-calling loop with 5-iteration cap and transient-only retry logic, Shopify Admin API integration (product search by name and ID, order lookup by order number, return validation with fulfillment line item resolution), tool schemas for all 4 agent tools, system prompt engineering, and bug fixes including order name lookup, product search by keyword, and API version migration.

---

## Known Limitations

- English only
- Return initiation validates against real Shopify order data but uses simulated confirmation response on development store
- Payment disputes always escalate — not handled autonomously
- No persistent conversation history across sessions

---

*Kasparro Hackathon 2026 · Deadline: 20th May 2026, 11:59 PM IST*