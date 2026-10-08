"use client";

import { useState } from "react";
import { InputBox } from "./InputBox";
import { Card } from "./Card";
import { ChipSelector } from "./ChipOption";
import { SectionDivider } from "./SectionDivider";
import { Button } from "./Button";

// ─── Types ────────────────────────────────────────────────────────────────────

type MatchStatus = "scheduled" | "live" | "finished" | "postponed" | "cancelled";

interface CreateMatchPayload {
  sport:     string;
  homeTeam:  string;
  awayTeam:  string;
  homeScore: number;
  awayScore: number;
  status:    MatchStatus;
  startTime: string;
  endTime:   string;
}

// ─── Config ───────────────────────────────────────────────────────────────────

const SPORT_OPTIONS = [
  { value: "football",   label: "Football",   icon: "ti ti-ball-football" },
  { value: "cricket",    label: "Cricket",    icon: "ti ti-ball-cricket" },
  { value: "basketball", label: "Basketball", icon: "ti ti-ball-basketball" },
  { value: "other",      label: "Other",      icon: "ti ti-dots" },
];

const STATUS_OPTIONS = [
  { value: "scheduled", label: "Scheduled", activeColor: "#1D4ED8", activeText: "#fff" },
  { value: "live",      label: "Live",      activeColor: "#DC2626", activeText: "#fff" },
  { value: "finished",  label: "Finished",  activeColor: "#065F46", activeText: "#fff" },
  { value: "postponed", label: "Postponed", activeColor: "#D97706", activeText: "#fff" },
  { value: "cancelled", label: "Cancelled", activeColor: "#6B7280", activeText: "#fff" },
];

const STATUS_DOT_COLORS: Record<MatchStatus, string> = {
  live:      "#DC2626",
  scheduled: "#1D4ED8",
  finished:  "#065F46",
  postponed: "#D97706",
  cancelled: "#6B7280",
};

// Icons users can choose for a custom sport
const ICON_OPTIONS = [
  { icon: "ti ti-trophy",       label: "Trophy" },
  { icon: "ti ti-swimming",     label: "Swim" },
  { icon: "ti ti-bike",         label: "Cycling" },
  { icon: "ti ti-run",          label: "Running" },
  { icon: "ti ti-tennis",       label: "Tennis" },
  { icon: "ti ti-golf",         label: "Golf" },
  { icon: "ti ti-volleyball",   label: "Volleyball" },
  
  { icon: "ti ti-rugby",        label: "Rugby" },
  { icon: "ti ti-box",          label: "Boxing" },
  { icon: "ti ti-skateboard",   label: "Skate" },
  { icon: "ti ti-snowflake",    label: "Winter" },
  { icon: "ti ti-archery",      label: "Archery" },
  { icon: "ti ti-kayak",        label: "Kayak" },
  { icon: "ti ti-flame",        label: "Flame" },
  { icon: "ti ti-shield",       label: "Shield" },
  { icon: "ti ti-star",         label: "Star" },
  { icon: "ti ti-bolt",         label: "Bolt" },
  { icon: "ti ti-sword",        label: "Sword" },
  { icon: "ti ti-target",       label: "Target" },
  { icon: "ti ti-dice",         label: "Dice" },
  { icon: "ti ti-heart",        label: "Heart" },
  { icon: "ti ti-horse-toy",    label: "Equestrian" },
  { icon: "ti ti-arrow-right",  label: "Arrow" },
  { icon: "ti ti-medal",        label: "Medal" },
];

// ─── Design tokens ────────────────────────────────────────────────────────────

const DARK        = "#1f1f1f";
const YELLOW      = "#FCDA3D";
const FONT_UI     = "var(--font-ui, 'Barlow', sans-serif)";
const FONT_DISPLAY = "var(--font-display, 'Barlow Condensed', sans-serif)";
const FONT_MONO   = "'JetBrains Mono', 'Fira Code', monospace";

// ─── CustomSportInput ─────────────────────────────────────────────────────────

interface CustomSportInputProps {
  name:         string;
  icon:         string;
  onNameChange: (v: string) => void;
  onIconChange: (v: string) => void;
}

function CustomSportInput({ name, icon, onNameChange, onIconChange }: CustomSportInputProps) {
  const [iconSearch, setIconSearch] = useState("");
  const [showPicker, setShowPicker] = useState(false);

  const filtered = iconSearch.trim()
    ? ICON_OPTIONS.filter((o) => o.label.toLowerCase().includes(iconSearch.toLowerCase()))
    : ICON_OPTIONS;

  return (
    <div style={cs.wrap}>
      <div style={cs.label}>Custom sport</div>

      <div style={cs.row}>
        {/* Icon button */}
        <button
          type="button"
          style={cs.iconBtn}
          onClick={() => setShowPicker((p) => !p)}
          title="Choose icon"
        >
          <i className={icon} style={{ fontSize: 20 }} />
          <i className="ti ti-chevron-down" style={{ fontSize: 10, opacity: 0.5 }} />
        </button>

        {/* Name input */}
        <InputBox
          placeholder="Sport name (e.g. Volleyball)"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          style={{ flex: 1 }}
        />
      </div>

      {/* Icon picker */}
      {showPicker && (
        <div style={cs.picker}>
          <div style={cs.pickerHeader}>
            <span style={cs.pickerTitle}>Choose an icon</span>
            <button type="button" style={cs.pickerClose} onClick={() => setShowPicker(false)}>
              <i className="ti ti-x" style={{ fontSize: 12 }} />
            </button>
          </div>

          <div style={{ padding: "0 10px 8px" }}>
            <InputBox
              placeholder="Search icons…"
              value={iconSearch}
              onChange={(e) => setIconSearch(e.target.value)}
            />
          </div>

          <div style={cs.pickerGrid}>
            {filtered.map((opt) => (
              <button
                key={opt.icon}
                type="button"
                title={opt.label}
                onClick={() => { onIconChange(opt.icon); setShowPicker(false); }}
                style={{
                  ...cs.iconOption,
                  ...(icon === opt.icon ? cs.iconOptionActive : {}),
                }}
              >
                <i className={opt.icon} style={{ fontSize: 20 }} />
                <span style={cs.iconOptionLabel}>{opt.label}</span>
              </button>
            ))}
            {filtered.length === 0 && (
              <div style={{ gridColumn: "1/-1", padding: "14px 0", textAlign: "center", color: "#9CA3AF", fontSize: "0.75rem", fontFamily: FONT_UI }}>
                No icons found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const cs: Record<string, React.CSSProperties> = {
  wrap: {
    position: "relative",
    marginTop: 12,
    border: `2px dashed ${DARK}`,
    borderRadius: 10,
    padding: "12px 14px 14px",
    background: "#FFFBEB",
  },
  label: {
    fontFamily: FONT_UI,
    fontSize: "0.6875rem",
    fontWeight: 700,
    color: "#92400E",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    marginBottom: 8,
  },
  row: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  iconBtn: {
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    gap: 4,
    padding: "7px 10px",
    border: `2px solid ${DARK}`,
    borderRadius: 8,
    background: "#fff",
    cursor: "pointer",
    color: DARK,
    boxShadow: "2px 2px 0 #1f1f1f",
  },
  picker: {
    position: "absolute" as const,
    top: "calc(100% + 6px)",
    left: 0,
    right: 0,
    background: "#fff",
    border: `2px solid ${DARK}`,
    borderRadius: 12,
    boxShadow: "4px 4px 0 #1f1f1f",
    zIndex: 50,
    paddingBottom: 10,
  },
  pickerHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 12px 8px",
    borderBottom: "1.5px solid #F3F4F6",
    marginBottom: 8,
  },
  pickerTitle: {
    fontFamily: FONT_UI,
    fontSize: "0.6875rem",
    fontWeight: 700,
    color: "#6B7280",
    textTransform: "uppercase" as const,
    letterSpacing: "0.06em",
  },
  pickerClose: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#9CA3AF",
    display: "flex",
    alignItems: "center",
  },
  pickerGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(6, 1fr)",
    gap: 4,
    padding: "0 10px",
    maxHeight: 180,
    overflowY: "auto" as const,
  },
  iconOption: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    padding: "8px 4px",
    borderRadius: 7,
    border: "1.5px solid transparent",
    background: "transparent",
    cursor: "pointer",
    color: "#6B7280",
    fontFamily: FONT_UI,
  },
  iconOptionActive: {
    background: YELLOW,
    border: `1.5px solid ${DARK}`,
    color: DARK,
  },
  iconOptionLabel: {
    fontSize: "0.5625rem",
    fontWeight: 600,
    textAlign: "center" as const,
    lineHeight: 1.2,
  },
};

// ─── Live Preview ─────────────────────────────────────────────────────────────

function LivePreview({
  form,
  resolvedSport,
  customIcon,
}: {
  form: CreateMatchPayload;
  resolvedSport: string;
  customIcon: string;
}) {
  const dotColor  = STATUS_DOT_COLORS[form.status] ?? "#888";
  const sportIcon = form.sport === "other"
    ? customIcon
    : SPORT_OPTIONS.find((o) => o.value === form.sport)?.icon ?? "ti ti-trophy";

  return (
    <div style={ps.previewCard}>
      <div style={ps.previewLabel}>Live preview</div>

      <div style={ps.matchPreview}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
          <i className={sportIcon} style={{ fontSize: 13, color: "#6B7280" }} />
          <span style={ps.previewSport}>{resolvedSport.toUpperCase()}</span>
        </div>
        <div style={ps.previewTeamsRow}>
          <span style={ps.previewTeam}>{form.homeTeam || "Home Team"}</span>
          <div style={ps.previewScoreWrap}>
            <span style={ps.previewScore}>{form.homeScore}</span>
            <span style={ps.previewScoreSep}>—</span>
            <span style={ps.previewScore}>{form.awayScore}</span>
          </div>
          <span style={{ ...ps.previewTeam, textAlign: "right" }}>{form.awayTeam || "Away Team"}</span>
        </div>
        <div style={ps.previewStatus}>
          <span style={{ ...ps.statusDot, background: dotColor }} />
          <span style={ps.statusText}>{form.status}</span>
        </div>
      </div>

      <SectionDivider />

      <div style={ps.jsonLabel}>JSON payload preview</div>
      <div style={ps.jsonBox}>
        <span style={ps.jsonPunct}>{"{"}</span>{"\n"}
        {([
          ["sport",     `"${resolvedSport}"`],
          ["homeTeam",  `"${form.homeTeam || "..."}"`],
          ["awayTeam",  `"${form.awayTeam || "..."}"`],
          ["homeScore", String(form.homeScore)],
          ["awayScore", String(form.awayScore)],
          ["status",    `"${form.status}"`],
          ["startTime", `"${form.startTime || "..."}"`],
          ["endTime",   `"${form.endTime   || "..."}"`],
        ] as [string, string][]).map(([key, val], i, arr) => (
          <span key={key}>
            {"  "}
            <span style={ps.jsonKey}>"{key}"</span>
            <span style={ps.jsonPunct}>: </span>
            <span style={ps.jsonVal}>{val}</span>
            {i < arr.length - 1 ? "," : ""}
            {"\n"}
          </span>
        ))}
        <span style={ps.jsonPunct}>{"}"}</span>
      </div>
    </div>
  );
}

const ps: Record<string, React.CSSProperties> = {
  previewCard: {
    background: "#fff",
    border: `2px solid ${DARK}`,
    borderRadius: 14,
    padding: "18px 20px",
    boxShadow: "3px 3px 0 #1f1f1f",
  },
  previewLabel: {
    fontFamily: FONT_UI,
    fontSize: "0.6875rem",
    fontWeight: 700,
    color: "#9CA3AF",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginBottom: 12,
  },
  matchPreview: {
    background: "#FAFAFA",
    border: "1.5px solid #F3F4F6",
    borderRadius: 10,
    padding: 14,
  },
  previewSport: {
    fontFamily: FONT_DISPLAY,
    fontSize: "0.625rem",
    fontWeight: 800,
    color: "#6B7280",
    letterSpacing: "0.08em",
  },
  previewTeamsRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  previewTeam: {
    fontFamily: FONT_UI,
    fontSize: "0.8125rem",
    fontWeight: 700,
    color: DARK,
    flex: 1,
  },
  previewScoreWrap: {
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  previewScore: {
    fontFamily: FONT_DISPLAY,
    fontSize: "1.25rem",
    fontWeight: 900,
    background: DARK,
    color: YELLOW,
    padding: "3px 10px",
    borderRadius: 6,
    minWidth: 36,
    textAlign: "center" as const,
  },
  previewScoreSep: { color: "#D1D5DB", fontSize: "0.875rem" },
  previewStatus: { display: "flex", alignItems: "center", gap: 5, marginTop: 10 },
  statusDot:  { width: 6, height: 6, borderRadius: "50%" },
  statusText: { fontFamily: FONT_UI, fontSize: "0.75rem", color: "#555", textTransform: "capitalize" as const },
  jsonLabel: {
    fontFamily: FONT_UI, fontSize: "0.6875rem", fontWeight: 700,
    color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8,
  },
  jsonBox: {
    background: "#FAFAFA",
    border: "1.5px solid #F3F4F6",
    borderRadius: 8,
    padding: "12px 14px",
    fontFamily: FONT_MONO,
    fontSize: "0.6875rem",
    lineHeight: 1.7,
    overflowX: "auto",
    whiteSpace: "pre" as const,
  },
  jsonPunct: { color: "#9CA3AF" },
  jsonKey:   { color: "#6B7280" },
  jsonVal:   { color: "#065F46" },
};

// ─── CreateMatch (main) ───────────────────────────────────────────────────────

export default function CreateMatch() {
  const [form, setForm] = useState<CreateMatchPayload>({
    sport:     "football",
    homeTeam:  "",
    awayTeam:  "",
    homeScore: 0,
    awayScore: 0,
    status:    "scheduled",
    startTime: "",
    endTime:   "",
  });
  const [loading,     setLoading]     = useState(false);
  const [customSport, setCustomSport] = useState("");
  const [customIcon,  setCustomIcon]  = useState("ti ti-trophy");

  function set<K extends keyof CreateMatchPayload>(key: K, value: CreateMatchPayload[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const resolvedSport = form.sport === "other"
    ? (customSport.trim() || "other")
    : form.sport;

  function handleClear() {
    setForm({
      sport: "football", homeTeam: "", awayTeam: "",
      homeScore: 0, awayScore: 0,
      status: "scheduled", startTime: "", endTime: "",
    });
    setCustomSport("");
    setCustomIcon("ti ti-trophy");
  }

  async function handleCreate() {
    setLoading(true);
    const payload = { ...form, sport: resolvedSport };
    console.log("Create match payload:", payload); // TODO: POST /matches
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
  }

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css"
      />

      <div style={s.shell}>

        {/* ── Page header ─────────────────── */}
        <div style={s.pageHeader}>
          <div>
            <h1 style={s.pageTitle}>Create match</h1>
            <p style={s.pageSub}>Fill in the details to register a new match</p>
          </div>
        </div>

        {/* ── Two-column layout ───────────── */}
        <div style={s.twoCol}>

          {/* LEFT — form */}
          <div style={s.formCol}>

            {/* Sport */}
            <Card title="Sport" icon="ti ti-ball-football" style={s.cardGap}>
              <ChipSelector
                options={SPORT_OPTIONS}
                value={form.sport}
                onChange={(v) => set("sport", v)}
                columns={4}
              />

              {/* Expands only when "Other" is selected */}
              {form.sport === "other" && (
                <CustomSportInput
                  name={customSport}
                  icon={customIcon}
                  onNameChange={setCustomSport}
                  onIconChange={setCustomIcon}
                />
              )}
            </Card>

            {/* Teams & Score */}
            <Card title="Teams & score" icon="ti ti-users" style={s.cardGap}>
              <div style={s.teamsRow}>
                <InputBox
                  placeholder="Home team"
                  value={form.homeTeam}
                  onChange={(e) => set("homeTeam", e.target.value)}
                />
                <div style={s.vsBadge}>vs</div>
                <InputBox
                  placeholder="Away team"
                  value={form.awayTeam}
                  onChange={(e) => set("awayTeam", e.target.value)}
                />
              </div>

              <SectionDivider style={{ margin: "14px 0 12px" }} />

              <div style={s.scoreRow}>
                <InputBox
                  type="number"
                  value={String(form.homeScore)}
                  onChange={(e) => set("homeScore", Number(e.target.value))}
                  style={{ textAlign: "center", fontSize: "1.25rem", fontWeight: 800 }}
                />
                <span style={s.scoreSep}>—</span>
                <InputBox
                  type="number"
                  value={String(form.awayScore)}
                  onChange={(e) => set("awayScore", Number(e.target.value))}
                  style={{ textAlign: "center", fontSize: "1.25rem", fontWeight: 800 }}
                />
              </div>
            </Card>

            {/* Status */}
            <Card title="Status" icon="ti ti-flag" style={s.cardGap}>
              <ChipSelector
                options={STATUS_OPTIONS}
                value={form.status}
                onChange={(v) => set("status", v as MatchStatus)}
                columns={5}
              />
            </Card>

            {/* Schedule */}
            <Card title="Schedule" icon="ti ti-clock" style={s.cardGap}>
              <div style={s.scheduleRow}>
                <InputBox
                  label="Start time"
                  type="datetime-local"
                  value={form.startTime}
                  onChange={(e) => set("startTime", e.target.value)}
                />
                <InputBox
                  label="End time"
                  type="datetime-local"
                  value={form.endTime}
                  onChange={(e) => set("endTime", e.target.value)}
                />
              </div>
            </Card>

            {/* Actions */}
            <div style={s.actions}>
              <Button
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
                onClick={handleCreate}
                icon={<i className="ti ti-plus" />}
              >
                Create match
              </Button>
              <Button
                variant="ghost"
                size="md"
                fullWidth
                onClick={handleClear}
                style={{ marginTop: 8 }}
              >
                Clear form
              </Button>
            </div>
          </div>

          {/* RIGHT — sticky live preview */}
          <div style={s.previewCol}>
            <LivePreview
              form={form}
              resolvedSport={resolvedSport}
              customIcon={customIcon}
            />
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Main layout styles ───────────────────────────────────────────────────────

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
  twoCol: {
    display: "grid",
    gridTemplateColumns: "1fr 320px",
    gap: 20,
    alignItems: "start",
  },
  formCol: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  previewCol: {
    position: "sticky" as const,
    top: 20,
  },
  cardGap:  { marginBottom: 14 },
  teamsRow: {
    display: "grid",
    gridTemplateColumns: "1fr auto 1fr",
    alignItems: "center",
    gap: 10,
  },
  vsBadge: {
    width: 32, height: 32,
    borderRadius: "50%",
    background: "#F3F4F6",
    border: "2px solid #E5E7EB",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: FONT_UI, fontSize: "0.6875rem", fontWeight: 700,
    color: "#9CA3AF", flexShrink: 0,
  },
  scoreRow: {
    display: "grid",
    gridTemplateColumns: "1fr auto 1fr",
    alignItems: "center",
    gap: 10,
  },
  scoreSep: {
    fontFamily: FONT_DISPLAY,
    fontSize: "1.25rem",
    color: "#D1D5DB",
    textAlign: "center" as const,
    flexShrink: 0,
  },
  scheduleRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
  },
  actions: {
    display: "flex",
    flexDirection: "column",
  },
};