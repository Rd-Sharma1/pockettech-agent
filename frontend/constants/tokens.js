// ─── COLORS ──────────────────────────────────────────────────────────────────
export const COLORS = {
  // Base surfaces
  bg:          "#0a0a0a",
  surface:     "#111111",
  surfaceHover:"#161616",
  border:      "#1f1f1f",
  borderLight: "#2a2a2a",

  // Text
  textPrimary:   "#ededed",
  textSecondary: "#888888",
  textMuted:     "#444444",

  // Accent — single warm amber, no gradients
  accent:        "#e8c547",
  accentDim:     "rgba(232,197,71,0.12)",
  accentBorder:  "rgba(232,197,71,0.25)",

  // Semantic
  success:  "#4ade80",
  warning:  "#fb923c",
  white:    "#ffffff",
};

// ─── SPACING ─────────────────────────────────────────────────────────────────
export const SPACE = {
  xs:  4,
  sm:  8,
  md:  12,
  lg:  16,
  xl:  24,
  xxl: 32,
  "3xl": 48,
};

// ─── FONT SIZES ──────────────────────────────────────────────────────────────
export const FONT = {
  xs:   11,
  sm:   12,
  base: 14,
  md:   15,
  lg:   18,
  xl:   22,
  "2xl": 28,
  "3xl": 36,
};

// ─── RADII ───────────────────────────────────────────────────────────────────
export const RADIUS = {
  sm:  6,
  md:  10,
  lg:  14,
  full: 999,
};

// ─── FONT FAMILIES ───────────────────────────────────────────────────────────
export const FF = {
  display: "'Instrument Serif', Georgia, serif",
  body:    "'Geist', 'DM Sans', system-ui, sans-serif",
  mono:    "'Geist Mono', 'Fira Code', monospace",
};

// ─── TRANSITIONS ─────────────────────────────────────────────────────────────
export const TRANSITION = {
  fast:   "all 0.15s ease",
  normal: "all 0.25s ease",
  spring: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)",
};