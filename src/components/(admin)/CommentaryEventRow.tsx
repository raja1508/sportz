"use client";

import React from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type EventType =
  | "START" | "OVER_END" | "WICKET" | "SIX" | "FOUR"
  | "GOAL"  | "YELLOW_CARD" | "RED_CARD" | "PENALTY"
  | "SUBSTITUTION" | "FOUL" | "CUSTOM" | "HALF_TIME"
  | "FULL_TIME" | string;

export interface CommentaryEventData {
  id:        number;
  minute:    number;
  sequence:  number;
  period:    string;
  eventType: EventType;
  actor?:    string;
  team?:     string;
  message:   string;
  tags?:     string[];
}

// ─── Design tokens ────────────────────────────────────────────────────────────

const DARK        = "#1f1f1f";
const YELLOW      = "#FCDA3D";
const FONT_UI     = "var(--font-ui, 'Barlow', sans-serif)";
const FONT_DISPLAY = "var(--font-display, 'Barlow Condensed', sans-serif)";

// ─── Event type color map ─────────────────────────────────────────────────────

const EVENT_COLORS: Record<string, { bg: string; text: string }> = {
  GOAL:         { bg: "#DCFCE7", text: "#15803D" },
  SIX:          { bg: "#DCFCE7", text: "#15803D" },
  FOUR:         { bg: "#D1FAE5", text: "#065F46" },
  WICKET:       { bg: "#FEE2E2", text: "#DC2626" },
  RED_CARD:     { bg: "#FEE2E2", text: "#DC2626" },
  YELLOW_CARD:  { bg: "#FEF9C3", text: "#854D0E" },
  PENALTY:      { bg: "#FEF9C3", text: "#854D0E" },
  FOUL:         { bg: "#FEF9C3", text: "#854D0E" },
  SUBSTITUTION: { bg: "#DBEAFE", text: "#1D4ED8" },
  OVER_END:     { bg: "#F3F4F6", text: "#6B7280" },
  HALF_TIME:    { bg: "#EDE9FE", text: "#6D28D9" },
  FULL_TIME:    { bg: "#EDE9FE", text: "#6D28D9" },
  START:        { bg: "#DBEAFE", text: "#1D4ED8" },
  CUSTOM:       { bg: "#F3F4F6", text: "#374151" },
};

function getEventColor(type: string) {
  return EVENT_COLORS[type.toUpperCase()] ?? { bg: "#F3F4F6", text: "#374151" };
}

// ─── CommentaryEventBadge (smallest atom) ─────────────────────────────────────

export function CommentaryEventBadge({ type }: { type: string }) {
  const { bg, text } = getEventColor(type);
  return (
    <span style={{ ...b.badge, background: bg, color: text }}>
      {type.toUpperCase()}
    </span>
  );
}

const b: Record<string, React.CSSProperties> = {
  badge: {
    display: "inline-flex",
    alignItems: "center",
    padding: "1px 7px",
    borderRadius: 4,
    fontFamily: FONT_DISPLAY,
    fontSize: "0.6875rem",
    fontWeight: 800,
    letterSpacing: "0.05em",
  },
};

// ─── CommentaryMeta (minute + seq + period + badge row) ───────────────────────

export function CommentaryMeta({ event }: { event: CommentaryEventData }) {
  return (
    <div style={m.row}>
      <span style={m.minute}>{event.minute}'</span>
      <span style={m.seq}>Seq {event.sequence}</span>
      <span style={m.period}>{event.period}</span>
      <CommentaryEventBadge type={event.eventType} />
    </div>
  );
}

const m: Record<string, React.CSSProperties> = {
  row: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap" as const,
    marginBottom: 4,
  },
  minute: {
    fontFamily: FONT_DISPLAY,
    fontSize: "0.875rem",
    fontWeight: 800,
    color: DARK,
    minWidth: 28,
  },
  seq: {
    fontFamily: FONT_UI,
    fontSize: "0.75rem",
    color: "#9CA3AF",
  },
  period: {
    fontFamily: FONT_UI,
    fontSize: "0.75rem",
    color: "#9CA3AF",
  },
};

// ─── CommentaryActorLine ───────────────────────────────────────────────────────

export function CommentaryActorLine({ actor, team }: { actor?: string; team?: string }) {
  if (!actor && !team) return null;
  return (
    <div style={a.row}>
      {actor && <span style={a.actor}>{actor}</span>}
      {actor && team && <span style={a.dot}>·</span>}
      {team && <span style={a.team}>{team}</span>}
    </div>
  );
}

const a: Record<string, React.CSSProperties> = {
  row: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    marginBottom: 4,
  },
  actor: {
    fontFamily: FONT_UI,
    fontSize: "0.8125rem",
    fontWeight: 600,
    color: DARK,
  },
  dot: {
    color: "#D1D5DB",
    fontSize: "0.75rem",
  },
  team: {
    fontFamily: FONT_UI,
    fontSize: "0.8125rem",
    color: "#6B7280",
  },
};

// ─── CommentaryMessage ────────────────────────────────────────────────────────

export function CommentaryMessage({ text }: { text: string }) {
  return <p style={msg.text}>{text}</p>;
}

const msg: Record<string, React.CSSProperties> = {
  text: {
    fontFamily: FONT_UI,
    fontSize: "0.875rem",
    color: "#374151",
    lineHeight: 1.55,
    margin: 0,
  },
};

// ─── CommentaryEventRow  (full assembled row — the main export) ───────────────

interface CommentaryEventRowProps {
  event:    CommentaryEventData;
  isLatest?: boolean;       // highlights the topmost event
  showDivider?: boolean;    // draws a separator line below
}

export function CommentaryEventRow({
  event,
  isLatest  = false,
  showDivider = true,
}: CommentaryEventRowProps) {
  return (
    <div style={{ ...r.wrap, ...(isLatest ? r.wrapLatest : {}) }}>
      {/* Latest pulse indicator */}
      {isLatest && <div style={r.latestBar} />}

      <div style={r.inner}>
        <CommentaryMeta    event={event} />
        <CommentaryActorLine actor={event.actor} team={event.team} />
        <CommentaryMessage text={event.message} />

        {/* Tags (optional) */}
        {event.tags && event.tags.length > 0 && (
          <div style={r.tags}>
            {event.tags.map((tag) => (
              <span key={tag} style={r.tag}>{tag}</span>
            ))}
          </div>
        )}
      </div>

      {showDivider && <div style={r.divider} />}
    </div>
  );
}

const r: Record<string, React.CSSProperties> = {
  wrap: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
  },
  wrapLatest: {
    background: "#FAFAFA",
  },
  latestBar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    background: YELLOW,
    borderRadius: "0 2px 2px 0",
  },
  inner: {
    padding: "14px 18px",
  },
  divider: {
    height: 1,
    background: "#d6d6d6",
    margin: "0 18px",
  },
  tags: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: 5,
    marginTop: 8,
  },
  tag: {
    fontFamily: FONT_UI,
    fontSize: "0.625rem",
    fontWeight: 600,
    color: "#6B7280",
    background: "#F3F4F6",
    padding: "2px 8px",
    borderRadius: 20,
    letterSpacing: "0.03em",
  },
};