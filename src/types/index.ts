// ─────────────────────────────────────────────────
// src/types/index.ts
// Derived from actual API response shape
// ─────────────────────────────────────────────────

// ── Enums ─────────────────────────────────────────

export type Sport = "football" | "Cricket" | "basketball" | "tennis";

export type MatchStatus = "scheduled" | "live" | "finished" | "postponed" | "cancelled";

// From commentary body: eventType field
export type EventType =
  | "goal"
  | "shot"
  | "wicket"
  | "run"
  | "over_end"
  | "start"
  | "foul"
  | "card"
  | "substitution"
  | "penalty"
  | string; // keep open — API may add new types

// From commentary body: tags array
export type EventTag = "goal" | "shot" | "wicket" | "run" | "over" | string;

// ── Match ─────────────────────────────────────────

// GET /matches → data: Match[]
export interface Match {
  id: number;
  sport: Sport;
  homeTeam: string;
  awayTeam: string;
  status: MatchStatus;
  startTime: string;   // ISO 8601 — "2026-02-01T12:00:00.000Z"
  endTime: string;     // ISO 8601 — "2026-02-01T13:45:00.000Z"
  homeScore: number;
  awayScore: number;
  createdAt: string;   // ISO 8601
}

// API envelope for GET /matches
export interface MatchesResponse {
  data: Match[];
}

// API envelope for GET /matches/:id
export interface MatchResponse {
  data: Match;
}

// ── Commentary ────────────────────────────────────

// Flexible metadata — varies by sport/event
// e.g. football goal: { assist: "Sam Kerr" }
// e.g. cricket wicket: { bowler: "...", fielder: "..." }
export interface CommentaryMetadata {
  assist?: string;
  bowler?: string;
  fielder?: string;
  distance?: number;
  [key: string]: unknown; // allow any extra fields
}

// POST /matches/:id/commentary  (request body)
export interface CreateCommentaryBody {
  minute: number;       // match minute — e.g. 42
  sequence: number;     // event sequence number — e.g. 120
  period: string;       // "1st half" | "2nd half" | "1st innings" etc.
  eventType: EventType; // "goal" | "wicket" | "run" etc.
  actor: string;        // player name — "Alex Morgan"
  team: string;         // team name — "FC Neon"
  message: string;      // human-readable description
  metadata?: CommentaryMetadata;
  tags?: EventTag[];    // ["goal", "shot"]
}

// Commentary event as returned from GET /matches/:id/commentary
export interface CommentaryEvent extends CreateCommentaryBody {
  id: number;
  matchId: number;
  createdAt: string; // ISO 8601
}

// API envelope for GET /matches/:id/commentary
export interface CommentaryResponse {
  data: CommentaryEvent[];
}

// ── WebSocket messages ────────────────────────────
// For when you wire up the backend later

export type WsClientMessage =
  | { type: "SUBSCRIBE_MATCH"; matchId: number }
  | { type: "UNSUBSCRIBE_MATCH"; matchId: number };

export type WsServerMessage =
  | { type: "SUBSCRIBED"; matchId: number }
  | { type: "COMMENTARY_EVENT"; event: CommentaryEvent }
  | { type: "SCORE_UPDATE"; matchId: number; homeScore: number; awayScore: number }
  | { type: "MATCH_STATUS_CHANGE"; matchId: number; status: MatchStatus };