# PocketTech: AI Customer Support Agent
## Enhanced Technical Document — Architecture, Workflows & Implementation Details
**Track 4 | Kasparro Hackathon 2026 | Team: Ridam & Mannu Gaurav**

---

# 1. System Architecture

The PocketTech AI Customer Support system is a decoupled two-tier web application designed for fast asynchronous execution.

A React frontend communicates with an asynchronous FastAPI backend through a REST API endpoint. The backend manages the AI orchestration loop and interacts directly with the Shopify Admin API for live product and order data.

---

## 1.1 Component Overview

| Component | Architecture & Design Role |
|---|---|
| **React + Vite** | Lightweight storefront chat interface that sends messages, session IDs, and conversation history |
| **FastAPI (Python)** | Async REST backend responsible for request routing and agent execution |
| **`services/agent.py`** | Core AI orchestration engine managing prompts, tool-calling, and response generation |
| **`services/shopify.py`** | Shopify integration layer handling product, order, and return operations |
| **`tools/definition.py`** | Central schema repository describing available tools to the model |
| **Shopify Sandbox Store** | Development environment populated with synthetic phone accessory data and simulated orders |

---

## 1.2 End-to-End Request & Data Pipeline

1. Customer enters a message through the React chat interface
2. Frontend sends a request to `POST /api/chat`
3. FastAPI validates the payload and invokes `run_agent()`
4. Backend compiles:
   - system prompt
   - conversation history
   - tool definitions
5. Groq evaluates user intent
6. If external data is required, Groq triggers a tool call
7. Backend executes the matching Python function
8. Shopify Admin API returns live data
9. Backend serializes tool output and sends it back to Groq
10. Groq generates a grounded response
11. Final response is returned to the frontend UI

---

# 2. Key Implementation Decisions

## 2.1 AI vs Deterministic Boundaries

The Large Language Model is responsible for:
- intent understanding
- conversational flow
- tool selection
- response generation

Deterministic Python code handles:
- API calls
- retries
- validation
- Shopify communication
- structured data processing

The model never directly accesses external systems. It only decides which action should be executed.

---

## 2.2 Tool-Calling Loop Constraints

The orchestration engine uses a maximum iteration limit of 5 loops to prevent:
- recursive tool calls
- infinite execution
- excessive token usage

Most requests complete within 1–2 iterations.

---

## 2.3 Conversation History Management

The backend is intentionally stateless.

The React frontend sends the entire conversation history with every request instead of relying on persistent server-side memory.

This simplifies deployment and reduces backend complexity.

---

## 2.4 Strict Grounding & Prompt Engineering

The system prompt enforces strict operational rules to minimize hallucinations.

### Rules Enforced

1. Product-related questions must use `get_product_info`
2. Order tracking must use `get_order_status`
3. Returns must trigger `initiate_return`
4. Financial disputes and damaged-item cases must escalate using `escalate_to_human`

The assistant is explicitly prohibited from inventing product or order information.

---

# 3. Resilience & Failure Mode Engineering

## 3.1 Shopify Integration Failures

### Timeout Protection
- `httpx` timeout set to 10 seconds
- prevents hanging API calls

### Missing Product or Order
- returns clean structured error payload
- assistant informs customer safely

### Shopify Server Errors (5xx)
- intercepted and converted into safe responses
- assistant suggests contacting support if needed

---

## 3.2 AI Layer Failure Handling

### Permanent Errors (400)
- checked using `_is_retryable()`
- retries are skipped

### Transient Errors (429 / 5xx)
- one automatic retry is triggered

### Loop Limit Protection
- if loop exceeds 5 iterations:
  - execution exits safely
  - customer receives fallback support guidance

---

# 4. Production Refactoring & Bug Fixes

## 1. Order Number Resolution

Customers know order numbers like `#1001`, but Shopify APIs require internal IDs.

Solution:
- implemented lookup using:
  `GET /orders.json?name=1001`
- resolved internal IDs automatically

---

## 2. Structured Tool Calling Failure

The initially tested model generated tool calls as plain text instead of structured JSON.

Solution:
- migrated to `openai/gpt-oss-20b`
- achieved reliable tool-calling behavior

---

## 3. Fulfillment ID Mapping

Return processing initially used incorrect line item identifiers.

Solution:
- extracted proper `fulfillment_line_item_id`
- aligned return workflow with Shopify structure

---

## 4. Retry Logic Optimization

The retry layer previously retried all HTTP failures.

Solution:
- implemented `_is_retryable()`
- retries now occur only for:
  - rate limits (429)
  - server failures (5xx)

---

## 5. Schema Validation Fix

`escalate_to_human` incorrectly marked `reason` as mandatory.

Solution:
- updated schema:
  `"required": []`

---

## 6. Product Search Improvements

Originally only numeric product IDs worked.

Solution:
- added title-based fallback search
- enabled natural language product queries

---

## 7. Credential Security Fix

Updated Shopify authentication to use:
- `shpat_` admin tokens

instead of storefront access tokens.

---

## 8. HTML Sanitization

Implemented `_strip_html(html)` to clean Shopify product descriptions before rendering.

---

# 5. Scope Limitations & Future Roadmap

## Current Limitations

- English-only support
- No persistent session memory
- Development-store-only returns
- No payment dispute automation
- No authentication layer

---

## Future Improvements

- Email verification & identity validation
- Streaming AI responses
- Redis-backed session persistence
- Proactive webhook notifications
- Production Shopify deployment

---

# 6. Conclusion

PocketTech demonstrates a grounded AI customer support architecture built around:
- FastAPI
- Groq tool-calling
- Shopify Admin APIs
- deterministic backend execution

The system handles:
- product inquiries
- order tracking
- return workflows
- escalation handling

while maintaining strict operational boundaries and minimizing hallucinations.

---

*PocketTech · Kasparro Hackathon 2026 · Team: Ridam & Mannu Gaurav*