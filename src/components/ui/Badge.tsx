// src/components/ui/Badge.tsx

import { Sport } from "@/types";

interface BadgeProps {
  sport: Sport;
  className?: string;
}

// Each sport gets its own subtle color pair
const sportStyles: Record<Sport, { bg: string; text: string; border: string }> = {
  football:   { bg: "#F0FDF4", text: "#166534", border: "#BBF7D0" },
  Cricket:    { bg: "#FFF7ED", text: "#9A3412", border: "#FED7AA" },
  basketball: { bg: "#EFF6FF", text: "#1E40AF", border: "#BFDBFE" },
  tennis:     { bg: "#FDF4FF", text: "#7E22CE", border: "#E9D5FF" },
};

// Clean display labels
const sportLabels: Record<Sport, string> = {
  football:   "Football",
  Cricket:    "Cricket",
  basketball: "Basketball",
  tennis:     "Tennis",
};

export default function Badge({ sport, className = "" }: BadgeProps) {
  const style = sportStyles[sport];

  return (
    <span
      className={`sport-badge ${className}`}
      style={{
        backgroundColor: style.bg,
        color: style.text,
        borderColor: style.border,
      }}
    >
      {sportLabels[sport]}
    </span>
  );
}