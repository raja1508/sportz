"use client";

import { useState, useMemo } from "react";
import { Match } from "@/types";
import { DUMMY_MATCHES } from "@/data/matches";
import { useRouter } from "next/navigation";
import { RouterContext } from "next/dist/shared/lib/router-context.shared-runtime";

// ─── Types ────────────────────────────────────────────────────────────────────

type FilterTab = "all" | "live" | "scheduled" | "finished";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const SPORT_EMOJI: Record<string, string> = {
  football:   "⚽",
  cricket:    "🏏",
  basketball: "🏀",
};

function sportEmoji(sport: string) {
  return SPORT_EMOJI[sport.toLowerCase()] ?? "🏟";
}

function statusLabel(status: string) {
  if (status === "live")      return { label: "Live",      bg: "#FEE2E2", color: "#DC2626", dot: "#EF4444" };
  if (status === "scheduled") return { label: "Scheduled", bg: "#DBEAFE", color: "#1D4ED8", dot: "#3B82F6" };
  return                             { label: "Finished",  bg: "#D1FAE5", color: "#065F46", dot: "#10B981" };
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ num, label, color }: { num: number; label: string; color: string }) {
  return (
    <div style={s.statCard}>
      <div style={{ ...s.statNum, color }}>{num}</div>
      <div style={s.statLabel}>{label}</div>
    </div>
  );
}

// ─── Match Row ────────────────────────────────────────────────────────────────

function MatchRow({
  match,
  selected,
  onSelect,
  onUpdateCommentary,
}: {
  match: Match;
  selected: boolean;
  onSelect: () => void;
  onUpdateCommentary: (match: Match) => void;
}) {
  const st = statusLabel(match.status);

  return (
    <div
      style={{
        ...s.matchRow,
        ...(selected ? s.matchRowSelected : {}),
      }}
      onClick={onSelect}
    >
      {/* Sport + Teams */}
      <div style={s.matchRowLeft}>
        <span style={s.matchEmoji}>{sportEmoji(match.sport)}</span>
        <div>
          <div style={s.matchSport}>{match.sport}</div>
          <div style={s.matchTeams}>
            {match.homeTeam} <span style={s.matchVs}>vs</span> {match.awayTeam}
          </div>
          <div style={s.matchTime}>{formatTime(match.startTime)}</div>
        </div>
      </div>

      {/* Score + Status */}
      <div style={s.matchRowRight}>
        <div style={s.scoreWrap}>
          <span style={s.scoreBox}>{match.homeScore}</span>
          <span style={s.scoreSep}>—</span>
          <span style={s.scoreBox}>{match.awayScore}</span>
        </div>
        <span style={{ ...s.statusBadge, background: st.bg, color: st.color }}>
          {match.status === "live" && (
            <span style={{ ...s.statusDot, background: st.dot }} />
          )}
          {st.label}
        </span>
      </div>

      {/* Actions */}
      <div style={s.matchRowActions} onClick={(e) => e.stopPropagation()}>
        <button
          style={s.btnAction}
          onClick={() => onUpdateCommentary(match)}
          title="Add commentary"
          disabled={match.status !== "live"}
        >
          <i className="ti ti-message-plus" style={{ fontSize: 14 }} />
        </button>
        <button style={s.btnAction} title="Edit match">
          <i className="ti ti-pencil" style={{ fontSize: 14 }} />
        </button>
      </div>
    </div>
  );
}


// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [matches]         = useState<Match[]>(DUMMY_MATCHES);
  const [selected, setSelected] = useState<number | null>(null);
  const [filter, setFilter]     = useState<FilterTab>("all");
  const [search, setSearch]     = useState("");
  const [commentaryMatch, setCommentaryMatch] = useState<Match | null>(null);

  // Stats
  const total     = matches.length;
  const live      = matches.filter((m) => m.status === "live").length;
  const scheduled = matches.filter((m) => m.status === "scheduled").length;
  const finished  = matches.filter((m) => m.status === "finished").length;

  const router = useRouter()

  // Filtered list
  const filtered = useMemo(() => {
    return matches
      .filter((m) => filter === "all" || m.status === filter)
      .filter((m) => {
        const q = search.toLowerCase();
        return (
          !q ||
          m.homeTeam.toLowerCase().includes(q) ||
          m.awayTeam.toLowerCase().includes(q) ||
          m.sport.toLowerCase().includes(q)
        );
      });
  }, [matches, filter, search]);

  // Empty stubs — wire up to real API later
  function handleAddCommentary(matchId: number) {
    // TODO: POST /matches/:id/commentary
    console.log("Add commentary", { matchId});
    router.push("/admin/commentary")
  }

  function handleUpdateMatch(match: Match) {
    // TODO: PATCH /matches/:id
    console.log("Update match", match.id);
  }

  function handleCreateMatch() {
    router.push("/admin/create-matches")

  }



  const TABS: { key: FilterTab; label: string; count: number }[] = [
    { key: "all",       label: "All",       count: total },
    { key: "live",      label: "Live",      count: live },
    { key: "scheduled", label: "Scheduled", count: scheduled },
    { key: "finished",  label: "Finished",  count: finished },
  ];

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/ns/@tabler/icons-webfont@latest/dist/tabler-icons.min.css"
      />

      <div style={s.shell}>

        {/* ── Page header ──────────────────────────── */}
        <div style={s.pageHeader}>
          <div>
            <h1 style={s.pageTitle}>Overview</h1>
            <p style={s.pageSub}>Manage matches and live commentary</p>
          </div>
          <button style={s.btnPrimary} onClick={handleCreateMatch}>
            <i className="ti ti-plus" style={{ fontSize: 14 }} />
            New match
          </button>
        </div>

        {/* ── Stat row ─────────────────────────────── */}
        <div style={s.statsRow}>
          <StatCard num={total}     label="Total matches" color="#111827" />
          <StatCard num={live}      label="Live now"      color="#DC2626" />
          <StatCard num={scheduled} label="Scheduled"     color="#1D4ED8" />
          <StatCard num={finished}  label="Finished"      color="#065F46" />
        </div>

        {/* ── Matches panel ────────────────────────── */}
        <div style={s.panel}>

          {/* Panel header */}
          <div style={s.panelHeader}>
            <div style={s.tabRow}>
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  style={{ ...s.tab, ...(filter === tab.key ? s.tabActive : {}) }}
                  onClick={() => setFilter(tab.key)}
                >
                  {tab.label}
                  <span style={{
                    ...s.tabCount,
                    ...(filter === tab.key ? s.tabCountActive : {}),
                  }}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Search */}
            <div style={s.searchWrap}>
              <i className="ti ti-search" style={s.searchIcon} />
              <input
                style={s.searchInput}
                placeholder="Search teams, sport…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button style={s.searchClear} onClick={() => setSearch("")}>
                  <i className="ti ti-x" style={{ fontSize: 12 }} />
                </button>
              )}
            </div>
          </div>

          {/* Match list */}
          <div style={s.matchList}>
            {filtered.length === 0 ? (
              <div style={s.empty}>
                <span style={{ fontSize: 32 }}>🏟️</span>
                <p style={s.emptyText}>No matches found</p>
                <p style={s.emptySub}>Try a different filter or search term</p>
              </div>
            ) : (
              filtered.map((match) => (
                <MatchRow
                  key={match.id}
                  match={match}
                  selected={selected === match.id}
                  onSelect={() => setSelected(match.id === selected ? null : match.id)}
                  onUpdateCommentary={() => handleAddCommentary(match.id)}
                />
              ))
            )}
          </div>
        </div>
      </div>

    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const YELLOW = "#FCDA3D";
const DARK   = "#1f1f1f";
const FONT_UI      = "var(--font-ui, 'Barlow', sans-serif)";
const FONT_DISPLAY = "var(--font-display, 'Barlow Condensed', sans-serif)";

const s: Record<string, React.CSSProperties> = {
  shell: {
    flex: 1,
    height: "100%",
    overflowY: "auto",
    padding: "28px 32px",
    display: "flex",
    flexDirection: "column",
    gap: 24,
  },

  // Page header
  pageHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  pageTitle: {
    fontFamily: FONT_DISPLAY,
    fontSize: "1.75rem",
    fontWeight: 800,
    color: DARK,
    letterSpacing: "-0.02em",
    lineHeight: 1,
  },
  pageSub: {
    fontFamily: FONT_UI,
    fontSize: "0.8125rem",
    color: "#6B7280",
    marginTop: 4,
  },

  // Stats
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 12,
  },
  statCard: {
    border: `2px solid ${DARK}`,
    borderRadius: 12,
    padding: "16px 18px",
    boxShadow: "3px 3px 0 #1f1f1f",
  },
  statNum: {
    fontFamily: FONT_DISPLAY,
    fontSize: "2rem",
    fontWeight: 900,
    lineHeight: 1,
  },
  statLabel: {
    fontFamily: FONT_UI,
    fontSize: "0.75rem",
    fontWeight: 500,
    color: "#6B7280",
    marginTop: 4,
  },

  // Panel
  panel: {
    border: `2px solid ${DARK}`,
    borderRadius: 14,
    overflow: "hidden",
    boxShadow: "3px 3px 0 #1f1f1f",
    display: "flex",
    flexDirection: "column",
    flex: 1,
    minHeight: 0,
  },
  panelHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 16px",
    borderBottom: `2px solid ${DARK}`,
    background: YELLOW,
    gap: 12,
    flexShrink: 0,
  },

  // Tabs
  tabRow: {
    display: "flex",
    gap: 4,
  },
  tab: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "5px 12px",
    borderRadius: 8,
    border: "2px solid transparent",
    background: "transparent",
    fontFamily: FONT_UI,
    fontSize: "0.8125rem",
    fontWeight: 600,
    color: DARK,
    cursor: "pointer",
    transition: "background 0.12s",
  },
  tabActive: {
    background: DARK,
    color: YELLOW,
    border: `2px solid ${DARK}`,
  },
  tabCount: {
    fontSize: "0.6875rem",
    fontWeight: 700,
    background: "rgba(0,0,0,0.12)",
    color: DARK,
    padding: "1px 6px",
    borderRadius: 20,
  },
  tabCountActive: {
    background: YELLOW,
    color: DARK,
  },

  // Search
  searchWrap: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  searchIcon: {
    position: "absolute",
    left: 10,
    fontSize: 14,
    color: "#6B7280",
    pointerEvents: "none",
  },
  searchInput: {
    fontFamily: FONT_UI,
    fontSize: "0.8125rem",
    border: `2px solid ${DARK}`,
    borderRadius: 8,
    padding: "6px 32px 6px 30px",
    background: "#fff",
    color: DARK,
    outline: "none",
    width: 220,
  },
  searchClear: {
    position: "absolute",
    right: 8,
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#6B7280",
    display: "flex",
    alignItems: "center",
  },

  // Match list
  matchList: {
    overflowY: "auto",
    flex: 1,
  },
  matchRow: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    padding: "14px 18px",
    borderBottom: "1.5px solid #F3F4F6",
    cursor: "pointer",
    transition: "background 0.1s",
  },
  matchRowSelected: {
    background: "#FFFBEB",
    borderLeft: `3px solid ${YELLOW}`,
  },
  matchRowLeft: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    flex: 1,
    minWidth: 0,
  },
  matchEmoji: {
    fontSize: 22,
    flexShrink: 0,
  },
  matchSport: {
    fontFamily: FONT_DISPLAY,
    fontSize: "0.6875rem",
    fontWeight: 700,
    color: "#9CA3AF",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  matchTeams: {
    fontFamily: FONT_UI,
    fontSize: "0.9375rem",
    fontWeight: 700,
    color: DARK,
    marginTop: 1,
  },
  matchVs: {
    fontWeight: 400,
    color: "#9CA3AF",
    margin: "0 4px",
  },
  matchTime: {
    fontFamily: FONT_UI,
    fontSize: "0.75rem",
    color: "#9CA3AF",
    marginTop: 2,
  },
  matchRowRight: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    flexShrink: 0,
  },
  scoreWrap: {
    display: "flex",
    alignItems: "center",
    gap: 4,
  },
  scoreBox: {
    fontFamily: FONT_DISPLAY,
    fontSize: "1.0625rem",
    fontWeight: 800,
    background: DARK,
    color: YELLOW,
    padding: "3px 10px",
    borderRadius: 6,
    minWidth: 32,
    textAlign: "center" as const,
  },
  scoreSep: {
    color: "#D1D5DB",
    fontSize: "0.875rem",
  },
  statusBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    padding: "3px 10px",
    borderRadius: 20,
    fontSize: "0.6875rem",
    fontWeight: 700,
    fontFamily: FONT_UI,
    letterSpacing: "0.03em",
  },
  statusDot: {
    width: 5,
    height: 5,
    borderRadius: "50%",
    flexShrink: 0,
  },
  matchRowActions: {
    display: "flex",
    gap: 6,
    flexShrink: 0,
  },
  btnAction: {
    width: 32,
    height: 32,
    border: `1.5px solid #E5E7EB`,
    borderRadius: 8,
    background: "#fff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#6B7280",
    transition: "border-color 0.1s, color 0.1s",
  },

  // Empty
  empty: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "60px 20px",
  },
  emptyText: {
    fontFamily: FONT_UI,
    fontSize: "0.9375rem",
    fontWeight: 700,
    color: DARK,
  },
  emptySub: {
    fontFamily: FONT_UI,
    fontSize: "0.8125rem",
    color: "#9CA3AF",
  },

  // Buttons
  btnPrimary: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "8px 16px",
    borderRadius: 8,
    background: DARK,
    color: YELLOW,
    fontFamily: FONT_UI,
    fontSize: "0.8125rem",
    fontWeight: 700,
    border: `2px solid ${DARK}`,
    cursor: "pointer",
    boxShadow: "2px 2px 0 #1f1f1f",
  },
  btnSecondary: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "7px 14px",
    borderRadius: 8,
    background: "transparent",
    color: DARK,
    fontFamily: FONT_UI,
    fontSize: "0.8125rem",
    fontWeight: 600,
    border: `2px solid #E5E7EB`,
    cursor: "pointer",
  },

  // Modal
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
  },
  modal: {
    background: "#fff",
    border: `2px solid ${DARK}`,
    borderRadius: 16,
    boxShadow: "6px 6px 0 #1f1f1f",
    width: 460,
    maxWidth: "90vw",
    display: "flex",
    flexDirection: "column",
  },
  modalHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    padding: "18px 20px 14px",
    borderBottom: `2px solid #F3F4F6`,
    background: YELLOW,
    borderRadius: "14px 14px 0 0",
  },
  modalTitle: {
    fontFamily: FONT_DISPLAY,
    fontSize: "1.25rem",
    fontWeight: 800,
    color: DARK,
  },
  modalSub: {
    fontFamily: FONT_UI,
    fontSize: "0.8125rem",
    color: "#374151",
    marginTop: 2,
  },
  modalClose: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: 18,
    color: DARK,
    display: "flex",
    alignItems: "center",
  },
  modalBody: {
    padding: "18px 20px",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  modalFooter: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 8,
    padding: "12px 20px 16px",
    borderTop: "1.5px solid #F3F4F6",
  },
  fieldLabel: {
    fontFamily: FONT_UI,
    fontSize: "0.75rem",
    fontWeight: 700,
    color: "#374151",
    textTransform: "uppercase" as const,
    letterSpacing: "0.06em",
  },
  typeGrid: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: 6,
  },
  typeChip: {
    padding: "4px 10px",
    borderRadius: 6,
    border: "1.5px solid #E5E7EB",
    background: "#F9FAFB",
    fontFamily: FONT_UI,
    fontSize: "0.75rem",
    fontWeight: 600,
    color: "#374151",
    cursor: "pointer",
    textTransform: "capitalize" as const,
  },
  typeChipActive: {
    background: DARK,
    color: YELLOW,
    border: `1.5px solid ${DARK}`,
  },
  textarea: {
    width: "100%",
    border: `2px solid #E5E7EB`,
    borderRadius: 8,
    padding: "10px 12px",
    fontFamily: FONT_UI,
    fontSize: "0.875rem",
    color: DARK,
    resize: "vertical" as const,
    outline: "none",
    lineHeight: 1.5,
  },
};