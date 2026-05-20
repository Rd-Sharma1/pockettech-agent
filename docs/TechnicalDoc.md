# PocketTech: AI Customer Support Agent
## Enhanced Technical Document — Architecture, Workflows & Implementation Details
**Track 4 | Kasparro Hackathon 2026 | Team: Ridam & Mannu Gaurav**

---

## 1. System Architecture

The PocketTech AI Customer Support system is a robust, decoupled, two-tier web application designed for instantaneous asynchronous execution. A modern React frontend communicates seamlessly with an asynchronous FastAPI backend via a single REST API gateway endpoint. The backend runs the core AI agent orchestration loop and directly mutates or fetches live store metrics via the Shopify Admin API.

### 1.1 Component Overview

| Component | Architecture & Design Role |
| :--- | :--- |
| **React + Vite** | Lightweight, high-performance storefront Chat UI. Dispatches payloads containing messages, unique session tokens, and current thread history. |
| **FastAPI (Python)** | Asynchronous REST backend layer. Acts as a thin router that receives user requests, handles parsing exceptions, and triggers the agent runtime. |
| **`services/agent.py`** | The AI Core Engine. Manages the orchestration loop, formatting rules, context injection, and structural validation. |
| **`services/shopify.py`** | Hardened integration layer executing asynchronous endpoint operations and exception filtering against the Shopify Admin API. |
| **`tools/definitions.py`** | Central declarative repository containing structured schemas that describe backend functionality to the model. |
| **Shopify Sandbox Store** | Development store sandbox populated with diverse phone accessory stock and simulated orders to safely run complex operational scenarios. |

### 1.2 End-to-End Request & Data Pipeline

Every interaction steps through a strict synchronous network routing flow:

1. [cite_start]**Input:** [React Chat Widget] — Captures customer input (e.g., "Where is my order #1001?") [cite: 1, 2]
2. [cite_start]**Payload:** [POST /api/chat] — Packs current string, full array history, and metadata UUID [cite: 1, 3]
3. [cite_start]**Routing:** [FastAPI Router] — Handshakes incoming data shapes and invokes `run_agent()` [cite: 3]
4. [cite_start]**Orchestration:** [Groq Core Engine] — Compiles system prompts and converts unified Tool Definitions [cite: 1]
5. [cite_start]**Intent Check:** [Intent Check Loop] — Groq evaluates text; requests a tool if external context is missing [cite: 1]
6. [cite_start]**Execution:** [Python Execution] — Backend executes local function (e.g., matching the customer order number) [cite: 1]
7. [cite_start]**Data Fetch:** [Shopify Admin API] — Pulls live fulfillment information using specific data parameters [cite: 1, 2]
8. [cite_start]**Grounding:** [Grounding Loop] — Raw data is serialized into JSON text and handed back to Groq [cite: 1]
9. [cite_start]**Response:** [Response Compilation] — Groq processes data constraints to draft a clean text string [cite: 1]
10. [cite_start]**Delivery:** [Network Return] — Payload passes tool flags back to UI, showing badges and text to the customer [cite: 1]

---

## 2. Key Implementation Decisions

### 2.1 AI vs. Deterministic Boundaries
Intent processing, context assembly, contextual policy routing, and semantic conversation compilation are assigned entirely to the Large Language Model. Deterministic Python application code manages infrastructure operations: network connectivity to external platforms, routing executions, handling error retries, and data transformations. [cite_start]The model is never permitted to query a third-party datastore or compute structured objects directly; it identifies actions, while deterministic code carries them out[cite: 3].

### 2.2 Tool-Calling Loop Constraints
The orchestration engine uses a rigid constraint loop that stops executing after 5 iterations, preventing recursion loops and runaway token usage. [cite_start]Most user requests resolve quickly inside 1 to 2 iterations[cite: 3].

### 2.3 Conversation History State Modality
To maintain a simpler, stateless backend structure, the React client passes the entire chat history array back with each network query. [cite_start]The server does not persist memory across distinct API calls[cite: 3].

### 2.4 System Prompt Engineering & Strict Grounding
[cite_start]The orchestration engine uses a system prompt that blocks hallucinated outputs by implementing strict operational boundaries[cite: 3]:
1. [cite_start]**Catalog Inquiries:** The agent is blocked from utilizing generic training memory weights; it must query the catalog database using `get_product_info`[cite: 3].
2. [cite_start]**Order Trailing:** The agent is prohibited from predicting delivery windows; it must query information using `get_order_status`[cite: 3].
3. [cite_start]**Action Requirements:** The agent must directly initiate the database operation using `initiate_return` rather than explaining how to do so[cite: 3].
4. [cite_start]**Escalation Thresholds:** Financial disputes and damaged merchandise claims are routed out of automated flows and passed to human agents via `escalate_to_human`[cite: 3].

---

## 3. Resilience & Failure Mode Engineering

### 3.1 Shopify Integration Exceptions
* [cite_start]**Shopify Gateway Timeout:** A 10-second `httpx` timeout limits hanging calls, returning a localized exception block[cite: 3].
* **Product/Order Missing (404):** Returns `{error: 'Not found'}`. [cite_start]The agent handles this cleanly and alerts the customer[cite: 3].
* [cite_start]**Remote Server Faults (5xx):** Intercepted and mapped to a clean dictionary response, allowing the agent to suggest reaching out to manual support lines[cite: 3].

### 3.2 AI Layer Execution Faults
* **Permanent API Errors (400):** Evaluated via a custom checking function `_is_retryable()`. [cite_start]System skips retries to avoid loop blocks[cite: 1, 3].
* [cite_start]**Transient Network Errors (429/5xx):** Triggers one automatic retry[cite: 3].
* [cite_start]**Loop Boundary Breached:** If the tool orchestration loop passes the 5-iteration limit, it forces a clean exit and returns an option to contact support[cite: 3].

---

## 4. Production Refactoring & Bug-Fix Log

1. [cite_start]**Order Identity Resolution:** Fixed `get_order_status` and `initiate_return` to perform a lookup by order name (`name=1001`) before calling tracking workflows, bypassing the need for internal 13-digit IDs[cite: 1, 3].
2. [cite_start]**Structured Output Crash:** Switched AI engine to `openai/gpt-oss-20b` on Groq to resolve plain-text vs. JSON formatting issues found in previous models[cite: 1, 3].
3. [cite_start]**Fulfillment ID Mapping:** Correctly mapped `fulfillment_line_item_id` in the return engine[cite: 1, 3].
4. [cite_start]**Retry Logic Optimization:** Implemented `_is_retryable()` to prevent retrying permanent 400-series errors[cite: 1, 3].
5. [cite_start]**Schema Parameter Fix:** Corrected `escalate_to_human` parameters to ` "required": []` to prevent system crashes[cite: 1, 3].
6. [cite_start]**Product Search Fallback:** Added name-based title fallback (`/products.json?title=...`) to support natural language queries[cite: 1, 3].
7. [cite_start]**Credential Security:** Updated credential profiles to use `shpat_` (admin) tokens instead of storefront tokens[cite: 1, 3].
8. [cite_start]**HTML Sanitization:** Implemented `_strip_html(html)` to clean product descriptions before rendering[cite: 1, 3].

---

## 5. System Scope Limits & Future Roadmap

* [cite_start]**Limitations:** English only; no session persistence; target development store only; no payment dispute handling; no authentication[cite: 3].
* [cite_start]**Roadmap:** Implement identity handshaking (email verification); transition to streaming responses; migrate session state to Redis; build proactive webhook notifications[cite: 3].

*PocketTech · Kasparro Hackathon 2026 · Team: Ridam & Mannu Gaurav*