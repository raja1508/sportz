"use client";

import React from "react";

// ─── Design tokens (mirror globals.css) ──────────────────────────────────────
const YELLOW = "#FCDA3D";
const DARK   = "#1f1f1f";
const FONT_UI      = "var(--font-ui, 'Barlow', sans-serif)";
const FONT_DISPLAY = "var(--font-display, 'Barlow Condensed', sans-serif)";

interface ChipOption {
    value: string;
    label: string;
    icon?: string; // tabler class
    activeColor?: string;
    activeText?: string;
  }
  
  interface ChipSelectorProps {
    options: ChipOption[];
    value: string;
    onChange: (value: string) => void;
    columns?: number;
  }
  
  export function ChipSelector({ options, value, onChange, columns = 4 }: ChipSelectorProps) {
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: 8,
        }}
      >
        {options.map((opt) => {
          const active = value === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => onChange(opt.value)}
              style={{
                padding: "8px 6px",
                borderRadius: 8,
                border: active ? `2px solid ${opt.activeColor ?? DARK}` : "2px solid #E5E7EB",
                background: active ? (opt.activeColor ?? DARK) : "#FAFAFA",
                color: active ? (opt.activeText ?? YELLOW) : "#6B7280",
                fontFamily: FONT_UI,
                fontSize: "0.75rem",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                transition: "background 0.12s, border-color 0.12s",
              }}
            >
              {opt.icon && (
                <i className={opt.icon} style={{ fontSize: 18 }} aria-hidden="true" />
              )}
              {opt.label}
            </button>
          );
        })}
      </div>
    );
  }