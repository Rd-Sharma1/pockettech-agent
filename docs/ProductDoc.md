# PocketTech: AI Customer Support Agent
## Enhanced Product Document & Technical Architecture
**Track 4 | Kasparro Hackathon 2026 | Team: Ridam & Mannu Gaurav**

---

## 1. The Problem & Market Context

[cite_start]PocketTech is a Shopify-based phone accessories store selling cases, cables, chargers, and screen protectors[cite: 5]. [cite_start]Like most small e-commerce stores, it relies heavily on asynchronous, email-based customer support—a channel fundamentally misaligned with how online impulse buyers behave[cite: 6].

[cite_start]When a customer is mid-purchase and has a friction-inducing question (*"Does this case fit my iPhone 15 Pro Max?"* or *"What's the return window if this doesn't fit?"*), they refuse to send an email and wait 24 hours[cite: 7, 8]. [cite_start]Instead, they abandon their carts and the sale is lost[cite: 9]. [cite_start]PocketTech introduces a store-native, real-time AI conversational layer to intercept these drop-offs exactly when the query matters[cite: 11, 22].

---

## 2. Technical Architecture & Request Flow

The project is built using a modern, decoupled async stack designed for instantaneous execution.

### Tech Stack Blueprint
* [cite_start]**Frontend:** React + Vite — Selected for building a fast, responsive, mobile-first chat widget embedded into the storefront[cite: 3].
* [cite_start]**Backend:** FastAPI (Python) — Handles asynchronous, lightweight API routing endpoints[cite: 3].
* **AI Orchestration:** Groq API leveraging the `openai/gpt-oss-20b` model — Chosen for its blazing-fast inference speeds and reliable, deterministic tool-calling capabilities.
* [cite_start]**Data Layer:** Shopify Admin API — Connects the agent to live product catalogs and real-time order tracking data[cite: 3].

### End-to-End Request Pipeline
1. [cite_start]**Customer input:** A buyer types a natural language message (e.g., *"Where is my order #1001?"*) into the chat interface[cite: 2, 8].
2. **API Request:** The React frontend dispatches a payload to the FastAPI backend via the `POST /api/chat` endpoint.
3. **AI Interpretation:** The backend compiles the conversation history and forwards it to the Groq API along with specific tool definitions.
4. [cite_start]**Tool Selection:** Groq parses the user's intent, realizes it requires external store data, and signals a tool request for `get_order_status`[cite: 2, 8].
5. **Data Retrieval:** The backend executes the corresponding function inside the Shopify service file, triggering a query to the Shopify Admin API.
6. **Grounding:** Shopify returns the live tracking metadata, which the backend pipes back to the Groq model to generate an accurate, hallucination-free answer.
7. **Response Delivery:** The final response is passed back through the FastAPI router to the React frontend, where it instantly renders for the customer.

---

## 3. Capability Matrix (The 4 Core Tools)

To maintain absolute system safety and eliminate hallucinations, the agent operates inside a rigid boundary of four specialized tools defined in `tools/definition.py`. [cite_start]It is strictly prohibited from guessing or acting outside these functional wrappers[cite: 45].

| Tool Name | Action Executed | Technical Real-World Resolution |
| :--- | :--- | :--- |
| [cite_start]`get_product_info` [cite: 6, 25] | [cite_start]Fetches live store inventory catalog data[cite: 26]. | Accepts numeric Shopify product IDs or search strings (e.g., "USB-C") to parse pricing, specs, inventory variants, and device compatibility. |
| [cite_start]`get_order_status` [cite: 6, 29] | [cite_start]Pulls live tracking metadata directly from Shopify[cite: 30]. | Takes customer-facing order numbers (e.g., `#1001`), strips formatting, extracts tracking numbers, and updates fulfillment details live. |
| [cite_start]`initiate_return` [cite: 6, 31] | [cite_start]Safely automates store return requests[cite: 32]. | Locates the order via name lookup, validates fulfillment lifecycle markers, and triggers/simulates a return request workflow. |
| [cite_start]`escalate_to_human` [cite: 6, 34] | [cite_start]Gracefully hands off the interaction[cite: 35]. | [cite_start]Flags complex edge cases (payment disputes, damaged items) and transfers the chat session forward with saved context[cite: 35, 55]. |

---

## 4. Key Product & Technical Engineering Decisions

* **Decision 1: Chat UI over Static Support Forms**
  [cite_start]A conversational chat interface minimizes cognitive friction[cite: 41]. [cite_start]Buyers do not think in structured dropdowns[cite: 40]. [cite_start]The trade-off is ensuring robust Natural Language Understanding (NLU), which we resolved through strict system prompt boundaries and tool-call constraints[cite: 42].
* **Decision 2: Grounded Token Architecture vs. LLM Hallucinations**
  [cite_start]To stop the AI from making up device specifications, the system prompt explicitly forbids the model from answering product-specific queries from its base training weights[cite: 67, 69]. [cite_start]It must poll the live Shopify API via `get_product_info`[cite: 67]. [cite_start]If a product isn't found, it safely flags the omission instead of guessing[cite: 68].
* **Decision 3: Synthetic Data Sandbox**
  [cite_start]The system runs against a Shopify development store populated with synthetic phone accessories data[cite: 47]. [cite_start]This allowed us to explicitly configure conflicting edge cases (such as overlapping device compatibilities) and stress-test the boundary constraints of our tool triggers without mutating live merchant databases[cite: 48, 49].
* **Decision 4: Deterministic AI Failure Handling (Escalation)**
  [cite_start]We designed human escalation as a premium fallback feature rather than hiding system limitations[cite: 51]. [cite_start]When an issue falls outside our four defined tools, the agent performs a contextual handoff, ensuring a premium user experience rather than a conversational dead end[cite: 35, 51, 52].

---

## 5. Development Log: Production Bugs Fixed

[cite_start]During implementation, we identified and resolved 10 critical bugs to transition the codebase from a fragile prototype into a resilient, hackathon-ready agent[cite: 10]:

1. **The Order Identity Paradox (Shopify API vs. Customer Expectation):** The native Shopify API requires an internal 13-digit system database ID for individual order queries. Real customers only know their visible checkout invoice number (e.g., `#1001`). We overhauled `get_order_status` and `initiate_return` to perform an initial query using the string-matching parameter `GET /orders.json?name=1001`, resolving the internal ID under the hood before tracking data is called.
2. **The LLM Structural Breakdown (Llama-3.3-70b vs. GPT-OSS-20b):** We initially configured `llama-3.3-70b-versatile`, but it persistently generated tool calls as raw markdown text blocks instead of structured JSON objects. We switched the AI routing layer to `openai/gpt-oss-20b`, which handles native tool-calling schemas deterministically.
3. **Fulfillment Object Line Mapping Failure:** The return initiation function threw errors because it attempted to pass raw `line_item_id` values directly to Shopify's return endpoints. We traced the deep data trees of the Shopify API payload and refactored the logic to cleanly extract the correct `fulfillment_line_item_id`.
4. **Infinite API Error Escalation Loops:** The backend's automated network retry logic executed indiscriminately on *all* HTTP failures, creating massive transaction blocks on permanent, un-retryable mistakes (like a 400 Bad Request syntax error). We implemented a custom validation wrapper `_is_retryable()` that selectively retries exceptions only when hitting rate-limiting constraints (HTTP 429) or remote server drops (HTTP 5xx).
5. **Schema Parameter Disconnect:** The `escalate_to_human` schema marked the `reason` field as strictly mandatory, whereas the runtime execution engine treated it as entirely optional, generating internal engine crashes. We modified the JSON schema mapping inside `tools/definition.py` to correctly identify the collection as `"required": []`.

---

## 6. Documented Project Exclusions (Intentional Scope)

Scope choices are as vital as what is actively engineered. [cite_start]To maximize judge-visible impact inside a tight hackathon timeline, the following features were deliberately excluded[cite: 54]:

* **Merchant Dashboards & Analytics:** Out of scope for this buyer-centric agent. [cite_start]It adds immense backend database complexity without providing immediate, judge-visible frontend value[cite: 55].
* **Live Return Executions:** Shopify blocks native `POST /returns.json` mutations on free development store accounts. Thus, our return engine processes data validation live but returns a clean, mock-simulated success payload.
* [cite_start]**Payment Gateways & Disputes:** Because of legal sensitivity and gateway integration security overhead, any payment or billing discrepancies bypass autonomous processing and are immediately shuttled to human escalation channels[cite: 55].

---
[cite_start]*PocketTech · Kasparro Hackathon 2026 · Team: Ridam & Mannu Gaurav* [cite: 3]