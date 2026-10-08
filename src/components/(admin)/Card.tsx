"use client";

import React from "react";

// ─── Design tokens (mirror globals.css) ──────────────────────────────────────
const YELLOW = "#FCDA3D";
const DARK   = "#1f1f1f";
const FONT_UI      = "var(--font-ui, 'Barlow', sans-serif)";
const FONT_DISPLAY = "var(--font-display, 'Barlow Condensed', sans-serif)";

interface CardProps {
    title?: string;
    icon?: string;           // Tabler icon class e.g. "ti ti-users"
    children: React.ReactNode;
    style?: React.CSSProperties;
    noPadding?: boolean;
  }
  
  export function Card({ title, icon, children, style, noPadding }: CardProps) {
    return (
      <div style={{ ...cardStyles.card, ...(noPadding ? { padding: 0 } : {}), ...style }}>
        {title && (
          <div style={cardStyles.cardTitle}>
            {icon && <i className={icon} style={cardStyles.cardIcon} aria-hidden="true" />}
            {title}
          </div>
        )}
        {children}
      </div>
    );
  }
  
  const cardStyles: Record<string, React.CSSProperties> = {
    card: {
      background: "#fff",
      border: `2px solid ${DARK}`,
      borderRadius: 14,
      padding: "18px 20px",
      boxShadow: "3px 3px 0 #1f1f1f",
    },
    cardTitle: {
      fontFamily: FONT_DISPLAY,
      fontSize: "1rem",
      fontWeight: 800,
      color: DARK,
      letterSpacing: "0.01em",
      marginBottom: 16,
      display: "flex",
      alignItems: "center",
      gap: 8,
    },
    cardIcon: {
      fontSize: 16,
      color: "#6B7280",
    },
  };