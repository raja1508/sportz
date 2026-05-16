"use client";

// src/components/match/MatchCard.tsx
// All styles are co-located at the bottom of this file
// and injected via a <style> tag on first render.

import { Match } from "@/types";
import Badge from "@/components/ui/Badge";
import LiveDot from "@/components/ui/LiveDot";
import Button from "@/components/ui/Button";

// ─────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────
interface MatchCardProps {
  match: Match;
  isSelected?: boolean;
  onSelect: (matchId: number | null) => void;
}

// ─────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────
function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────
export default function MatchCard({
  match,
  isSelected = true,
  onSelect,
}: MatchCardProps) {
  const isLive = match.status === "live";

  function handleCardClick() {
    if (!isSelected) onSelect(match.id);
  }

  function handleWatchLive(e: React.MouseEvent) {
    e.stopPropagation();
    onSelect(match.id);
  }

  function handleClose(e: React.MouseEvent) {
    e.stopPropagation();
    onSelect(null);
  }

  return (
    <>
      {/* ── Scoped styles ── */}
      <style>{CARD_STYLES}</style>

      {/* ── Card root ── */}
      <div
        className={`mc-card ${isSelected ? "mc-card--selected" : ""}`}
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        aria-pressed={isSelected}
        onKeyDown={(e) => e.key === "Enter" && handleCardClick()}
      >
        {/* Top row: badge + live status */}
        <div className="mc-top">
          <Badge sport={match.sport} />

          {isLive ? (
            <LiveDot showLabel size="md" />
          ) : (
            <span className="mc-status">{match.status}</span>
          )}
        </div>

        {/* Teams + scores */}
        <div className="mc-teams">
          {/* Home */}
          <div className="mc-team-row">
            <span className="mc-team-name">{match.homeTeam}</span>
            <span className={`mc-score ${isSelected ? "mc-score--lit" : ""}`}>
              {match.homeScore}
            </span>
          </div>

          {/* Away */}
          <div className="mc-team-row">
            <span className="mc-team-name">{match.awayTeam}</span>
            <span className="mc-score">{match.awayScore}</span>
          </div>
        </div>

        {/* Footer: time + action buttons */}
        <div className="mc-footer">
          <span className="mc-time">{formatTime(match.startTime)}</span>

          {isSelected ? (
            <div className="mc-btn-group">
              <Button variant="watching">Watching Live</Button>
              <Button variant="secondary" onClick={() => handleClose}>Close</Button>
            </div>
          ) : (
            <Button variant="primary" onClick={() => handleWatchLive}>
              Watch Live
            </Button>
          )}
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────
// Styles — co-located, scoped by .mc- prefix
// box-shadow:
//   1px 1px 0 #D1D5DB,
//   2px 2px 0 #D1D5DB,
//   3px 3px 0 #D1D5DB,
//   4px 4px 0 #D1D5DB;
// ─────────────────────────────────────────────────
const CARD_STYLES = `
/* ── Card shell ───────────────────────────────── */
.mc-card {
    background: #FEFEFE;
    border: 2px solid #1F1F1F;
    border-radius: 20px;
    padding: 1.1rem 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 14px;
    cursor: pointer;
    position: relative;

    /* 3D stacked shadow — right + bottom */

    transition:
      box-shadow  150ms ease,
      transform   150ms ease,
      border-color 150ms ease;
  }

  /* Hover — lifts card, deeper shadow */
    .mc-card:not(.mc-card--selected):hover {
    transform: translate(-1px, -1px);
    box-shadow:
        1px 1px 0 #1F1F1F,
        2px 2px 0 #1F1F1F,
        3px 3px 0 #1F1F1F,
        4px 4px 0 #1F1F1F,
        3px 3px 0 #1F1F1F,
        4px 4px 0 #1F1F1F;
    }

  /* Selected — yellow border + yellow shadow depth */
  .mc-card--selected {
    border-color: #F5C800;
    transform: translate(-1px, -1px);
    box-shadow:
      1px 1px 0 #D4A900,
      2px 2px 0 #D4A900,
      3px 3px 0 #D4A900,
      4px 4px 0 #D4A900,
      5px 5px 0 #D4A900;
  }

  /* ── Top row ──────────────────────────────────── */
  .mc-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  /* Non-live status pill text */
  .mc-status {
    font-family: var(--font-display);
    font-size: 0.6875rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--color-text-muted);
  }

  /* ── Teams ────────────────────────────────────── */
  .mc-teams {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .mc-team-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .mc-team-name {
    font-family: var(--font-ui);
    font-size: 0.9375rem;
    font-weight: 700;
    color: var(--color-text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-right: 10px;
  }

  /* ── Score box ────────────────────────────────── */
  .mc-score {
    width: 38px;
    height: 38px;
    flex-shrink: 0;
    border: 1.5px solid #D1D5DB;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-display);
    font-size: 1.125rem;
    font-weight: 800;
    color: var(--color-text);
    background: #F9FAFB;
    transition:
      background-color 300ms ease,
      border-color     300ms ease;
  }

  /* Yellow highlight on home score when selected */
  .mc-score--lit {
    background: #F5C800;
    border-color: #D4A900;
  }

  /* ── Footer ───────────────────────────────────── */
  .mc-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .mc-time {
    font-family: var(--font-ui);
    font-size: 0.6875rem;
    color: var(--color-text-muted);
  }

  .mc-btn-group {
    display: flex;
    align-items: center;
    gap: 6px;
  }
`;