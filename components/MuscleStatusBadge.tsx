interface MuscleStatusBadgeProps {
  status: {
    workout_type: string;
    days_ago: number;
    ready: boolean;
  };
}

export default function MuscleStatusBadge({
  status,
}: MuscleStatusBadgeProps) {
  const label = status.workout_type
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const daysUntilReady = Math.max(0, 3 - status.days_ago);

  // Icon based on workout type
  const getIcon = () => {
    switch (status.workout_type) {
      case "full_body":
        return "💪";
      case "lower_body":
        return "🦵";
      case "hiit":
        return "🔥";
      case "strength":
        return "🏋️";
      default:
        return "💪";
    }
  };

  return (
    <div
      className={`
        rounded-xl p-4 text-center transition-all duration-300
        ${
          status.ready
            ? "bg-gradient-to-br from-[#22C55E]/20 to-[#16A34A]/10 border border-[#22C55E]/30"
            : "bg-[#1A1A1A] border border-[#52525B]/30"
        }
      `}
    >
      <div className="text-3xl mb-2">{getIcon()}</div>
      <p 
        className={`
          font-bold text-sm uppercase tracking-wide
          ${status.ready ? "text-[#22C55E]" : "text-[#71717A]"}
        `}
        style={{ fontFamily: "var(--font-oswald)" }}
      >
        {label}
      </p>
      {status.ready ? (
        <p className="text-xs mt-1 text-[#22C55E]/80 font-medium">
          READY TO LIFT
        </p>
      ) : (
        <div className="mt-2">
          <div className="flex justify-center gap-1 mb-1">
            {[1, 2, 3].map((day) => (
              <div
                key={day}
                className={`
                  w-2 h-2 rounded-full
                  ${day <= status.days_ago ? "bg-[#DC2626]" : "bg-[#52525B]"}
                `}
              />
            ))}
          </div>
          <p className="text-xs text-[#71717A]">
            {daysUntilReady} {daysUntilReady === 1 ? "day" : "days"} rest
          </p>
        </div>
      )}
    </div>
  );
}
