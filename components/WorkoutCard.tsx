"use client";

import Image from "next/image";
import { useState } from "react";
import { completeWorkout } from "@/app/actions/workouts";
import { useRouter } from "next/navigation";

interface WorkoutCardProps {
  workout: {
    id: string;
    youtube_id: string;
    title: string;
    duration_minutes: number;
    workout_type: string;
    thumbnail_url: string;
  };
}

export default function WorkoutCard({ workout }: WorkoutCardProps) {
  const router = useRouter();
  const [showComplete, setShowComplete] = useState(false);
  const [loading, setLoading] = useState(false);

  const youtubeUrl = `https://youtube.com/watch?v=${workout.youtube_id}`;
  const workoutTypeLabel = workout.workout_type
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const handleComplete = async () => {
    setLoading(true);
    try {
      await completeWorkout(workout.id);
      router.push("/");
      router.refresh();
    } catch (error) {
      alert("Failed to log workout");
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Thumbnail */}
      <a
        href={youtubeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block relative aspect-video w-full"
        onClick={() => setShowComplete(true)}
      >
        <Image
          src={workout.thumbnail_url}
          alt={workout.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <div className="bg-red-600 rounded-full w-16 h-16 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </a>

      {/* Info */}
      <div className="p-5">
        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
          {workout.title}
        </h3>
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <span className="bg-[#4ECDC4]/20 px-3 py-1 rounded-full">
            {workout.duration_minutes} min
          </span>
          <span className="bg-[#FF6B6B]/20 px-3 py-1 rounded-full">
            {workoutTypeLabel}
          </span>
        </div>

        {/* Complete Button */}
        {showComplete && (
          <button
            onClick={handleComplete}
            disabled={loading}
            className="
              mt-4 w-full bg-[#95E1D3] text-gray-900 font-semibold
              py-3 rounded-xl active:scale-95 transition-transform
              disabled:opacity-50 disabled:cursor-not-allowed
              min-h-[44px]
            "
          >
            {loading ? "Logging..." : "Mark Complete ✓"}
          </button>
        )}
      </div>
    </div>
  );
}

