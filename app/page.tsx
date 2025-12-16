import { getWorkoutSuggestions, getWorkoutHistory } from "@/app/actions/workouts";
import MuscleStatusBadge from "@/components/MuscleStatusBadge";
import Link from "next/link";

export default async function Home() {
  const { muscleStatus } = await getWorkoutSuggestions();
  const history = await getWorkoutHistory(5);

  return (
    <main className="min-h-screen bg-[#F7F7F7] p-4 pb-20 safe-bottom">
      {/* Header */}
      <header className="text-center py-8">
        <h1 className="text-4xl font-bold text-gray-900">NML Workout Picker</h1>
        <p className="text-gray-600 mt-2">Find your perfect 30-minute workout</p>
      </header>

      {/* Muscle Group Status */}
      <section className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Workout Status
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {muscleStatus?.map((status: any) => (
            <MuscleStatusBadge key={status.workout_type} status={status} />
          ))}
        </div>
      </section>

      {/* Main CTA */}
      <Link
        href="/workouts"
        className="
          block w-full bg-[#FF6B6B] text-white rounded-2xl 
          py-6 text-center text-2xl font-bold shadow-xl
          active:scale-95 transition-transform
          hover:bg-red-600
          min-h-[44px] flex items-center justify-center
        "
      >
        Get Workout 🎯
      </Link>

      {/* Recent Workouts */}
      {history && history.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Recent Workouts
          </h2>
          <div className="space-y-3">
            {history.map((workout: any) => (
              <div
                key={workout.id}
                className="bg-white rounded-xl p-4 shadow flex items-center gap-3"
              >
                <div className="text-2xl">✅</div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {workout.videos?.title || "Unknown Workout"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(workout.completed_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
