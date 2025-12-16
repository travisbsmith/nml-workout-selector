import { getWorkoutSuggestions } from "@/app/actions/workouts";
import WorkoutCard from "@/components/WorkoutCard";
import Link from "next/link";

export default async function WorkoutsPage() {
  const { workouts, relaxed } = await getWorkoutSuggestions();

  if (!workouts || workouts.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#F7F7F7]">
        <div className="text-center">
          <p className="text-xl mb-4">No workouts available right now!</p>
          <Link href="/" className="text-[#FF6B6B] underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F7F7] p-4 pb-20 safe-bottom">
      {/* Header */}
      <header className="py-6">
        <Link
          href="/"
          className="text-[#FF6B6B] flex items-center gap-2 mb-4"
        >
          <span>←</span> Back
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Choose Your Workout</h1>
        {relaxed && (
          <p className="text-[#FFE66D] text-sm mt-2">
            ⚠️ Some workouts have shorter rest periods
          </p>
        )}
      </header>

      {/* Workout Cards */}
      <div className="space-y-4">
        {workouts.map((workout: any) => (
          <WorkoutCard key={workout.id} workout={workout} />
        ))}
      </div>
    </main>
  );
}

