"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { it } from "node:test";
import { act, useRef, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface NavItem {
  label: string;
  href: string;
  icon: string;         // Tabler icon class e.g. "ti ti-layout-dashboard"
  badge?: number;       // count badge
  live?: boolean;       // show green live chip instead of count
}

interface NavSection {
  label: string;
  items: NavItem[];
}

// ─── Nav config ───────────────────────────────────────────────────────────────

const NAV_SECTIONS: NavSection[] = [
  {
    label: "Manage",
    items: [
      { label: "Overview",    href: "/admin",                   icon: "ti ti-layout-dashboard" },
      { label: "Create Matches", href: "/admin/create-matches",           icon: "ti ti-ball-football",   badge: 8 },
      { label: "Commentary", href: "/admin/commentary",     icon: "ti ti-message-dots" },
      { label: "Update Matches",   href: "/admin/update-matches", icon: "ti ti-calendar" },
    ],
  },
];

function CountBadge({ count, active }: { count: number; active: boolean }) {
  return (
    <span style={active ? styles.countBadgeActive : styles.countBadge}>
      {count}
    </span>
  );
}

function NavLink({ item, selected}: { item: NavItem; selected: string}) {
    const active = selected === item.href  

  return (
    <Link href={item.href} style={{ textDecoration: "none" }}>
      <div style={active ? styles.navItemActive : styles.navItem}>
        <i className={item.icon} style={active ? styles.navIconActive : styles.navIcon} aria-hidden="true" />
        <span style={active ? styles.navLabelActive : styles.navLabel}>{item.label}</span>

        {item.badge !== undefined ? (
            <CountBadge count={item.badge} active={active} />
        ) : null}
      </div>
    </Link>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Tabler icons CDN — add to your layout.tsx <head> instead if preferred */}
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css"
      />

      <aside style={styles.sidebar}>
        {/* ── Brand ───────────────────────────── */}
        <div style={styles.brand}>
          <div style={styles.wordmark}>Sportz</div>
          <div style={styles.tagline}>Real-time match data</div>
          <div style={styles.adminTag}>
            <i className="ti ti-shield-check" style={{ fontSize: 9 }} aria-hidden="true" />
            Admin panel
          </div>
        </div>

        {/* ── Nav ─────────────────────────────── */}
        <nav style={styles.nav}>
          {NAV_SECTIONS.map((section, si) => (
            <div key={section.label}>
              {si > 0 && <div style={styles.divider} />}
              <div style={styles.sectionLabel}>{section.label}</div>
              {section.items.map((item) => {
                // exact match for /admin, prefix match for everything else

                return <NavLink 
                    key={item.href} 
                    item={item} 
                    selected={pathname}
                />;
              })}
            </div>
          ))}
        </nav>

        {/* ── User ────────────────────────────── */}
        <div style={styles.bottom}>
          <div style={styles.userRow}>
            <div style={styles.avatar}>AK</div>
            <div style={styles.userInfo}>
              <div style={styles.userName}>Arjun Kumar</div>
              <div style={styles.userRole}>admin@sportz.io</div>
            </div>
            <i className="ti ti-chevron-down" style={styles.userArrow} aria-hidden="true" />
          </div>
        </div>
      </aside>
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const YELLOW = "#FCDA3D";
const DARK   = "#1f1f1f";

const styles: Record<string, React.CSSProperties> = {
  sidebar: {
    width: 220,
    minWidth: 220,
    background: "#1a1a1a",
    borderRight: `2px solid ${DARK}`,
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    fontFamily: "var(--font-ui, 'Barlow', sans-serif)",
  },

  // Brand
  brand: {
    padding: "20px 18px 16px",
    borderBottom: `2px solid ${DARK}`,
  },
  wordmark: {
    fontSize: 22,
    fontWeight: 900,
    color: "#fcd932",
    letterSpacing: "-0.5px",
    lineHeight: 1,
  },
  tagline: {
    fontSize: 11,
    color: "white",
    opacity: 0.55,
    marginTop: 3,
    fontWeight: 400,
  },
  adminTag: {
    marginTop: 8,
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    background: "#36311d",
    color: "#fcd932",
    fontSize: 9,
    fontWeight: 700,
    padding: "4px 7px",
    borderRadius: 4,
    letterSpacing: "0.04em",
  },

  // Nav
  nav: {
    flex: 1,
    padding: "10px 10px",
    overflowY: "auto",
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: 700,
    color: "#dfdfdf",
    opacity: 0.4,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    padding: "14px 8px 5px",
  },
  divider: {
    height: 2,
    background: "#1a1a1a",
    opacity: 0.1,
    margin: "8px 10px",
  },

  // Nav items
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "9px 10px",
    borderRadius: 8,
    cursor: "pointer",
    color: "#dfdfdf",
    fontSize: 13,
    fontWeight: 500,
    border: "2px solid transparent",
    marginBottom: 1,
    transition: "background 0.12s",
    textDecoration: "none",
  },
  navItemActive: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "9px 10px",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 600,
    border: `2px solid ${DARK}`,
    marginBottom: 1,
    background: "#fcd932",
    color: "#1a1a1a",
    textDecoration: "none",
  },
  navIcon: {
    fontSize: 17,
    flexShrink: 0,
    color: "#dfdfdf",
  },
  navIconActive: {
    fontSize: 17,
    flexShrink: 0,
    color: "#1a1a1a",
  },
  navLabel: {
    flex: 1,
    color: "#dfdfdf",
  },
  navLabelActive: {
    flex: 1,
    color: "#1a1a1a",
  },

  // Badges
  countBadge: {
    marginLeft: "auto",
    background: "#fcd9326a",
    color: "#fcd932",
    fontSize: 10,
    fontWeight: 700,
    padding: "2px 7px",
    borderRadius: 20,
    lineHeight: 1.4,
  },
  countBadgeActive: {
    marginLeft: "auto",
    background: "#dfdfdf",
    color: DARK,
    fontSize: 10,
    fontWeight: 700,
    padding: "2px 7px",
    borderRadius: 20,
    lineHeight: 1.4,
  },
  liveChip: {
    marginLeft: "auto",
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    background: "rgba(0,0,0,0.14)",
    color: DARK,
    fontSize: 10,
    fontWeight: 700,
    padding: "2px 8px",
    borderRadius: 20,
  },
  liveDot: {
    width: 5,
    height: 5,
    borderRadius: "50%",
    background: "#4ade80",
    flexShrink: 0,
  },

  // User row
  bottom: {
    padding: "12px 10px",
    borderTop: `2px solid ${DARK}`,
  },
  userRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "8px 10px",
    borderRadius: 8,
    cursor: "pointer",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 8,
    background: "#fcd932",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    fontWeight: 700,
    color: "#1a1a1a",
    flexShrink: 0,
    border: `2px solid ${DARK}`,
  },
  userInfo: {
    flex: 1,
    minWidth: 0,
  },
  userName: {
    fontSize: 12,
    fontWeight: 700,
    color: "#dfdfdf",
    lineHeight: 1.2,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  userRole: {
    fontSize: 10,
    color: "#dfdfdf",
    opacity: 0.5,
    lineHeight: 1.3,
  },
  userArrow: {
    color: "#dfdfdf",
    opacity: 0.3,
    fontSize: 14,
  },
};