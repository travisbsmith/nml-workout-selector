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
  index?: number;
}

export default function WorkoutCard({ workout, index = 0 }: WorkoutCardProps) {
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
    <div 
      className="iron-card rounded-2xl overflow-hidden"
      style={{ 
        animationDelay: `${index * 100}ms`,
      }}
    >
      {/* Thumbnail with dramatic overlay */}
      <a
        href={youtubeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block relative aspect-video w-full group"
        onClick={() => setShowComplete(true)}
      >
        <Image
          src={workout.thumbnail_url}
          alt={workout.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Dark vignette overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="
            w-20 h-20 rounded-full 
            bg-[#DC2626] 
            flex items-center justify-center
            shadow-lg shadow-red-900/50
            transition-transform duration-300
            group-hover:scale-110
            group-active:scale-95
          ">
            <svg
              className="w-10 h-10 text-white ml-1"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        {/* Duration badge */}
        <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full">
          <span className="text-white text-sm font-bold">
            {workout.duration_minutes} MIN
          </span>
        </div>
      </a>

      {/* Info */}
      <div className="p-5">
        <h3 
          className="font-bold text-xl text-white mb-3 line-clamp-2 uppercase tracking-wide"
          style={{ fontFamily: "var(--font-oswald)" }}
        >
          {workout.title}
        </h3>
        <div className="flex items-center gap-3">
          <span className="
            bg-[#D4AF37]/20 text-[#D4AF37] 
            px-4 py-1.5 rounded-full 
            text-sm font-bold uppercase tracking-wide
            border border-[#D4AF37]/30
          ">
            {workoutTypeLabel}
          </span>
        </div>

        {/* Complete Button - Appears after clicking video */}
        {showComplete && (
          <button
            onClick={handleComplete}
            disabled={loading}
            className="
              mt-5 w-full 
              bg-gradient-to-r from-[#22C55E] to-[#16A34A]
              text-white font-bold uppercase tracking-wider
              py-4 rounded-xl 
              transition-all duration-200
              hover:from-[#16A34A] hover:to-[#15803D]
              active:scale-[0.98]
              disabled:opacity-50 disabled:cursor-not-allowed
              min-h-[56px]
              flex items-center justify-center gap-2
              shadow-lg shadow-green-900/30
            "
            style={{ fontFamily: "var(--font-oswald)" }}
          >
            {loading ? (
              <>
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Logging...
              </>
            ) : (
              <>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                CRUSHED IT
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
