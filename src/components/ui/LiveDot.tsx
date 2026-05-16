// src/components/ui/LiveDot.tsx

interface LiveDotProps {
    /** Visual size of the dot */
    size?: "sm" | "md" | "lg";
    /** Show the "Live" label next to the dot */
    showLabel?: boolean;
    /** Additional class names */
    className?: string;
  }
  
  const sizeMap = {
    sm: "w-1.5 h-1.5",   // 6px  — inside badges, tight spaces
    md: "w-2 h-2",        // 8px  — match cards (default)
    lg: "w-2.5 h-2.5",   // 10px — commentary panel header
  };
  
  const labelSizeMap = {
    sm: "text-[10px]",
    md: "text-xs",
    lg: "text-sm",
  };
  
  export default function LiveDot({
    size = "md",
    showLabel = false,
    className = "",
  }: LiveDotProps) {
    return (
      <span className={`inline-flex items-center gap-1.5 ${className}`}>
        {/* Outer glow ring */}
        <span className="relative flex items-center justify-center">
          {/* Ping ring — fades outward */}
          <span
            className={`
              absolute inline-flex rounded-full bg-red-400 opacity-60
              animate-ping
              ${sizeMap[size]}
            `}
          />
          {/* Solid core dot */}
          <span
            className={`
              relative inline-flex rounded-full bg-red-500
              ${sizeMap[size]}
            `}
          />
        </span>
  
        {/* Optional "Live" label */}
        {showLabel && (
          <span
            className={`
              font-display font-bold tracking-wide uppercase text-red-500
              ${labelSizeMap[size]}
            `}
          >
            Live
          </span>
        )}
      </span>
    );
  }