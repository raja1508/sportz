// components/commentary/CommentaryPanel.tsx
"use client";

import React from "react";
import CommentaryCard, {
  CommentaryEvent,
} from "@/components/commentary/CommentaryCard";

// ─── Props ────────────────────────────────────────────────────────────────────

interface CommentaryPanelProps {
  /** Pass events to show live feed; omit or pass empty array for empty state */
  events?: CommentaryEvent[];
  /** Whether the websocket / polling connection is live */
  connected?: boolean;
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div style={emptyStyles.wrapper}>
      {/* Dashed outer border is on the parent — handled by panel shell */}
      <div style={emptyStyles.iconWrap}>
        {/* Camera icon */}
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#92400E"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M23 7L16 12l7 5V7z" />
          <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
        </svg>
      </div>
      <p style={emptyStyles.heading}>No Match Selected</p>
      <p style={emptyStyles.sub}>
        Select a match from the list to view live commentary and real-time
        updates.
      </p>
    </div>
  );
}

// ─── CommentaryPanel ──────────────────────────────────────────────────────────

export default function CommentaryPanel({
  events = [],
  connected = false
}: CommentaryPanelProps) {
  const isEmpty = events.length === 0;

  return (
    <div
      className="commentary-panel"
      style={isEmpty ? panelStyles.emptyShell : panelStyles.shell}
    >
      {isEmpty ? (
        <EmptyState />
      ) : (
        <>
          {/* ── Header ─────────────────────────────── */}
          <div style={panelStyles.header}>
            <span style={panelStyles.title}>Live Commentary</span>

            {/* Real-time / connected badge */}
            {connected ? (
              <span className="live-connected-badge" style={panelStyles.badge}>

                Real-time
              </span>
            ) : (
              <span style={panelStyles.offlineBadge}>Real-time</span>
            )}
          </div>

          {/* ── Feed ───────────────────────────────── */}
          <div
            className="commentary-scroll"
            style={panelStyles.feed}
          >
            {events.map((ev, idx) => (
              <CommentaryCard
                key={`${ev.sequence}-${idx}`}
                event={ev}
                live={idx === 0} /* only the top event gets the live pulse */
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// display: "flex",
// flexDirection: "column",
// height: "100%",        // fill parent
// maxHeight: "100vh",    // safety cap
// minHeight: "400px",

const panelStyles: Record<string, React.CSSProperties> = {
  shell: {
    background: "#fefefe",
    border: "2px solid #1f1f1f",
    borderRadius: "14px",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    maxHeight: "100vh",
    minHeight: "400px",
    boxShadow :
  ` 1px 1px 0 #1F1F1F,
    2px 2px 0 #1F1F1F,
    3px 3px 0 #1F1F1F,
    4px 4px 0 #1F1F1F,
    3px 3px 0 #1F1F1F,
    4px 4px 0 #1F1F1F
    `
  },
  emptyShell: {
    // background: "#FAFAFA",
    border: "2px dashed #D1D5DB",
    borderRadius: "14px",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    minHeight: "400px",
    maxHeight: "100vh",

  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 18px 12px",
    background: "#afe1fc",
    borderBottom: "2px solid #040404",
    flexShrink: 0,
  },
  title: {
    fontFamily: "var(--font-display, 'Barlow Condensed', sans-serif)",
    fontSize: "1.1rem",
    fontWeight: 800,
    letterSpacing: "0.02em",
    color: "#111827",
  },
  badge: {
    /* inherits .live-connected-badge from globals.css */
    border: "2px solid #040404",
    borderRadius: 8,
  },
  offlineBadge: {
    display: "inline-flex",
    alignItems: "center",
    padding: "4px 12px",
    borderRadius: "12px",
    border: "1.5px solid #D1D5DB",
    background: "#FFFFFF",
    fontFamily: "var(--font-ui, 'Barlow', sans-serif)",
    fontSize: "0.75rem",
    fontWeight: 700,
    color: "#6B7280",
  },
  feed: {
    flex: 1,
    overflowY: "auto" as const,
    padding: "16px 18px 8px",
    display: "flex",
    flexDirection: "column",
    gap: "28px"
  },
};

const emptyStyles: Record<string, React.CSSProperties> = {
  wrapper: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 32px",
    gap: "12px",
    textAlign: "center",
  },
  iconWrap: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    background: "#F5C800",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "4px",
  },
  heading: {
    fontFamily: "var(--font-ui, 'Barlow', sans-serif)",
    fontSize: "1.05rem",
    fontWeight: 700,
    color: "#111827",
  },
  sub: {
    fontFamily: "var(--font-ui, 'Barlow', sans-serif)",
    fontSize: "0.875rem",
    fontWeight: 400,
    color: "#6B7280",
    lineHeight: 1.55,
    maxWidth: "240px",
  },
};