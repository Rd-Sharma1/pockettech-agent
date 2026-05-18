import styles from "./LeftPanel.module.css";

const NAV_LINKS = ["Cases", "Cables", "Chargers", "Screen Guards"];

const TRUST_ITEMS = [
  { label: "Instant replies",     sub: "No wait time" },
  { label: "Live order tracking", sub: "Real-time status" },
  { label: "Hassle-free returns", sub: "7-day window" },
];

export default function LeftPanel() {
  return (
    <aside className={styles.panel}>

      <div className={styles.logo}>
        <div className={styles.logoMark}>P</div>
        <div>
          <div className={styles.logoName}>PocketTech</div>
          <div className={styles.logoSub}>Phone Accessories</div>
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.illustration}>
        <PhoneIllustration />
      </div>

      <div>
        <p className={styles.sectionLabel}>Why chat with us</p>
        <div className={styles.trustList}>
          {TRUST_ITEMS.map(({ label, sub }) => (
            <div key={label} className={styles.trustItem}>
              <span className={styles.trustLabel}>{label}</span>
              <span className={styles.trustSub}>{sub}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.divider} />

      <div>
        <p className={styles.sectionLabel}>Browse</p>
        <nav className={styles.navList}>
          {NAV_LINKS.map(link => (
            <div key={link} className={styles.navItem}>{link}</div>
          ))}
        </nav>
      </div>

      <div className={styles.onlineBadge}>
        <span className={styles.onlineDot} />
        <span className={styles.onlineLabel}>Agent online</span>
      </div>

    </aside>
  );
}

function PhoneIllustration() {
  return (
    <svg
      className={styles.illustrationSvg}
      width="90" height="140" viewBox="0 0 90 140" fill="none"
    >
      <rect x="8"  y="4"  width="74" height="132" rx="14" fill="var(--color-border)" />
      <rect x="11" y="7"  width="68" height="126" rx="12" fill="var(--color-bg)" />
      <rect x="18" y="20" width="40" height="4"   rx="2"  fill="var(--color-border-light)" />
      <rect x="18" y="30" width="28" height="3"   rx="1.5" fill="var(--color-text-muted)" opacity="0.4" />
      <rect x="18" y="44" width="54" height="22"  rx="5"  fill="var(--color-surface)" />
      <rect x="24" y="50" width="30" height="3"   rx="1.5" fill="var(--color-border-light)" />
      <rect x="24" y="57" width="20" height="2.5" rx="1.25" fill="var(--color-text-muted)" opacity="0.4" />
      <rect x="18" y="74" width="54" height="22"  rx="5"  fill="var(--color-accent-dim)" />
      <rect x="24" y="80" width="24" height="3"   rx="1.5" fill="var(--color-accent)" opacity="0.7" />
      <rect x="24" y="87" width="16" height="2.5" rx="1.25" fill="var(--color-accent)" opacity="0.3" />
      <rect x="18" y="104" width="54" height="10" rx="5"  fill="var(--color-surface)" />
      <circle cx="65" cy="109" r="4" fill="var(--color-accent)" opacity="0.8" />
      <rect x="34" y="122" width="22" height="3"  rx="1.5" fill="var(--color-border-light)" />
      <rect x="32" y="4"  width="26" height="5"   rx="2.5" fill="var(--color-bg)" />
    </svg>
  );
}