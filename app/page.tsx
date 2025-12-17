import { getWorkoutSuggestions, getWorkoutHistory } from "@/app/actions/workouts";
import MuscleStatusBadge from "@/components/MuscleStatusBadge";
import Link from "next/link";

export default async function Home() {
  const { muscleStatus } = await getWorkoutSuggestions();
  const history = await getWorkoutHistory(5);

  return (
    <main className="min-h-screen pumping-gradient-radial texture-overlay p-4 pb-20 safe-bottom">
      {/* Header - Pumping Iron Style */}
      <header className="text-center py-10">
        <div className="mb-2">
          <span className="text-[#D4AF37] text-sm font-semibold tracking-[0.3em] uppercase">
            The Iron Never Lies
          </span>
        </div>
        <h1 
          className="text-5xl md:text-6xl font-bold tracking-tight uppercase"
          style={{ fontFamily: "var(--font-oswald)" }}
        >
          <span className="text-white">PUMPING</span>{" "}
          <span className="text-[#DC2626]">IRON</span>
        </h1>
        <p className="text-[#A3A3A3] mt-3 text-lg">
          Choose Your Workout. Get The Gains.
        </p>
      </header>

      {/* Muscle Group Status */}
      <section className="iron-card rounded-2xl p-6 mb-6">
        <h2 
          className="text-xl font-semibold mb-4 text-[#D4AF37] uppercase tracking-wide"
          style={{ fontFamily: "var(--font-oswald)" }}
        >
          🏆 Muscle Status
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {muscleStatus?.map((status: any) => (
            <MuscleStatusBadge key={status.workout_type} status={status} />
          ))}
        </div>
      </section>

      {/* Main CTA - Big Red Button */}
      <Link
        href="/workouts"
        className="
          block w-full iron-button text-white rounded-xl 
          py-6 text-center text-2xl font-bold uppercase tracking-wider
          min-h-[70px] flex items-center justify-center
        "
        style={{ fontFamily: "var(--font-oswald)" }}
      >
        <span className="flex items-center gap-3">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z"/>
          </svg>
          START WORKOUT
        </span>
      </Link>

      {/* Recent Workouts */}
      {history && history.length > 0 && (
        <section className="mt-8">
          <h2 
            className="text-xl font-semibold mb-4 text-[#D4AF37] uppercase tracking-wide"
            style={{ fontFamily: "var(--font-oswald)" }}
          >
            📋 Recent Lifts
          </h2>
          <div className="space-y-3">
            {history.map((workout: any) => (
              <div
                key={workout.id}
                className="iron-card rounded-xl p-4 flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-[#22C55E]/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#22C55E]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">
                    {workout.videos?.title || "Unknown Workout"}
                  </p>
                  <p className="text-sm text-[#71717A]">
                    {new Date(workout.completed_at).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer Quote */}
      <footer className="mt-12 text-center">
        <p className="text-[#52525B] italic text-sm">
          "The worst thing I can be is the same as everybody else."
        </p>
        <p className="text-[#D4AF37] text-xs mt-1 uppercase tracking-wide">
          — Arnold Schwarzenegger
        </p>
      </footer>
    </main>
  );
}
