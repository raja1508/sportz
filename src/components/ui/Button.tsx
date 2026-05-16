// src/components/ui/Button.tsx

interface ButtonProps {
    /** Visual style variant */
    variant?: "primary" | "secondary" | "watching";
    /** Button label */
    children: React.ReactNode;
    /** Click handler */
    onClick?: () => void;
    /** Disabled state */
    disabled?: boolean;
    /** Extra class names */
    className?: string;
    /** Button type */
    type?: "button" | "submit" | "reset";
  }
  
  export default function Button({
    variant = "primary",
    children,
    onClick,
    disabled = false,
    className = "",
    type = "button",
  }: ButtonProps) {
    const variantClass = {
      primary:   "btn-primary",
      secondary: "btn-secondary",
      watching:  "btn-watching",
    }[variant];
  
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`${variantClass} ${className} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {children}
      </button>
    );
  }