# PocketTech: AI Customer Support Agent
## Enhanced Product Document & Technical Architecture
**Track 4 | Kasparro Hackathon 2026 | Team: Ridam & Mannu Gaurav**

---

# 1. The Problem & Market Context

PocketTech is a Shopify-based phone accessories store selling cases, cables, chargers, and screen protectors.

Like most small e-commerce stores, it relies heavily on asynchronous, email-based customer support — a channel fundamentally misaligned with how online impulse buyers behave.

When a customer is mid-purchase and has a friction-inducing question like:
- “Does this case fit my iPhone 15 Pro Max?”
- “What’s the return window if this doesn’t fit?”

they usually do not want to send an email and wait hours for a reply. Instead, many abandon the purchase completely.

PocketTech introduces a store-native, real-time AI conversational support layer that handles these questions instantly using live Shopify store data.

---

# 2. Technical Architecture & Request Flow

The project is built using a modern async architecture designed for fast execution and reliable AI-tool interaction.

## Tech Stack Blueprint

- **Frontend:** React + Vite — fast and responsive chat interface
- **Backend:** FastAPI (Python) — lightweight async API layer
- **AI Orchestration:** Groq API using `openai/gpt-oss-20b`
- **Data Layer:** Shopify Admin API for live product and order data

---

## End-to-End Request Pipeline

1. Customer sends a message through the chat interface
2. React frontend sends request to FastAPI backend via `POST /api/chat`
3. Backend forwards conversation and tool definitions to Groq
4. Groq determines whether external store data is needed
5. If needed, Groq triggers a tool call
6. Backend executes the corresponding Shopify API function
7. Shopify returns live data
8. Groq generates a grounded response using that data
9. Final reply is returned to the frontend

---

# 3. Capability Matrix (Core Tools)

The AI operates inside a controlled tool-based architecture to prevent hallucinations and ensure safe responses.

| Tool Name | Action Executed | Real-World Functionality |
|---|---|---|
| `get_product_info` | Fetches product information | Retrieves pricing, compatibility, variants, and specifications using Shopify product search |
| `get_order_status` | Retrieves live order tracking | Accepts customer-facing order numbers like `#1001` and returns fulfillment/tracking information |
| `initiate_return` | Handles return requests | Validates orders and simulates return workflows on development stores |
| `escalate_to_human` | Escalates complex issues | Transfers unsupported or sensitive cases to human support |

---

# 4. Key Product & Technical Engineering Decisions

## Decision 1: Chat-Based Support Instead of Static Forms

A conversational interface reduces customer friction and allows users to ask natural language questions instead of navigating complicated forms.

The challenge was ensuring reliable intent understanding, which was solved through:
- strict system prompts
- controlled tool access
- deterministic tool-calling behavior

---

## Decision 2: Grounded Responses Instead of LLM Guessing

The AI is explicitly prohibited from inventing product details or order information.

For example:
- product-specific queries must use `get_product_info`
- order tracking must use `get_order_status`

If information is unavailable, the assistant safely communicates the limitation instead of hallucinating.

---

## Decision 3: Synthetic Shopify Development Environment

The project runs on a Shopify development store populated with synthetic product data.

This allowed safe testing of:
- conflicting product compatibility
- return workflows
- edge-case tool behavior
- failure handling

without affecting real merchant data.

---

## Decision 4: Human Escalation as a Feature

Instead of hiding system limitations, unsupported queries are escalated cleanly to a human support workflow.

This creates a better customer experience compared to dead-end chatbot responses.

---

# 5. Development Log — Critical Bugs Fixed

During development, multiple engineering issues were identified and resolved:

## 1. Shopify Order Number vs Internal ID Problem

Shopify APIs require internal 13-digit IDs, while customers only know order numbers like `#1001`.

Solution:
- implemented name-based lookup using:
  `GET /orders.json?name=1001`
- resolved internal IDs before tracking requests

---

## 2. Tool Calling Failure with Initial LLM

The initially tested model generated tool calls as plain text instead of structured JSON.

Solution:
- switched to `openai/gpt-oss-20b`
- achieved reliable deterministic tool-calling behavior

---

## 3. Incorrect Return Line Item Mapping

Return logic originally used `line_item_id` instead of Shopify’s required `fulfillment_line_item_id`.

Solution:
- traced Shopify fulfillment object structure
- extracted correct fulfillment identifiers

---

## 4. Faulty Retry Logic

The backend retried all API failures, including permanent 400-level errors.

Solution:
- added `_is_retryable()`
- retries now occur only for:
  - HTTP 429
  - HTTP 5xx server errors

---

## 5. Tool Schema Mismatch

`escalate_to_human` incorrectly marked `reason` as mandatory while runtime logic treated it as optional.

Solution:
- corrected JSON schema configuration

---

# 6. Intentional Scope Limitations

Certain features were intentionally excluded to maximize core functionality within hackathon constraints.

## Excluded Features

- Merchant dashboards and analytics
- Production-grade return execution
- Payment gateway dispute handling
- Multi-language support
- Persistent long-term memory

---

## Shopify Returns Limitation

Shopify development stores restrict native return mutations.

Because of this:
- validation logic executes fully
- final return creation is simulated with mock success responses

---

## Payment & Billing Disputes

Payment-related issues are immediately escalated because of:
- security concerns
- legal sensitivity
- gateway integration complexity

---

# 7. Conclusion

PocketTech demonstrates how a lightweight AI agent can provide real-time customer support for Shopify stores using grounded tool-based AI orchestration.

The system combines:
- FastAPI
- Groq tool-calling
- Shopify Admin APIs
- controlled AI execution

to create a reliable customer support workflow capable of handling:
- product questions
- order tracking
- returns
- escalation handling

while minimizing hallucinations and maintaining deterministic behavior.

---

*PocketTech · Kasparro Hackathon 2026 · Team: Ridam & Mannu Gaurav*