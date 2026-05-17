"use client";

// src/components/match/MatchGrid.tsx

import { useState } from "react";
import { Match } from "@/types";
import { DUMMY_MATCHES } from "@/data/matches";
import MatchCard from "@/components/match/MatchCard";

interface MatchGridProps{
  matches: Match[],
  selectedId: number | null,
  onSelect: (matchId: number | null) => void 
} 

export default function MatchGrid({matches, selectedId, onSelect}: MatchGridProps) {

  return (
    <>
      <style>{GRID_STYLES}</style>

      <section className="mg-section">
        {/* ── Section header ── */}
        <div className="mg-header">
          <div className="mg-title-row">
            <span className="mg-title-bar" />
            <h2 className="mg-title">Current Matches</h2>
          </div>
          <span className="mg-count">{matches.length} live</span>
        </div>

        {/* ── Grid ── */}
        {matches.length === 0 ? (
          <div className="mg-empty">
            <span className="mg-empty-icon">🏟️</span>
            <p className="mg-empty-text">No matches right now</p>
            <p className="mg-empty-sub">Check back soon for live updates</p>
          </div>
        ) : (
          <div className="mg-grid">
            {matches.map((match, index) => (
              <div
                key={match.id}
                className="mg-card-wrap"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <MatchCard
                  match={match}
                  isSelected={selectedId === match.id}
                  onSelect={onSelect}
                />
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

// ─────────────────────────────────────────────────
// Styles — co-located, scoped by .mg- prefix
// ─────────────────────────────────────────────────
const GRID_STYLES = `
  /* ── Section wrapper ─────────────────────────── */
  .mg-section {
    marginLeft: 128px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    width: 100%;
    height: 100%;

  }

  /* ── Header row ──────────────────────────────── */
  .mg-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .mg-title-row {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  /* Yellow left accent bar — like in your screenshot */
  .mg-title-bar {
    display: inline-block;
    width: 4px;
    height: 20px;
    border-radius: 99px;
    background: #F5C800;
    flex-shrink: 0;
  }

  .mg-title {
    font-family: var(--font-ui);
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--color-text);
    letter-spacing: -0.01em;
  }

  /* Live count badge */
  .mg-count {
    font-family: var(--font-display);
    font-size: 0.6875rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: #EF4444;
    background: #FEE2E2;
    border: 1.5px solid #FECACA;
    border-radius: 999px;
    padding: 2px 10px;
  }

  /* ── 2-column responsive grid ────────────────── */
  .mg-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
    max-height: 100vh - 80px
  }

  /* Single column on small screens */
  @media (max-width: 540px) {
    .mg-grid {
      grid-template-columns: 1fr;
    }
  }

  /* ── Card entrance animation ─────────────────── */
  .mg-card-wrap {
    opacity: 0;
    animation: mgCardIn 300ms ease forwards;
  }

  @keyframes mgCardIn {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Empty state ─────────────────────────────── */
  .mg-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 3rem 1rem;
    border: 1.5px dashed #D1D5DB;
    border-radius: 20px;
    background: #ffffff;
  }

  .mg-empty-icon {
    font-size: 2rem;
    line-height: 1;
  }

  .mg-empty-text {
    font-family: var(--font-ui);
    font-size: 0.9375rem;
    font-weight: 700;
    color: var(--color-text);
  }

  .mg-empty-sub {
    font-family: var(--font-ui);
    font-size: 0.8125rem;
    color: var(--color-text-muted);
  }
`;