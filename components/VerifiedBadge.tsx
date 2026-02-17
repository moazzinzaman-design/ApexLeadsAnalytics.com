import { clsx } from "clsx";

interface VerifiedBadgeProps {
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

export default function VerifiedBadge({
  size = "md",
  showLabel = true,
  className,
}: VerifiedBadgeProps) {
  const sizeClasses = {
    sm: "w-4 h-4 text-xs",
    md: "w-5 h-5 text-sm",
    lg: "w-6 h-6 text-base",
  };

  const paddingClasses = {
    sm: "px-2 py-0.5",
    md: "px-2.5 py-1",
    lg: "px-3 py-1.5",
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        paddingClasses[size],
        "bg-success/15 text-success border border-success/30",
        className
      )}
    >
      <svg
        className={clsx("fill-current", sizeClasses[size])}
        viewBox="0 0 24 24"
      >
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
      </svg>
      {showLabel && <span>Verified</span>}
    </span>
  );
}

