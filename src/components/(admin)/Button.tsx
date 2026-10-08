"use client";

import React from "react";

// ─── Design tokens (mirror globals.css) ──────────────────────────────────────
const YELLOW = "#FCDA3D";
const DARK   = "#1f1f1f";
const FONT_UI      = "var(--font-ui, 'Barlow', sans-serif)";
const FONT_DISPLAY = "var(--font-display, 'Barlow Condensed', sans-serif)";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize    = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
}

const BUTTON_BASE: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 6,
  fontFamily: FONT_UI,
  fontWeight: 700,
  borderRadius: 8,
  cursor: "pointer",
  border: "2px solid transparent",
  transition: "opacity 0.12s, transform 0.1s",
  whiteSpace: "nowrap",
  flexShrink: 0,
};

const BUTTON_VARIANTS: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    background: DARK,
    color: YELLOW,
    border: `2px solid ${DARK}`,
    boxShadow: "2px 2px 0 #1f1f1f",
  },
  secondary: {
    background: "transparent",
    color: DARK,
    border: `2px solid ${DARK}`,
  },
  ghost: {
    background: "rgba(0,0,0,0.06)",
    color: DARK,
    border: "2px solid transparent",
  },
  danger: {
    background: "#DC2626",
    color: "#fff",
    border: "2px solid #DC2626",
    boxShadow: "2px 2px 0 #991b1b",
  },
};

const BUTTON_SIZES: Record<ButtonSize, React.CSSProperties> = {
  sm: { fontSize: "0.75rem",   padding: "5px 12px" },
  md: { fontSize: "0.8125rem", padding: "8px 16px" },
  lg: { fontSize: "0.9375rem", padding: "11px 22px" },
};

export function Button({
  variant = "primary",
  size = "md",
  icon,
  fullWidth = false,
  loading = false,
  children,
  style,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      style={{
        ...BUTTON_BASE,
        ...BUTTON_VARIANTS[variant],
        ...BUTTON_SIZES[size],
        ...(fullWidth ? { width: "100%" } : {}),
        ...(disabled || loading ? { opacity: 0.5, cursor: "not-allowed" } : {}),
        ...style,
      }}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <span style={{ fontSize: 13, animation: "spin 0.8s linear infinite" }}>⟳</span>
      ) : icon ? (
        <span style={{ display: "flex", alignItems: "center", fontSize: "1em" }}>{icon}</span>
      ) : null}
      {children}
    </button>
  );
}