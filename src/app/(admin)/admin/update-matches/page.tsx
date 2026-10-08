"use client";

import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface TeamScore {
  name: string;
  score: number;
  wickets?: number;   // cricket
  overs?: string;     // cricket
  fouls?: number;     // football/basketball
}

interface MatchPayload {
  matchId:    number;
  homeTeam:   TeamScore;
  awayTeam:   TeamScore;
  status:     string;
  period:     string;
  minute:     number;
  sport:      string;
  venue:      string;
  referee:    string;
  notes:      string;
}

// ─── Design tokens ────────────────────────────────────────────────────────────

const DARK         = "#1f1f1f";
const YELLOW       = "#FCDA3D";
const FONT_UI      = "var(--font-ui, 'Barlow', sans-serif)";
const FONT_DISPLAY = "var(--font-display, 'Barlow Condensed', sans-serif)";

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_OPTIONS = ["live", "scheduled", "half_time", "full_time", "postponed", "cancelled"];
const PERIOD_MAP: Record<string, string[]> = {
  Football:   ["1st half", "2nd half", "Extra time", "Penalties"],
  Cricket:    ["1st innings", "2nd innings", "3rd innings", "4th innings"],
  Basketball: ["1st quarter", "2nd quarter", "3rd quarter", "4th quarter", "Overtime"],
};
const SPORT_OPTIONS = ["Football", "Cricket", "Basketball"];

const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  live:       { bg: "#DCFCE7", text: "#15803D", dot: "#22C55E" },
  scheduled:  { bg: "#DBEAFE", text: "#1D4ED8", dot: "#3B82F6" },
  half_time:  { bg: "#FEF9C3", text: "#854D0E", dot: "#EAB308" },
  full_time:  { bg: "#F3F4F6", text: "#374151", dot: "#9CA3AF" },
  postponed:  { bg: "#FEE2E2", text: "#DC2626", dot: "#EF4444" },
  cancelled:  { bg: "#FEE2E2", text: "#DC2626", dot: "#EF4444" },
};

// ─── Reusable components ──────────────────────────────────────────────────────

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label style={s.fieldLabel}>{children}</label>;
}

function InputBox({
  value, onChange, type = "text", placeholder, style: extraStyle
}: {
  value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string; placeholder?: string; style?: React.CSSProperties;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{ ...s.input, ...extraStyle }}
    />
  );
}

function Card({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div style={s.card}>
      <div style={s.cardHeader}>
        <i className={icon} style={s.cardIcon} />
        <span style={s.cardTitle}>{title}</span>
      </div>
      <div style={s.cardBody}>{children}</div>
    </div>
  );
}

// ─── Match Preview Panel (left side) ─────────────────────────────────────────

function MatchPreview({ form }: { form: MatchPayload }) {
  const statusStyle = STATUS_COLORS[form.status] ?? STATUS_COLORS.scheduled;
  const isLive = form.status === "live";
  const isCricket = form.sport === "Cricket";

  return (
    <div style={mp.panel}>
      <div style={mp.header}>
        <span style={mp.headerLabel}>Live preview</span>
        <span style={{ ...mp.statusChip, background: statusStyle.bg, color: statusStyle.text }}>
          <span style={{ ...mp.dot, background: statusStyle.dot }} />
          {form.status.replace("_", " ").toUpperCase()}
        </span>
      </div>

      {/* Match card */}
      <div style={mp.matchCard}>
        {/* Sport badge */}
        <div style={mp.sportRow}>
          <span style={mp.sportBadge}>{form.sport}</span>
          {isLive && (
            <span style={mp.livePulse}>
              <span style={mp.liveDot} />
              LIVE · {form.minute}'
            </span>
          )}
        </div>

        {/* Teams + Score */}
        <div style={mp.teamsBlock}>
          {/* Home */}
          <div style={mp.teamRow}>
            <div style={mp.teamAvatar}>{form.homeTeam.name.slice(0, 2).toUpperCase()}</div>
            <div style={mp.teamInfo}>
              <span style={mp.teamName}>{form.homeTeam.name || "Home Team"}</span>
              {isCricket && form.homeTeam.overs && (
                <span style={mp.teamMeta}>{form.homeTeam.overs} ov</span>
              )}
            </div>
            <div style={mp.scoreBlock}>
              <span style={mp.scoreNum}>{form.homeTeam.score}</span>
              {isCricket && form.homeTeam.wickets !== undefined && (
                <span style={mp.wickets}>/{form.homeTeam.wickets}w</span>
              )}
            </div>
          </div>

          <div style={mp.vsDivider}>
            <div style={mp.vsLine} />
            <span style={mp.vsText}>VS</span>
            <div style={mp.vsLine} />
          </div>

          {/* Away */}
          <div style={mp.teamRow}>
            <div style={{ ...mp.teamAvatar, background: "#1f1f1f", color: YELLOW }}>
              {form.awayTeam.name.slice(0, 2).toUpperCase()}
            </div>
            <div style={mp.teamInfo}>
              <span style={mp.teamName}>{form.awayTeam.name || "Away Team"}</span>
              {isCricket && form.awayTeam.overs && (
                <span style={mp.teamMeta}>{form.awayTeam.overs} ov</span>
              )}
            </div>
            <div style={mp.scoreBlock}>
              <span style={mp.scoreNum}>{form.awayTeam.score}</span>
              {isCricket && form.awayTeam.wickets !== undefined && (
                <span style={mp.wickets}>/{form.awayTeam.wickets}w</span>
              )}
            </div>
          </div>
        </div>

        {/* Meta strip */}
        <div style={mp.metaStrip}>
          <div style={mp.metaItem}>
            <i className="ti ti-clock" style={mp.metaIcon} />
            <span>{form.period}</span>
          </div>
          {form.venue && (
            <div style={mp.metaItem}>
              <i className="ti ti-map-pin" style={mp.metaIcon} />
              <span>{form.venue}</span>
            </div>
          )}
          {form.referee && (
            <div style={mp.metaItem}>
              <i className="ti ti-user-check" style={mp.metaIcon} />
              <span>{form.referee}</span>
            </div>
          )}
        </div>
      </div>

      {/* Stats comparison */}
      <div style={mp.statsCard}>
        <div style={mp.statsTitle}>Score comparison</div>
        {(() => {
          const total = form.homeTeam.score + form.awayTeam.score || 1;
          const homePct = Math.round((form.homeTeam.score / total) * 100);
          const awayPct = 100 - homePct;
          return (
            <>
              <div style={mp.barRow}>
                <span style={mp.barLabel}>{form.homeTeam.name.split(" ")[0] || "Home"}</span>
                <div style={mp.barTrack}>
                  <div style={{ ...mp.barFill, width: `${homePct}%`, background: YELLOW }} />
                </div>
                <span style={mp.barVal}>{form.homeTeam.score}</span>
              </div>
              <div style={mp.barRow}>
                <span style={mp.barLabel}>{form.awayTeam.name.split(" ")[0] || "Away"}</span>
                <div style={mp.barTrack}>
                  <div style={{ ...mp.barFill, width: `${awayPct}%`, background: DARK }} />
                </div>
                <span style={mp.barVal}>{form.awayTeam.score}</span>
              </div>
            </>
          );
        })()}
      </div>

      {/* Notes */}
      {form.notes && (
        <div style={mp.notesCard}>
          <div style={mp.notesLabel}>
            <i className="ti ti-notes" style={{ fontSize: 11 }} /> Notes
          </div>
          <p style={mp.notesText}>{form.notes}</p>
        </div>
      )}
    </div>
  );
}

const mp: Record<string, React.CSSProperties> = {
  panel: {
    background: "#fff",
    border: `2px solid ${DARK}`,
    borderRadius: 14,
    overflow: "hidden",
    boxShadow: "4px 4px 0 #1f1f1f",
    position: "sticky" as const,
    top: 20,
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 16px",
    background: DARK,
  },
  headerLabel: {
    fontFamily: FONT_UI,
    fontSize: "0.6875rem",
    fontWeight: 700,
    color: "#9CA3AF",
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
  },
  statusChip: {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    padding: "3px 9px",
    borderRadius: 20,
    fontFamily: FONT_UI,
    fontSize: "0.625rem",
    fontWeight: 800,
    letterSpacing: "0.05em",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    flexShrink: 0,
  },
  matchCard: {
    padding: "16px",
    borderBottom: `2px solid #F3F4F6`,
  },
  sportRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  sportBadge: {
    fontFamily: FONT_UI,
    fontSize: "0.625rem",
    fontWeight: 700,
    color: "#6B7280",
    background: "#F3F4F6",
    padding: "3px 8px",
    borderRadius: 4,
    letterSpacing: "0.06em",
    textTransform: "uppercase" as const,
  },
  livePulse: {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    fontFamily: FONT_UI,
    fontSize: "0.625rem",
    fontWeight: 800,
    color: "#15803D",
    background: "#DCFCE7",
    padding: "3px 9px",
    borderRadius: 20,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "#22C55E",
  },
  teamsBlock: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 0,
  },
  teamRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "8px 0",
  },
  teamAvatar: {
    width: 34,
    height: 34,
    borderRadius: 8,
    background: YELLOW,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 11,
    fontWeight: 800,
    color: DARK,
    flexShrink: 0,
    border: `2px solid ${DARK}`,
    fontFamily: FONT_DISPLAY,
  },
  teamInfo: {
    flex: 1,
    display: "flex",
    flexDirection: "column" as const,
    gap: 1,
  },
  teamName: {
    fontFamily: FONT_UI,
    fontSize: "0.875rem",
    fontWeight: 700,
    color: DARK,
  },
  teamMeta: {
    fontFamily: FONT_UI,
    fontSize: "0.6875rem",
    color: "#9CA3AF",
  },
  scoreBlock: {
    display: "flex",
    alignItems: "baseline",
    gap: 2,
  },
  scoreNum: {
    fontFamily: FONT_DISPLAY,
    fontSize: "1.75rem",
    fontWeight: 900,
    color: DARK,
    lineHeight: 1,
  },
  wickets: {
    fontFamily: FONT_UI,
    fontSize: "0.75rem",
    color: "#9CA3AF",
    fontWeight: 600,
  },
  vsDivider: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "2px 0",
  },
  vsLine: {
    flex: 1,
    height: 1,
    background: "#F3F4F6",
  },
  vsText: {
    fontFamily: FONT_DISPLAY,
    fontSize: "0.625rem",
    fontWeight: 900,
    color: "#D1D5DB",
    letterSpacing: "0.1em",
  },
  metaStrip: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: 10,
    marginTop: 12,
    paddingTop: 12,
    borderTop: "1.5px solid #F3F4F6",
  },
  metaItem: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    fontFamily: FONT_UI,
    fontSize: "0.6875rem",
    color: "#6B7280",
  },
  metaIcon: { fontSize: 12 },
  statsCard: {
    padding: "14px 16px",
    borderBottom: "2px solid #F3F4F6",
  },
  statsTitle: {
    fontFamily: FONT_UI,
    fontSize: "0.6875rem",
    fontWeight: 700,
    color: "#9CA3AF",
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
    marginBottom: 10,
  },
  barRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 7,
  },
  barLabel: {
    fontFamily: FONT_UI,
    fontSize: "0.6875rem",
    color: "#6B7280",
    width: 52,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap" as const,
  },
  barTrack: {
    flex: 1,
    height: 7,
    background: "#F3F4F6",
    borderRadius: 4,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    borderRadius: 4,
    transition: "width 0.3s ease",
  },
  barVal: {
    fontFamily: FONT_DISPLAY,
    fontSize: "0.875rem",
    fontWeight: 800,
    color: DARK,
    width: 24,
    textAlign: "right" as const,
  },
  notesCard: {
    padding: "12px 16px",
  },
  notesLabel: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    fontFamily: FONT_UI,
    fontSize: "0.6875rem",
    fontWeight: 700,
    color: "#9CA3AF",
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
    marginBottom: 6,
  },
  notesText: {
    fontFamily: FONT_UI,
    fontSize: "0.8125rem",
    color: "#6B7280",
    lineHeight: 1.5,
    margin: 0,
  },
};

// ─── NumberStepper ────────────────────────────────────────────────────────────

function NumberStepper({
  value, onChange, min = 0, max = 999, label
}: { value: number; onChange: (n: number) => void; min?: number; max?: number; label?: string }) {
  return (
    <div style={ns.wrap}>
      {label && <FieldLabel>{label}</FieldLabel>}
      <div style={ns.row}>
        <button
          type="button"
          style={ns.btn}
          onClick={() => onChange(Math.max(min, value - 1))}
        >−</button>
        <span style={ns.val}>{value}</span>
        <button
          type="button"
          style={{ ...ns.btn, background: YELLOW, color: DARK }}
          onClick={() => onChange(Math.min(max, value + 1))}
        >+</button>
      </div>
    </div>
  );
}

const ns: Record<string, React.CSSProperties> = {
  wrap: { display: "flex", flexDirection: "column" as const, gap: 4 },
  row: { display: "flex", alignItems: "center", gap: 0, border: `2px solid ${DARK}`, borderRadius: 8, overflow: "hidden" },
  btn: {
    width: 34, height: 38, border: "none", background: "#F3F4F6",
    fontFamily: FONT_DISPLAY, fontSize: "1.25rem", fontWeight: 700,
    color: DARK, cursor: "pointer", flexShrink: 0,
  },
  val: {
    flex: 1, textAlign: "center" as const, fontFamily: FONT_DISPLAY,
    fontSize: "1.125rem", fontWeight: 900, color: DARK,
  },
};

// ─── UpdateMatch (main) ───────────────────────────────────────────────────────

const INITIAL: MatchPayload = {
  matchId:  1,
  homeTeam: { name: "Forest Rangers",  score: 156, wickets: 3, overs: "18.2" },
  awayTeam: { name: "Sunset Blazers",  score: 98,  wickets: 6, overs: "20.0" },
  status:   "live",
  period:   "1st innings",
  minute:   13,
  sport:    "Cricket",
  venue:    "Eden Gardens",
  referee:  "Aleem Dar",
  notes:    "",
};

export default function UpdateMatch() {
  const [form, setForm] = useState<MatchPayload>(INITIAL);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  function setField<K extends keyof MatchPayload>(key: K, value: MatchPayload[K]) {
    setForm(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  function setHome<K extends keyof TeamScore>(key: K, value: TeamScore[K]) {
    setForm(prev => ({ ...prev, homeTeam: { ...prev.homeTeam, [key]: value } }));
    setSaved(false);
  }

  function setAway<K extends keyof TeamScore>(key: K, value: TeamScore[K]) {
    setForm(prev => ({ ...prev, awayTeam: { ...prev.awayTeam, [key]: value } }));
    setSaved(false);
  }

  async function handleSave() {
    setLoading(true);
    console.log("Update match payload:", form);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    setSaved(true);
  }

  const isCricket = form.sport === "Cricket";
  const periods = PERIOD_MAP[form.sport] ?? PERIOD_MAP.Football;

  return (
    <>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css" />

      <div style={s.shell}>

        {/* ── Page header ─────────────────── */}
        <div style={s.pageHeader}>
          <div>
            <h1 style={s.pageTitle}>Update match</h1>
            <p style={s.pageSub}>Edit live match details, scores, and status</p>
          </div>
          <button
            type="button"
            style={{ ...s.saveBtn, ...(saved ? s.saveBtnSaved : {}) }}
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? (
              <><i className="ti ti-loader-2" style={{ fontSize: 15 }} /> Saving…</>
            ) : saved ? (
              <><i className="ti ti-check" style={{ fontSize: 15 }} /> Saved</>
            ) : (
              <><i className="ti ti-device-floppy" style={{ fontSize: 15 }} /> Save changes</>
            )}
          </button>
        </div>

        {/* ── Two-column layout ──────────── */}
        <div style={s.twoCol}>

          {/* LEFT — preview */}
          <MatchPreview form={form} />

          {/* RIGHT — form */}
          <div style={s.formCol}>

            {/* Match info */}
            <Card title="Match info" icon="ti ti-info-circle">
              <div style={s.fieldGroup}>
                <FieldLabel>Sport</FieldLabel>
                <div style={s.chipRow}>
                  {SPORT_OPTIONS.map(sp => (
                    <button
                      key={sp}
                      type="button"
                      style={{ ...s.chip, ...(form.sport === sp ? s.chipActive : {}) }}
                      onClick={() => { setField("sport", sp); setField("period", PERIOD_MAP[sp][0]); }}
                    >{sp}</button>
                  ))}
                </div>
              </div>
              <div style={s.twoField}>
                <div style={s.fieldGroup}>
                  <FieldLabel>Venue</FieldLabel>
                  <InputBox value={form.venue} onChange={e => setField("venue", e.target.value)} placeholder="e.g. Eden Gardens" />
                </div>
                <div style={s.fieldGroup}>
                  <FieldLabel>Referee / Umpire</FieldLabel>
                  <InputBox value={form.referee} onChange={e => setField("referee", e.target.value)} placeholder="e.g. Aleem Dar" />
                </div>
              </div>
            </Card>

            {/* Status & Timing */}
            <Card title="Status & timing" icon="ti ti-clock">
              <div style={s.fieldGroup}>
                <FieldLabel>Match status</FieldLabel>
                <div style={s.chipRow}>
                  {STATUS_OPTIONS.map(st => {
                    const c = STATUS_COLORS[st];
                    const active = form.status === st;
                    return (
                      <button
                        key={st}
                        type="button"
                        style={{
                          ...s.chip,
                          ...(active ? { background: c.bg, color: c.text, border: `2px solid ${c.text}` } : {}),
                        }}
                        onClick={() => setField("status", st)}
                      >{st.replace("_", " ")}</button>
                    );
                  })}
                </div>
              </div>
              <div style={s.twoField}>
                <div style={s.fieldGroup}>
                  <FieldLabel>Period</FieldLabel>
                  <select
                    style={s.select}
                    value={form.period}
                    onChange={e => setField("period", e.target.value)}
                  >
                    {periods.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <NumberStepper label="Minute" value={form.minute} onChange={v => setField("minute", v)} max={120} />
              </div>
            </Card>

            {/* Home team */}
            <Card title={`Home team — ${form.homeTeam.name || "Home"}`} icon="ti ti-home">
              <div style={s.fieldGroup}>
                <FieldLabel>Team name</FieldLabel>
                <InputBox value={form.homeTeam.name} onChange={e => setHome("name", e.target.value)} placeholder="Home team name" />
              </div>
              <div style={s.threeField}>
                <NumberStepper
                  label={isCricket ? "Runs" : "Goals / Points"}
                  value={form.homeTeam.score}
                  onChange={v => setHome("score", v)}
                  max={999}
                />
                {isCricket && (
                  <>
                    <NumberStepper
                      label="Wickets"
                      value={form.homeTeam.wickets ?? 0}
                      onChange={v => setHome("wickets", v)}
                      max={10}
                    />
                    <div style={s.fieldGroup}>
                      <FieldLabel>Overs</FieldLabel>
                      <InputBox
                        value={form.homeTeam.overs ?? ""}
                        onChange={e => setHome("overs", e.target.value)}
                        placeholder="18.2"
                      />
                    </div>
                  </>
                )}
                {!isCricket && (
                  <NumberStepper
                    label="Fouls"
                    value={form.homeTeam.fouls ?? 0}
                    onChange={v => setHome("fouls", v)}
                    max={50}
                  />
                )}
              </div>
            </Card>

            {/* Away team */}
            <Card title={`Away team — ${form.awayTeam.name || "Away"}`} icon="ti ti-plane">
              <div style={s.fieldGroup}>
                <FieldLabel>Team name</FieldLabel>
                <InputBox value={form.awayTeam.name} onChange={e => setAway("name", e.target.value)} placeholder="Away team name" />
              </div>
              <div style={s.threeField}>
                <NumberStepper
                  label={isCricket ? "Runs" : "Goals / Points"}
                  value={form.awayTeam.score}
                  onChange={v => setAway("score", v)}
                  max={999}
                />
                {isCricket && (
                  <>
                    <NumberStepper
                      label="Wickets"
                      value={form.awayTeam.wickets ?? 0}
                      onChange={v => setAway("wickets", v)}
                      max={10}
                    />
                    <div style={s.fieldGroup}>
                      <FieldLabel>Overs</FieldLabel>
                      <InputBox
                        value={form.awayTeam.overs ?? ""}
                        onChange={e => setAway("overs", e.target.value)}
                        placeholder="20.0"
                      />
                    </div>
                  </>
                )}
                {!isCricket && (
                  <NumberStepper
                    label="Fouls"
                    value={form.awayTeam.fouls ?? 0}
                    onChange={v => setAway("fouls", v)}
                    max={50}
                  />
                )}
              </div>
            </Card>

            {/* Notes */}
            <Card title="Internal notes" icon="ti ti-notes">
              <textarea
                style={s.textarea}
                rows={3}
                placeholder="Optional internal notes about this match update…"
                value={form.notes}
                onChange={e => setField("notes", e.target.value)}
              />
            </Card>

            {/* Actions */}
            <div style={s.actions}>
              <button type="button" style={s.primaryBtn} onClick={handleSave} disabled={loading}>
                {loading
                  ? <><i className="ti ti-loader-2" /> Saving…</>
                  : <><i className="ti ti-device-floppy" /> Save changes</>
                }
              </button>
              <button type="button" style={s.ghostBtn} onClick={() => { setForm(INITIAL); setSaved(false); }}>
                Reset to original
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s: Record<string, React.CSSProperties> = {
  shell: {
    flex: 1,
    height: "100%",
    overflowY: "auto",
    padding: "28px 32px",
    display: "flex",
    flexDirection: "column",
    gap: 24,
    fontFamily: FONT_UI,
  },
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
    margin: 0,
  },
  pageSub: {
    fontFamily: FONT_UI,
    fontSize: "0.8125rem",
    color: "#6B7280",
    marginTop: 4,
    marginBottom: 0,
  },
  saveBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "10px 18px",
    borderRadius: 8,
    border: `2px solid ${DARK}`,
    background: YELLOW,
    color: DARK,
    fontFamily: FONT_UI,
    fontSize: "0.875rem",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "3px 3px 0 #1f1f1f",
    transition: "all 0.15s",
  },
  saveBtnSaved: {
    background: "#DCFCE7",
    borderColor: "#15803D",
    color: "#15803D",
    boxShadow: "3px 3px 0 #15803D",
  },
  twoCol: {
    display: "grid",
    gridTemplateColumns: "300px 1fr",
    gap: 24,
    alignItems: "start",
  },
  formCol: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },
  card: {
    background: "#fff",
    border: `2px solid ${DARK}`,
    borderRadius: 12,
    overflow: "hidden",
    boxShadow: "3px 3px 0 #1f1f1f",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "11px 16px",
    background: "#FAFAFA",
    borderBottom: `2px solid ${DARK}`,
  },
  cardIcon: {
    fontSize: 15,
    color: DARK,
  },
  cardTitle: {
    fontFamily: FONT_UI,
    fontSize: "0.75rem",
    fontWeight: 700,
    color: DARK,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  cardBody: {
    padding: "14px 16px",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  fieldLabel: {
    fontFamily: FONT_UI,
    fontSize: "0.6875rem",
    fontWeight: 700,
    color: "#374151",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  input: {
    width: "100%",
    padding: "9px 12px",
    borderRadius: 8,
    border: "2px solid #E5E7EB",
    fontFamily: FONT_UI,
    fontSize: "0.875rem",
    color: DARK,
    background: "#FAFAFA",
    outline: "none",
    boxSizing: "border-box",
  },
  select: {
    width: "100%",
    padding: "9px 12px",
    borderRadius: 8,
    border: "2px solid #E5E7EB",
    fontFamily: FONT_UI,
    fontSize: "0.875rem",
    color: DARK,
    background: "#FAFAFA",
    outline: "none",
  },
  textarea: {
    width: "100%",
    padding: "9px 12px",
    borderRadius: 8,
    border: "2px solid #E5E7EB",
    fontFamily: FONT_UI,
    fontSize: "0.875rem",
    color: DARK,
    background: "#FAFAFA",
    outline: "none",
    resize: "vertical",
    lineHeight: 1.5,
    minHeight: 72,
    boxSizing: "border-box",
  },
  chipRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 6,
  },
  chip: {
    padding: "6px 12px",
    borderRadius: 7,
    border: "1.5px solid #E5E7EB",
    background: "#FAFAFA",
    fontFamily: FONT_UI,
    fontSize: "0.75rem",
    fontWeight: 600,
    color: "#6B7280",
    cursor: "pointer",
    textTransform: "capitalize",
  },
  chipActive: {
    background: DARK,
    color: YELLOW,
    border: `1.5px solid ${DARK}`,
  },
  twoField: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
  },
  threeField: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 12,
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  actions: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  primaryBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    padding: "12px",
    borderRadius: 8,
    border: `2px solid ${DARK}`,
    background: YELLOW,
    color: DARK,
    fontFamily: FONT_UI,
    fontSize: "0.9375rem",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "3px 3px 0 #1f1f1f",
  },
  ghostBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    padding: "10px",
    borderRadius: 8,
    border: "2px solid #E5E7EB",
    background: "transparent",
    color: "#6B7280",
    fontFamily: FONT_UI,
    fontSize: "0.875rem",
    fontWeight: 600,
    cursor: "pointer",
  },
};