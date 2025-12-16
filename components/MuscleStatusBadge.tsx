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

  return (
    <div
      className={`
        rounded-xl p-4 text-center
        ${
          status.ready
            ? "bg-[#95E1D3]/20 text-green-800"
            : "bg-gray-100 text-gray-600"
        }
      `}
    >
      <div className="text-2xl mb-1">{status.ready ? "✅" : "🔒"}</div>
      <p className="font-semibold text-sm">{label}</p>
      {!status.ready && (
        <p className="text-xs mt-1">
          Rest {daysUntilReady} more {daysUntilReady === 1 ? "day" : "days"}
        </p>
      )}
    </div>
  );
}

