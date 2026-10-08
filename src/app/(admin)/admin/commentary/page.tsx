"use client";

import { useState, KeyboardEvent } from "react";
import { Button } from "@/components/(admin)/Button";
import { InputBox } from "@/components/(admin)/InputBox";
import { Card } from "@/components/(admin)/Card";
import { ChipSelector } from "@/components/(admin)/ChipOption";
import { SectionDivider } from "@/components/(admin)/SectionDivider";
import MatchCommentaryPanel from "@/components/(admin)/MatchCommentaryPanel";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CommentaryPayload {
  matchId:   number;
  minute:    number;
  sequence:  number;
  period:    string;
  eventType: string;
  actor:     string;
  team:      string;
  message:   string;
  tags:      string[];
}

interface MatchOption {
  id:       number;
  label:    string;  // "Forest Rangers vs Sunset Blazers — Cricket (Live)"
  sport:    string;
  status:   string;
}

interface AddCommentaryProps {
  matches?: MatchOption[];
  onSubmit?: (payload: CommentaryPayload) => void;
}

// ─── Config ───────────────────────────────────────────────────────────────────

const PRESET_EVENT_TYPES = [
  "GOAL", "WICKET", "SIX", "FOUR", "YELLOW_CARD",
  "RED_CARD", "PENALTY", "SUBSTITUTION", "FOUL",
  "OVER_END", "HALF_TIME", "FULL_TIME", "START",
];

const PRESET_TAGS = [
  "goal", "shot", "wicket", "catch", "six",
  "four", "assist", "penalty", "highlight", "foul",
  "offside", "corner", "free-kick",
];

const PERIOD_OPTIONS = [
  "1st half", "2nd half",
  "1st innings", "2nd innings",
  "Overtime", "Extra time", "1st quarter",
  "2nd quarter", "3rd quarter", "4th quarter",
];

const DEFAULT_MATCHES: MatchOption[] = [
  { id: 1, label: "Forest Rangers vs Sunset Blazers — Cricket (Live)",           sport: "Cricket",    status: "live" },
  { id: 2, label: "Redwood United vs Kingsport FC — Football (Live)",            sport: "Football",   status: "live" },
  { id: 3, label: "Granite Town vs Seaside Albion — Football (Live)",            sport: "Football",   status: "live" },
  { id: 4, label: "Iron Valley Titans vs Crescent City Hoops — Basketball (Live)", sport: "Basketball", status: "live" },
];

// ─── Design tokens ────────────────────────────────────────────────────────────

const DARK         = "#1f1f1f";
const YELLOW       = "#FCDA3D";
const FONT_UI      = "var(--font-ui, 'Barlow', sans-serif)";
const FONT_DISPLAY = "var(--font-display, 'Barlow Condensed', sans-serif)";
const FONT_MONO    = "'JetBrains Mono', 'Fira Code', monospace";

// ─── Event type color map (for badge in preview) ──────────────────────────────

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
};

function getEventColor(type: string) {
  return EVENT_COLORS[type.toUpperCase()] ?? { bg: YELLOW, text: DARK };
}

// ─── TagInput — type to add custom tags ──────────────────────────────────────

interface TagInputProps {
  selected:   string[];
  presets:    string[];
  onChange:   (tags: string[]) => void;
}

function TagInput({ selected, presets, onChange }: TagInputProps) {
  const [input, setInput] = useState("");

  function toggle(tag: string) {
    onChange(
      selected.includes(tag)
        ? selected.filter((t) => t !== tag)
        : [...selected, tag]
    );
  }

  function addCustom() {
    const val = input.trim().toLowerCase().replace(/\s+/g, "-");
    if (!val || selected.includes(val)) { setInput(""); return; }
    onChange([...selected, val]);
    setInput("");
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addCustom(); }
    if (e.key === "Backspace" && !input && selected.length > 0) {
      onChange(selected.slice(0, -1));
    }
  }

  // All tags to show: presets + any custom ones not in presets
  const allTags = [...new Set([...presets, ...selected.filter((t) => !presets.includes(t))])];

  return (
    <div>
      <div style={ti.tagRow}>
        {allTags.map((tag) => {
          const active = selected.includes(tag);
          const isCustom = !presets.includes(tag);
          return (
            <span
              key={tag}
              style={{ ...ti.tag, ...(active ? ti.tagActive : {}), ...(isCustom ? ti.tagCustom : {}) }}
              onClick={() => toggle(tag)}
            >
              {tag}
              {isCustom && (
                <span
                  style={ti.tagRemove}
                  onClick={(e) => { e.stopPropagation(); onChange(selected.filter((t) => t !== tag)); }}
                >×</span>
              )}
            </span>
          );
        })}
      </div>

      {/* Custom tag input */}
      <div style={ti.inputWrap}>
        <InputBox
          placeholder="Type a custom tag + Enter…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{ flex: 1 }}
        />
        <button
          type="button"
          style={ti.addBtn}
          onClick={addCustom}
          disabled={!input.trim()}
        >
          <i className="ti ti-plus" style={{ fontSize: 14 }} />
          Add
        </button>
      </div>
    </div>
  );
}

const ti: Record<string, React.CSSProperties> = {
  tagRow: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: 6,
    marginBottom: 10,
  },
  tag: {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    padding: "4px 10px",
    borderRadius: 20,
    background: "#F3F4F6",
    border: "1.5px solid transparent",
    fontFamily: FONT_UI,
    fontSize: "0.75rem",
    fontWeight: 500,
    color: "#6B7280",
    cursor: "pointer",
    userSelect: "none" as const,
    transition: "background 0.1s",
  },
  tagActive: {
    background: DARK,
    color: YELLOW,
    border: `1.5px solid ${DARK}`,
  },
  tagCustom: {
    borderStyle: "dashed",
    borderColor: "#D1D5DB",
  },
  tagRemove: {
    marginLeft: 2,
    fontSize: "0.875rem",
    lineHeight: 1,
    opacity: 0.6,
    cursor: "pointer",
  },
  inputWrap: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  addBtn: {
    flexShrink: 0,
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    padding: "8px 12px",
    borderRadius: 8,
    border: `2px solid ${DARK}`,
    background: YELLOW,
    color: DARK,
    fontFamily: FONT_UI,
    fontSize: "0.75rem",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "2px 2px 0 #1f1f1f",
  },
};

// ─── EventTypeSelector — preset chips + custom type input ────────────────────

interface EventTypeSelectorProps {
  value:    string;
  onChange: (v: string) => void;
}

function EventTypeSelector({ value, onChange }: EventTypeSelectorProps) {
  const [customInput, setCustomInput] = useState("");
  const isCustom = !PRESET_EVENT_TYPES.includes(value.toUpperCase()) && value !== "";

  function submitCustom() {
    const val = customInput.trim().toUpperCase().replace(/\s+/g, "_");
    if (val) { onChange(val); setCustomInput(""); }
  }

  return (
    <div>
      {/* Preset chips — 3-column grid */}
      <div style={ev.grid}>
        {PRESET_EVENT_TYPES.map((type) => {
          const active = value.toUpperCase() === type;
          const { bg, text } = getEventColor(type);
          return (
            <button
              key={type}
              type="button"
              onClick={() => onChange(type)}
              style={{
                ...ev.chip,
                ...(active
                  ? { background: bg, color: text, border: `2px solid ${text}` }
                  : {}),
              }}
            >
              {type.replace(/_/g, " ")}
            </button>
          );
        })}

        {/* CUSTOM chip — shows when user has typed one */}
        {isCustom && (
          <button
            type="button"
            style={{ ...ev.chip, background: YELLOW, color: DARK, border: `2px solid ${DARK}` }}
          >
            {value}
          </button>
        )}
      </div>

      {/* Custom event type input */}
      <div style={ev.customWrap}>
        <span style={ev.customLabel}>Custom event type</span>
        <div style={ev.customRow}>
          <InputBox
            placeholder="e.g. CORNER_KICK"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); submitCustom(); }}}
            style={{ flex: 1 }}
          />
          <button
            type="button"
            style={ti.addBtn}
            onClick={submitCustom}
            disabled={!customInput.trim()}
          >
            <i className="ti ti-plus" style={{ fontSize: 14 }} />
            Use
          </button>
        </div>
      </div>
    </div>
  );
}

const ev: Record<string, React.CSSProperties> = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 6,
    marginBottom: 12,
  },
  chip: {
    padding: "7px 4px",
    borderRadius: 7,
    border: "1.5px solid #E5E7EB",
    background: "#FAFAFA",
    fontFamily: FONT_UI,
    fontSize: "0.6875rem",
    fontWeight: 700,
    color: "#6B7280",
    cursor: "pointer",
    textAlign: "center" as const,
    letterSpacing: "0.02em",
    transition: "background 0.1s, border-color 0.1s",
  },
  customWrap: {
    marginTop: 10,
    padding: "10px 12px",
    border: `2px dashed ${DARK}`,
    borderRadius: 8,
    background: "#FFFBEB",
  },
  customLabel: {
    display: "block",
    fontFamily: FONT_UI,
    fontSize: "0.6875rem",
    fontWeight: 700,
    color: "#92400E",
    textTransform: "uppercase" as const,
    letterSpacing: "0.06em",
    marginBottom: 8,
  },
  customRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
};

// ─── Commentary Preview ───────────────────────────────────────────────────────

function CommentaryPreview({ form }: { form: CommentaryPayload }) {
  const { bg, text } = getEventColor(form.eventType || "CUSTOM");

  return (
    <div style={pv.card}>
      <div style={pv.label}>Commentary preview</div>

      {/* Event card */}
      <div style={pv.eventCard}>
        {/* Accent bar */}
        <div style={pv.accentBar} />

        <div style={pv.inner}>
          {/* Meta row */}
          <div style={pv.metaRow}>
            <span style={pv.minute}>{form.minute}'</span>
            <span style={pv.meta}>Seq {form.sequence}</span>
            <span style={pv.meta}>{form.period}</span>
            {form.eventType && (
              <span style={{ ...pv.badge, background: bg, color: text }}>
                {form.eventType}
              </span>
            )}
          </div>

          {/* Actor + team */}
          {(form.actor || form.team) && (
            <div style={pv.actorRow}>
              {form.actor && <span style={pv.actor}>{form.actor}</span>}
              {form.actor && form.team && <span style={pv.dot}>·</span>}
              {form.team && <span style={pv.teamName}>{form.team}</span>}
            </div>
          )}

          {/* Message */}
          <p style={pv.message}>{form.message || "Commentary message will appear here."}</p>

          {/* Tags */}
          {form.tags.length > 0 && (
            <div style={pv.tagRow}>
              {form.tags.map((t) => (
                <span key={t} style={pv.tag}>{t}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* <SectionDivider /> */}

      {/* JSON preview */}
      {/* <div style={pv.jsonLabel}>JSON payload</div> */}
      {/* <div style={pv.jsonBox}>
        <span style={pv.jsonPunct}>{"{"}</span>{"\n"}
        {([
          ["matchId",   String(form.matchId)],
          ["minute",    String(form.minute)],
          ["sequence",  String(form.sequence)],
          ["period",    `"${form.period}"`],
          ["eventType", `"${form.eventType || "..."}"`],
          ["actor",     `"${form.actor     || "..."}"`],
          ["team",      `"${form.team      || "..."}"`],
          ["message",   `"${form.message   || "..."}"`],
          ["tags",      `[${form.tags.map((t) => `"${t}"`).join(", ")}]`],
        ] as [string, string][]).map(([key, val], i, arr) => (
          <span key={key}>
            {"  "}
            <span style={pv.jsonKey}>"{key}"</span>
            <span style={pv.jsonPunct}>: </span>
            <span style={/^\d|^\[/.test(val) ? pv.jsonNum : pv.jsonStr}>{val}</span>
            {i < arr.length - 1 ? "," : ""}
            {"\n"}
          </span>
        ))}
        <span style={pv.jsonPunct}>{"}"}</span>
      </div> */}
    </div>
  );
}

const pv: Record<string, React.CSSProperties> = {
  card: {
    background: "#fff",
    border: `2px solid ${DARK}`,
    borderRadius: 14,
    padding: "18px 20px",
    boxShadow: "3px 3px 0 #1f1f1f",
    position: "sticky" as const,
    top: 20,
  },
  label: {
    fontFamily: FONT_UI,
    fontSize: "0.6875rem",
    fontWeight: 700,
    color: "#9CA3AF",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginBottom: 12,
  },
  eventCard: {
    position: "relative",
    background: "#FAFAFA",
    border: "1.5px solid #F3F4F6",
    borderRadius: 10,
    overflow: "hidden",
    display: "flex",
    marginBottom: 4,
  },
  accentBar: {
    width: 3,
    flexShrink: 0,
    background: YELLOW,
  },
  inner: { padding: "12px 14px", flex: 1 },
  metaRow: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap" as const,
    marginBottom: 6,
  },
  minute: {
    fontFamily: FONT_DISPLAY,
    fontSize: "0.9375rem",
    fontWeight: 800,
    color: DARK,
  },
  meta: {
    fontFamily: FONT_UI,
    fontSize: "0.75rem",
    color: "#9CA3AF",
  },
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
  actorRow: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    marginBottom: 5,
  },
  actor: {
    fontFamily: FONT_UI,
    fontSize: "0.8125rem",
    fontWeight: 600,
    color: DARK,
  },
  dot: { color: "#D1D5DB", fontSize: "0.75rem" },
  teamName: {
    fontFamily: FONT_UI,
    fontSize: "0.8125rem",
    color: "#6B7280",
  },
  message: {
    fontFamily: FONT_UI,
    fontSize: "0.875rem",
    color: "#374151",
    lineHeight: 1.55,
    margin: 0,
  },
  tagRow: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: 4,
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
  },
  jsonLabel: {
    fontFamily: FONT_UI,
    fontSize: "0.6875rem",
    fontWeight: 700,
    color: "#9CA3AF",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginBottom: 8,
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
  jsonStr:   { color: "#065F46" },
  jsonNum:   { color: "#1D4ED8" },
};

// ─── AddCommentary (main) ─────────────────────────────────────────────────────

export default function AddCommentary({
  matches = DEFAULT_MATCHES,
  onSubmit,
}: AddCommentaryProps) {
  const [form, setForm] = useState<CommentaryPayload>({
    matchId:   matches[0]?.id ?? 1,
    minute:    42,
    sequence:  120,
    period:    "1st half",
    eventType: "WICKET",
    actor:     "",
    team:      "",
    message:   "",
    tags:      [],
  });
  const [loading, setLoading] = useState(false);

  function set<K extends keyof CommentaryPayload>(key: K, value: CommentaryPayload[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleClear() {
    setForm({
      matchId:   matches[0]?.id ?? 1,
      minute:    42,
      sequence:  120,
      period:    "1st half",
      eventType: "",
      actor:     "",
      team:      "",
      message:   "",
      tags:      [],
    });
  }

  async function handleSubmit() {
    setLoading(true);
    console.log("Commentary payload:", form); // TODO: POST /matches/:id/commentary
    onSubmit?.(form);
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

        {/* ── Page header ─────────────────────── */}
        <div style={s.pageHeader}>
          
          <div>
            <h1 style={s.pageTitle}>Add commentary</h1>
            <p style={s.pageSub}>Log a live event for a match in progress</p>
          </div>
            {/* <CommentaryPreview form={form}></CommentaryPreview> */}
      
        </div>

        {/* ── Two-column layout ───────────────── */}
        <div style={s.twoCol}>

          {/* LEFT — form */}
          <div style={s.formCol}>

            {/* Match selection */}
            <Card title="Match selection" icon="ti ti-ball-football" style={s.cardGap}>
              <div style={s.fieldGroup}>
                <label style={s.fieldLabel}>Select match</label>
                <select
                  style={s.select}
                  value={form.matchId}
                  onChange={(e) => set("matchId", Number(e.target.value))}
                >
                  {matches.map((m) => (
                    <option key={m.id} value={m.id}>{m.label}</option>
                  ))}
                </select>
              </div>
            </Card>

            {/* Timing & sequence */}
            <Card title="Timing & sequence" icon="ti ti-clock" style={s.cardGap}>
              <div style={s.timingRow}>
                <div style={s.fieldGroup}>
                  <label style={s.fieldLabel}>Minute</label>
                  <InputBox
                    type="number"
                    value={String(form.minute)}
                    onChange={(e) => set("minute", Number(e.target.value))}
                    style={{ textAlign: "center", fontWeight: 700 }}
                  />
                </div>
                <div style={s.fieldGroup}>
                  <label style={s.fieldLabel}>Sequence</label>
                  <InputBox
                    type="number"
                    value={String(form.sequence)}
                    onChange={(e) => set("sequence", Number(e.target.value))}
                    style={{ textAlign: "center", fontWeight: 700 }}
                  />
                </div>
                <div style={s.fieldGroup}>
                  <label style={s.fieldLabel}>Period</label>
                  <select
                    style={s.select}
                    value={form.period}
                    onChange={(e) => set("period", e.target.value)}
                  >
                    {PERIOD_OPTIONS.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>
            </Card>

            {/* Event type */}
            <Card title="Event type" icon="ti ti-bolt" style={s.cardGap}>
              <EventTypeSelector
                value={form.eventType}
                onChange={(v) => set("eventType", v)}
              />
            </Card>

            {/* Actor & team */}
            <Card title="Actor & team" icon="ti ti-user" style={s.cardGap}>
              <div style={s.twoField}>
                <div style={s.fieldGroup}>
                  <label style={s.fieldLabel}>Player (actor)</label>
                  <InputBox
                    placeholder="e.g. Alex Morgan"
                    value={form.actor}
                    onChange={(e) => set("actor", e.target.value)}
                  />
                </div>
                <div style={s.fieldGroup}>
                  <label style={s.fieldLabel}>Team</label>
                  <InputBox
                    placeholder="e.g. Forest Rangers"
                    value={form.team}
                    onChange={(e) => set("team", e.target.value)}
                  />
                </div>
              </div>
            </Card>

            {/* Commentary */}
            <Card title="Commentary" icon="ti ti-message" style={s.cardGap}>
              <div style={s.fieldGroup}>
                <label style={s.fieldLabel}>Message</label>
                <textarea
                  style={s.textarea}
                  rows={3}
                  placeholder="Human-readable description of the event…"
                  value={form.message}
                  onChange={(e) => set("message", e.target.value)}
                />
              </div>

              <SectionDivider />

              <label style={s.fieldLabel}>Tags</label>
              <TagInput
                selected={form.tags}
                presets={PRESET_TAGS}
                onChange={(tags) => set("tags", tags)}
              />
            </Card>

            {/* Actions */}
            <div style={s.actions}>
              <Button
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
                onClick={handleSubmit}
                icon={<i className="ti ti-send" />}
              >
                Submit commentary
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

          {/* RIGHT — live preview */}
          {/* <div className="fixed right-20 flex flex-col gap-20"> */}
          {/* <CommentaryPreview form={form} /> */}
          <div className='fixed right-10'>
            <MatchCommentaryPanel
                  match={{
                    sport:     "Cricket",
                    homeTeam:  "Forest Rangers",
                    awayTeam:  "Sunset Blazers",
                    homeScore: 15,
                    awayScore: 0,
                    status:    "live",
                    period:    "1st innings",
                    minute:    13,
                  }}
                  events={[
                    {
                      id: 1, minute: 13, sequence: 533,
                      period: "1st innings", eventType: "START",
                      actor: "Pat Cummins", team: "Forest Rangers",
                      message: "The innings begins with the openers walking out.",
                    },
                    {
                      id: 2, minute: 12, sequence: 532,
                      period: "1st innings", eventType: "OVER_END",
                      actor: "Mitchell Starc", team: "Forest Rangers",
                      message: "End of the over with tidy bowling.",
                    },
                    {
                      id: 3, minute: 11, sequence: 531,
                      period: "1st innings", eventType: "WICKET",
                      actor: "Shubman Gill", team: "Forest Rangers",
                      message: "Wicket! A sharp catch at slip.",
                    },
                    {
                      id: 4, minute: 10, sequence: 530,
                      period: "1st innings", eventType: "SIX",
                      actor: "Virat Kohli", team: "Forest Rangers",
                      message: "Smashed straight down the ground for six.",
                    },
                  ]}/>
                  </div>
          </div>
        
        {/* </div> */}
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
    gridTemplateColumns: "0.92fr 320px",
    gap: 20,
    alignItems: "start",
  },
  formCol: {
    display: "flex",
    flexDirection: "column",
    gap: 0,
  },
  cardGap: { marginBottom: 14 },
  timingRow: {
    display: "grid",
    gridTemplateColumns: "80px 80px 1fr",
    gap: 12,
  },
  twoField: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  fieldLabel: {
    fontFamily: FONT_UI,
    fontSize: "0.6875rem",
    fontWeight: 700,
    color: "#374151",
    textTransform: "uppercase" as const,
    letterSpacing: "0.06em",
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
    appearance: "auto" as unknown as React.CSSProperties["appearance"],
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
    resize: "vertical" as const,
    lineHeight: 1.5,
    minHeight: 80,
  },
  actions: {
    display: "flex",
    flexDirection: "column",
  },
};