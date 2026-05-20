export const SUGGESTIONS = [
  { icon: "⌕",  label: "Track my order",     message: "Where is my order?" },
  { icon: "↩",  label: "Return an item",      message: "I want to return an item I purchased" },
  { icon: "⚡", label: "Compatibility check", message: "Does the item works with my phone?" },
  { icon: "◻",  label: "Warranty policy",     message: "What is your warranty policy?" },
];

export const TOOL_LABELS = {
  get_product_info:  "Checking product info",
  get_order_status:  "Fetching order status",
  initiate_return:   "Processing return",
  escalate_to_human: "Connecting to team",
};

export const INITIAL_MESSAGE = {
  role: "assistant",
  content: "Hey — I'm PocketTech's support agent. Ask me anything about our products, your order, or returns.",
};