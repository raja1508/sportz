import React from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type EventType =
  | "goal"
  | "wicket"
  | "run"
  | "over_end"
  | "card"
  | "substitution"
  | "penalty"
  | "foul"
  | "corner"
  | "offside"
  | string;

export type EventTag = string;

export interface CommentaryMetadata {
  assist?: string;
  [key: string]: unknown;
}

export interface CreateCommentaryBody {
  minute: number;
  sequence: number;
  period: string;
  eventType: EventType;
  actor: string;
  team: string;
  message: string;
  metadata?: CommentaryMetadata;
  tags?: EventTag[];
}

export interface CommentaryEvent extends CreateCommentaryBody {
  id: number;
  matchId: number;
  createdAt: string; // ISO 8601
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const EVENT_CONFIG: Record<
  string,
  { emoji: string; accent: string; label: string }
> = {
  goal: { emoji: "⚽", accent: "#f59e0b", label: "GOAL" },
  penalty: { emoji: "🎯", accent: "#f59e0b", label: "PENALTY" },
  wicket: { emoji: "🏏", accent: "#ef4444", label: "WICKET" },
  run: { emoji: "🏃", accent: "#3b82f6", label: "RUN" },
  over_end: { emoji: "🔔", accent: "#8b5cf6", label: "OVER END" },
  card: { emoji: "🟨", accent: "#eab308", label: "CARD" },
  substitution: { emoji: "🔄", accent: "#6366f1", label: "SUB" },
  foul: { emoji: "⚠️", accent: "#f97316", label: "FOUL" },
  corner: { emoji: "🚩", accent: "#06b6d4", label: "CORNER" },
  offside: { emoji: "🚫", accent: "#94a3b8", label: "OFFSIDE" },
  default: { emoji: "📋", accent: "#64748b", label: "EVENT" },
};

function getEventConfig(eventType: EventType) {
  return EVENT_CONFIG[eventType.toLowerCase()] ?? EVENT_CONFIG.default;
}

function formatTime(createdAt: string): string {
  const date = new Date(createdAt);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;600&display=swap');

  .cc-root {
    font-family: 'DM Sans', sans-serif;
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 4px 0px;
    background: #fefefe;
    border: 1px #6c6c6c
    border-radius: 12px;
    max-width: 100%;
    position: relative;
    transition: box-shadow 0.2s ease;
  }


  /* Dot indicator on the left */
  .cc-dot-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    padding-top: 3px;
    flex-shrink: 0;
  }

  .cc-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border: 2px solid currentColor;
    flex-shrink: 0;
  }

  .cc-dot--active {
    background: currentColor;
    animation: cc-pulse 2s ease-in-out infinite;
  }

  @keyframes cc-pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.6; transform: scale(0.85); }
  }

  /* Main content */
  .cc-content {
    flex: 1;
    min-width: 0;
  }

  /* Meta row: time · minute · seq · period · badge */
  .cc-meta {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 6px;
  }

  .cc-time {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    font-weight: 500;
    color: #64748b;
    letter-spacing: 0.02em;
  }

  .cc-chip {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    font-weight: 500;
    color: #475569;
    background: #f1f5f9;
    border: 1px solid #e2e8f0;
    border-radius: 99px;
    padding: 1px 7px;
    white-space: nowrap;
  }

  .cc-badge {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.06em;
    padding: 2px 9px;
    border-radius: 99px;
    border: 1.5px solid #040404;
    white-space: nowrap;
    text-transform: uppercase;
  }

  /* Actor row */
  .cc-actor {
    font-size: 12px;
    font-weight: 600;
    color: #0f172a;
    margin-bottom: 8px;
    letter-spacing: 0.01em;
  }

  .cc-actor-sep {
    color: #94a3b8;
    font-weight: 400;
    margin: 0 2px;
  }

  .cc-team {
    color: #475569;
    font-weight: 500;
  }

  /* Message bubble */
  .cc-bubble {
    background: #f6f8fa;
    border: 2px solid #DEDEDE;
    border-radius: 0px 8px 8px 8px;
    padding: 12px 8px;
    font-size: 14px;
    color: #040404;
    line-height: 1.5;
    margin-bottom: 10px;
    font-weight: 800;
  }

  /* Tags row */
  .cc-tags {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 5px;
  }

  .cc-tag {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    font-weight: 500;
    color: #64748b;
    background: #f1f5f9;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    padding: 1px 7px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  /* Metadata row */
  .cc-metadata {
    margin-top: 6px;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .cc-meta-item {
    font-size: 11px;
    color: #64748b;
  }

  .cc-meta-key {
    font-weight: 600;
    text-transform: capitalize;
  }
`;

// ─── Component ────────────────────────────────────────────────────────────────

export interface CommentaryCardProps {
  event: CommentaryEvent;
  /** Show the dot as "live" / pulsing */
  live?: boolean;
  className?: string;
}

export const CommentaryCard: React.FC<CommentaryCardProps> = ({
  event,
  live = false,
  className = "",
}) => {
  const cfg = getEventConfig(event.eventType);
  const isHighlight = ["goal", "wicket", "penalty"].includes(
    event.eventType.toLowerCase()
  );

  return (
    <>
      <style>{styles}</style>
      <div className={`cc-root ${className}`}>
        {/* Left dot indicator */}
        <div className="cc-dot-col">
          <span
            className={`cc-dot${live ? " cc-dot--active" : ""}`}
            style={{ color: cfg.accent }}
          />
        </div>

        {/* Content */}
        <div className="cc-content">
          {/* Meta row */}
          <div className="cc-meta">
            <span className="cc-time">{formatTime(event.createdAt)}</span>
            <span className="cc-chip">{event.minute}&prime;</span>
            <span className="cc-chip">Seq {event.sequence}</span>
            <span className="cc-chip">{event.period}</span>
            <span
              className="cc-badge"
            >
              {cfg.label}
            </span>
          </div>

          {/* Actor */}
          {event.actor &&  (
            <div className="cc-actor">
            {event.actor}
            <span> · </span>
            <span>{event.team}</span>
          </div>
          )}

          {/* Message bubble */}
          <div
            className={`cc-bubble`}
          >
            {event.message}
          </div>

          {/* Metadata */}
          {event.metadata && Object.keys(event.metadata).length > 0 && (
            <div className="cc-metadata">
              {Object.entries(event.metadata).map(([key, val]) => (
                <span className="cc-meta-item" key={key}>
                  <span className="cc-meta-key">{key}: </span>
                  {String(val)}
                </span>
              ))}
            </div>
          )}

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="cc-tags" style={{ marginTop: event.metadata ? 8 : 0 }}>
              {event.tags.map((tag) => (
                <span className="cc-tag" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CommentaryCard;

// ─── Demo / usage ─────────────────────────────────────────────────────────────

const demoEvent: CommentaryEvent = {
  id: 9,
  matchId: 1,
  minute: 78,
  sequence: 9,
  period: "2nd half",
  eventType: "goal",
  actor: "Carlos Mendes",
  team: "Kingsport FC",
  message: "GOAL! Clinical finish from the penalty spot. (Kingsport FC)",
  metadata: { assist: "Jamie Trent" },
  tags: ["goal", "penalty"],
  createdAt: "2026-05-14T14:48:00.000Z",
};

export const CommentaryCardDemo: React.FC = () => (
  <div style={{minHeight: "100vh" }}>
    <CommentaryCard event={demoEvent} live />
  </div>
);