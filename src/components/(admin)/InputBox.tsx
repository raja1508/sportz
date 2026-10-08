"use client";

import React from "react";

// ─── Design tokens (mirror globals.css) ──────────────────────────────────────
const YELLOW = "#FCDA3D";
const DARK   = "#1f1f1f";
const FONT_UI      = "var(--font-ui, 'Barlow', sans-serif)";
const FONT_DISPLAY = "var(--font-display, 'Barlow Condensed', sans-serif)";


export type InputType = "text" | "number" | "email" | "password" | "datetime-local" | "date";

interface InputBoxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  hint?: string;
  error?: string;
  type?: InputType;
  icon?: React.ReactNode;
}

export function InputBox({
  label,
  hint,
  error,
  icon,
  style,
  id,
  ...rest
}: InputBoxProps) {
  const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, width: "100%" }}>
      {label && (
        <label htmlFor={inputId} style={inputStyles.label}>
          {label}
        </label>
      )}
      <div style={{ position: "relative" }}>
        {icon && (
          <span style={inputStyles.iconWrap}>{icon}</span>
        )}
        <input
          id={inputId}
          style={{
            ...inputStyles.input,
            ...(icon ? { paddingLeft: 34 } : {}),
            ...(error ? inputStyles.inputError : {}),
            ...style,
          }}
          {...rest}
        />
      </div>
      {error && <span style={inputStyles.error}>{error}</span>}
      {hint && !error && <span style={inputStyles.hint}>{hint}</span>}
    </div>
  );
}

export function Select({
  label,
  hint,
  error,
  style,
  id,
  children,
  ...rest
}: Omit<InputBoxProps, "type"> & { children: React.ReactNode }) {
  const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, width: "100%" }}>
      {label && (
        <label htmlFor={inputId} style={inputStyles.label}>
          {label}
        </label>
      )}
      <select
        id={inputId}
        style={{ ...inputStyles.input, ...style }}
        {...(rest as React.SelectHTMLAttributes<HTMLSelectElement>)}
      >
        {children}
      </select>
      {error && <span style={inputStyles.error}>{error}</span>}
      {hint && !error && <span style={inputStyles.hint}>{hint}</span>}
    </div>
  );
}

export function Textarea({
  label,
  hint,
  error,
  style,
  id,
  rows = 3,
  ...rest
}: Omit<InputBoxProps, "type"> & { rows?: number }) {
  const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, width: "100%" }}>
      {label && (
        <label htmlFor={inputId} style={inputStyles.label}>
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        rows={rows}
        style={{ ...inputStyles.input, resize: "vertical", lineHeight: 1.5, ...style }}
        {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
      />
      {error && <span style={inputStyles.error}>{error}</span>}
      {hint && !error && <span style={inputStyles.hint}>{hint}</span>}
    </div>
  );
}

const inputStyles: Record<string, React.CSSProperties> = {
  label: {
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
    border: `2px solid #E5E7EB`,
    fontFamily: FONT_UI,
    fontSize: "0.875rem",
    color: DARK,
    background: "#FAFAFA",
    outline: "none",
    transition: "border-color 0.12s, box-shadow 0.12s",
  },
  inputError: {
    borderColor: "#EF4444",
  },
  error: {
    fontFamily: FONT_UI,
    fontSize: "0.75rem",
    color: "#EF4444",
  },
  hint: {
    fontFamily: FONT_UI,
    fontSize: "0.75rem",
    color: "#9CA3AF",
  },
  iconWrap: {
    position: "absolute",
    left: 10,
    top: "50%",
    transform: "translateY(-50%)",
    color: "#9CA3AF",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    fontSize: 14,
  },
};