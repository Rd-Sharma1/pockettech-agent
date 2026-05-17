import { COLORS, FONT, SPACE, RADIUS, FF, TRANSITION } from "../constants/tokens";

const NAV_LINKS = ["Cases", "Cables", "Chargers", "Screen Guards"];

const TRUST_ITEMS = [
  { label: "Instant replies",       sub: "No wait time" },
  { label: "Live order tracking",   sub: "Real-time status" },
  { label: "Hassle-free returns",   sub: "7-day window" },
];

export default function LeftPanel() {
  return (
    <aside style={{
      width: 280,
      flexShrink: 0,
      background: COLORS.surface,
      borderRight: `1px solid ${COLORS.border}`,
      display: "flex",
      flexDirection: "column",
      padding: `${SPACE["3xl"]}px ${SPACE.xl}px`,
      gap: SPACE.xxl,
    }}>

      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: SPACE.md }}>
        <div style={{
          width: 30, height: 30,
          background: COLORS.accent,
          borderRadius: RADIUS.sm,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: FONT.base, color: "#000", fontWeight: 700,
          fontFamily: FF.display,
          flexShrink: 0,
        }}>P</div>
        <div>
          <div style={{ fontFamily: FF.display, fontSize: FONT.lg, color: COLORS.textPrimary, lineHeight: 1 }}>
            PocketTech
          </div>
          <div style={{ fontFamily: FF.body, fontSize: FONT.xs, color: COLORS.textMuted, letterSpacing: "0.08em", marginTop: 2 }}>
            PHONE ACCESSORIES
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: COLORS.border }} />

      {/* Illustration — SVG phone, no gradients */}
      <div style={{ display: "flex", justifyContent: "center", padding: `${SPACE.md}px 0` }}>
        <PhoneIllustration />
      </div>

      {/* Trust items */}
      <div style={{ display: "flex", flexDirection: "column", gap: SPACE.sm }}>
        <span style={{ fontFamily: FF.body, fontSize: FONT.xs, color: COLORS.textMuted, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Why chat with us
        </span>
        {TRUST_ITEMS.map(({ label, sub }) => (
          <div key={label} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: `${SPACE.sm}px ${SPACE.md}px`,
            border: `1px solid ${COLORS.border}`,
            borderRadius: RADIUS.md,
            background: COLORS.bg,
          }}>
            <span style={{ fontFamily: FF.body, fontSize: FONT.sm, color: COLORS.textPrimary }}>{label}</span>
            <span style={{ fontFamily: FF.body, fontSize: FONT.xs, color: COLORS.textMuted }}>{sub}</span>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: COLORS.border }} />

      {/* Nav links */}
      <div style={{ display: "flex", flexDirection: "column", gap: SPACE.xs }}>
        <span style={{ fontFamily: FF.body, fontSize: FONT.xs, color: COLORS.textMuted, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: SPACE.xs }}>
          Browse
        </span>
        {NAV_LINKS.map(link => (
          <div key={link} style={{
            fontFamily: FF.body,
            fontSize: FONT.sm,
            color: COLORS.textSecondary,
            padding: `${SPACE.sm}px ${SPACE.md}px`,
            borderRadius: RADIUS.sm,
            cursor: "default",
            transition: TRANSITION.fast,
          }}
            onMouseEnter={e => {
              e.currentTarget.style.background = COLORS.surfaceHover;
              e.currentTarget.style.color = COLORS.textPrimary;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = COLORS.textSecondary;
            }}
          >
            {link}
          </div>
        ))}
      </div>

      {/* Online badge — pushed to bottom */}
      <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: SPACE.sm }}>
        <div style={{
          width: 6, height: 6, borderRadius: "50%",
          background: COLORS.success,
          boxShadow: `0 0 6px ${COLORS.success}`,
          animation: "pulse 2.5s ease-in-out infinite",
        }} />
        <span style={{ fontFamily: FF.body, fontSize: FONT.xs, color: COLORS.textMuted }}>
          Agent online
        </span>
      </div>
    </aside>
  );
}

function PhoneIllustration() {
  return (
    <svg width="90" height="140" viewBox="0 0 90 140" fill="none"
      style={{ animation: "float 5s ease-in-out infinite" }}>
      {/* Body */}
      <rect x="8" y="4" width="74" height="132" rx="14" fill={COLORS.border} />
      <rect x="11" y="7" width="68" height="126" rx="12" fill={COLORS.bg} />
      {/* Screen content */}
      <rect x="18" y="20" width="40" height="4" rx="2" fill={COLORS.borderLight} />
      <rect x="18" y="30" width="28" height="3" rx="1.5" fill={COLORS.textMuted} opacity="0.4" />
      {/* Card 1 */}
      <rect x="18" y="44" width="54" height="22" rx="5" fill={COLORS.surface} />
      <rect x="24" y="50" width="30" height="3" rx="1.5" fill={COLORS.borderLight} />
      <rect x="24" y="57" width="20" height="2.5" rx="1.25" fill={COLORS.textMuted} opacity="0.4" />
      {/* Card 2 — accent highlight */}
      <rect x="18" y="74" width="54" height="22" rx="5" fill={COLORS.accentDim} />
      <rect x="24" y="80" width="24" height="3" rx="1.5" fill={COLORS.accent} opacity="0.7" />
      <rect x="24" y="87" width="16" height="2.5" rx="1.25" fill={COLORS.accent} opacity="0.3" />
      {/* Input bar */}
      <rect x="18" y="104" width="54" height="10" rx="5" fill={COLORS.surface} />
      <circle cx="65" cy="109" r="4" fill={COLORS.accent} opacity="0.8" />
      {/* Home indicator */}
      <rect x="34" y="122" width="22" height="3" rx="1.5" fill={COLORS.borderLight} />
      {/* Notch */}
      <rect x="32" y="4" width="26" height="5" rx="2.5" fill={COLORS.bg} />
    </svg>
  );
}