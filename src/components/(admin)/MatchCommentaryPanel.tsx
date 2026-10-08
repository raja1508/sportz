"use client";

import React from "react";
import {
  CommentaryEventData,
  CommentaryEventRow,
} from "./CommentaryEventRow";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MatchInfo {
  sport:     string;
  homeTeam:  string;
  awayTeam:  string;
  homeScore: number;
  awayScore: number;
  status:    "live" | "scheduled" | "finished" | "postponed" | "cancelled";
  period?:   string;   // e.g. "1st innings", "2nd half"
  minute?:   number;
}

interface MatchCommentaryPanelProps {
  match:   MatchInfo;
  events?: CommentaryEventData[];
}

// ─── Design tokens ────────────────────────────────────────────────────────────

const DARK        = "#1f1f1f";
const YELLOW      = "#FCDA3D";
const FONT_UI     = "var(--font-ui, 'Barlow', sans-serif)";
const FONT_DISPLAY = "var(--font-display, 'Barlow Condensed', sans-serif)";

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  live:      { dot: "#DC2626", label: "Live",      bg: "#FEE2E2", text: "#DC2626" },
  scheduled: { dot: "#1D4ED8", label: "Scheduled", bg: "#DBEAFE", text: "#1D4ED8" },
  finished:  { dot: "#065F46", label: "Finished",  bg: "#D1FAE5", text: "#065F46" },
  postponed: { dot: "#D97706", label: "Postponed", bg: "#FEF3C7", text: "#D97706" },
  cancelled: { dot: "#6B7280", label: "Cancelled", bg: "#F3F4F6", text: "#6B7280" },
};

// ─── MatchHeader ──────────────────────────────────────────────────────────────

function MatchHeader({ match }: { match: MatchInfo }) {
  const st = STATUS_CONFIG[match.status] ?? STATUS_CONFIG.live;

  return (
    <div style={h.shell}>
      {/* Top row — sport badge + status */}
      <div style={h.topRow}>
        <span style={h.sportBadge}>{match.sport.toUpperCase()}</span>
        <div style={h.statusPill}>
          <span style={{ ...h.statusDot, background: st.dot }} />
          <span style={{ ...h.statusLabel, color: st.text }}>{st.label}</span>
        </div>
      </div>

      {/* Teams + score */}
      <div style={h.teamsRow}>
        <span style={h.teamName}>{match.homeTeam}</span>

        <div style={h.scoreBlock}>
          <span style={h.scoreBox}>{match.homeScore}</span>
          <span style={h.scoreSep}>—</span>
          <span style={h.scoreBox}>{match.awayScore}</span>
        </div>

        <span style={{ ...h.teamName, textAlign: "right" }}>{match.awayTeam}</span>
      </div>

      {/* Period + minute */}
      {(match.period || match.minute !== undefined) && (
        <div style={h.metaRow}>
          {match.period && <span style={h.metaItem}>{match.period}</span>}
          {match.period && match.minute !== undefined && (
            <span style={h.metaDot}>·</span>
          )}
          {match.minute !== undefined && (
            <span style={h.metaItem}>{match.minute}'</span>
          )}
        </div>
      )}
    </div>
  );
}

const h: Record<string, React.CSSProperties> = {
  shell: {
    padding: "18px 20px 16px",
    // borderBottom: `2px solid ${DARK}`,
    margin: 4,
    marginBottom: 4,
    backgroundColor: "#ffffff",
    borderRadius: 14
  },
  topRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  sportBadge: {
    fontFamily: FONT_DISPLAY,
    fontSize: "0.6rem",
    fontWeight: 800,
    color: "#6B7280",
    background: "#F3F4F6",
    border: "1.5px solid #E5E7EB",
    padding: "2px 9px",
    borderRadius: 6,
    letterSpacing: "0.06em",
  },
  statusPill: {
    display: "flex",
    alignItems: "center",
    gap: 5,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
  },
  statusLabel: {
    fontFamily: FONT_UI,
    fontSize: "0.7rem",
    fontWeight: 700,
  },
  teamsRow: {
    display: "grid",
    gridTemplateColumns: "1fr auto 1fr",
    alignItems: "center",
    gap: 12,
  },
  teamName: {
    fontFamily: FONT_UI,
    fontSize: "0.9rem",
    fontWeight: 700,
    color: DARK,
    lineHeight: 1.2,
  },
  scoreBlock: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  scoreBox: {
    fontFamily: FONT_DISPLAY,
    fontSize: "1.5rem",
    fontWeight: 900,
    background: DARK,
    color: YELLOW,
    padding: "4px 14px",
    borderRadius: 8,
    minWidth: 44,
    textAlign: "center" as const,
    boxShadow: "2px 2px 0 #1f1f1f",
  },
  scoreSep: {
    fontFamily: FONT_DISPLAY,
    fontSize: "1.125rem",
    color: "#D1D5DB",
    fontWeight: 700,
  },
  metaRow: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
    justifyContent: "center",
  },
  metaItem: {
    fontFamily: FONT_UI,
    fontSize: "0.8125rem",
    color: "#9CA3AF",
  },
  metaDot: {
    color: "#D1D5DB",
    fontSize: "0.75rem",
  },
};

// ─── CommentarySection header ─────────────────────────────────────────────────

function CommentarySectionHeader({ count }: { count: number }) {
  return (
    <div style={cs.header}>
      <div style={cs.titleRow}>
        <div style={cs.accentBar} />
        <span style={cs.title}>Live Commentary</span>
      </div>
      <span style={cs.count}>{count} events</span>
    </div>
  );
}

const cs: Record<string, React.CSSProperties> = {
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 18px 10px",
    borderBottom: "1.5px solid #F3F4F6",
    background: YELLOW,
  },
  titleRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  accentBar: {
    width: 4,
    height: 16,
    borderRadius: 99,
    background: DARK,
    flexShrink: 0,
  },
  title: {
    fontFamily: FONT_DISPLAY,
    fontSize: "0.875rem",
    fontWeight: 800,
    color: DARK,
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
  },
  count: {
    fontFamily: FONT_UI,
    fontSize: "0.6875rem",
    fontWeight: 700,
    color: DARK,
    opacity: 0.5,
  },
};

// ─── EmptyCommentary ──────────────────────────────────────────────────────────

function EmptyCommentary() {
  return (
    <div style={ec.wrap}>
      <span style={{ fontSize: 28 }}>💬</span>
      <p style={ec.text}>No commentary yet</p>
      <p style={ec.sub}>Events will appear here in real time</p>
    </div>
  );
}

const ec: Record<string, React.CSSProperties> = {
  wrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    padding: "40px 20px",

  },
  text: {
    fontFamily: FONT_UI,
    fontSize: "0.9375rem",
    fontWeight: 700,
    color: DARK,
  },
  sub: {
    fontFamily: FONT_UI,
    fontSize: "0.8125rem",
    color: "#9CA3AF",
  },
};

// ─── MatchCommentaryPanel  ────────────────────────────────────────────────────

export default function MatchCommentaryPanel({
  match,
  events = [],
}: MatchCommentaryPanelProps) {
  // Events are shown newest-first (highest sequence first)
  const sorted = [...events].sort((a, b) => b.sequence - a.sequence);

  return (
    <div style={p.shell}>
      {/* ── Match header ──────────────────────── */}
      <MatchHeader match={match} />

      {/* ── Commentary section ────────────────── */}
      <CommentarySectionHeader count={events.length} />

      <div style={p.feed}>
        {sorted.length === 0 ? (
          <EmptyCommentary />
        ) : (
          sorted.map((ev, idx) => (
            <CommentaryEventRow
              key={ev.id}
              event={ev}
              isLatest={idx === 0}
              showDivider={idx < sorted.length - 1}
            />
          ))
        )}
      </div>
    </div>
  );
}

const p: Record<string, React.CSSProperties> = {
  shell: {
    border: `2px solid ${DARK}`,
    borderRadius: 14,
    overflow: "hidden",
    boxShadow: "3px 3px 0 #1f1f1f",
    marginLeft: 20,
    display: "flex",
    // position: "fixed",
    // right: "20",

    flexDirection: "column",
    // height: "100vh"
    // No background — inherits from layout
  },
  feed: {
    overflowY: "auto" as const,
    flex: 1,
  },
};

