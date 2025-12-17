import { getWorkoutSuggestions } from "@/app/actions/workouts";
import WorkoutCard from "@/components/WorkoutCard";
import Link from "next/link";

export default async function WorkoutsPage() {
  const { workouts, relaxed } = await getWorkoutSuggestions();

  if (!workouts || workouts.length === 0) {
    return (
      <div className="min-h-screen pumping-gradient-radial flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🏋️</div>
          <p 
            className="text-2xl mb-4 text-white uppercase tracking-wide"
            style={{ fontFamily: "var(--font-oswald)" }}
          >
            Rest Day, Champion
          </p>
          <p className="text-[#A3A3A3] mb-6">
            Your muscles need recovery. Come back stronger.
          </p>
          <Link 
            href="/" 
            className="text-[#D4AF37] hover:text-[#F5D76E] font-semibold uppercase tracking-wide"
          >
            ← Back to Base
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen pumping-gradient texture-overlay p-4 pb-20 safe-bottom">
      {/* Header */}
      <header className="py-6">
        <Link
          href="/"
          className="text-[#D4AF37] hover:text-[#F5D76E] flex items-center gap-2 mb-4 font-semibold uppercase text-sm tracking-wide"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/>
          </svg>
          Back
        </Link>
        <h1 
          className="text-4xl font-bold text-white uppercase tracking-tight"
          style={{ fontFamily: "var(--font-oswald)" }}
        >
          Choose Your <span className="text-[#DC2626]">Iron</span>
        </h1>
        {relaxed && (
          <div className="mt-3 flex items-center gap-2 text-[#F59E0B]">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
            </svg>
            <span className="text-sm font-medium">
              Push through! Some muscles still recovering.
            </span>
          </div>
        )}
      </header>

      {/* Workout Cards */}
      <div className="space-y-6">
        {workouts.map((workout: any, index: number) => (
          <WorkoutCard key={workout.id} workout={workout} index={index} />
        ))}
      </div>

      {/* Motivation Footer */}
      <footer className="mt-10 text-center">
        <p className="text-[#52525B] text-sm italic">
          "Strength does not come from winning."
        </p>
      </footer>
    </main>
  );
}
