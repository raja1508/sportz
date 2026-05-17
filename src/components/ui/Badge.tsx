interface BadgeProps {
  sport: string;
  className?: string;
}

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

export default function Badge({ sport, className = "" }: BadgeProps) {
  const style =  { bg: "#EFF6FF", text: "#1E40AF", border: "#BFDBFE" };

  return (
    <span
      className={`sport-badge ${className}`}
      style={{
        backgroundColor: style.bg,
        color: style.text,
        borderColor: style.border,
      }}
    >
      {capitalizeFirstLetter(sport)}
    </span>
  );
}