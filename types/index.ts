export type WorkoutType = "lower_body" | "full_body" | "hiit" | "strength";
export type MuscleGroup =
  | "legs"
  | "glutes"
  | "arms"
  | "core"
  | "back"
  | "chest"
  | "shoulders"
  | "cardio";

export interface Video {
  id: string; // uuid
  youtube_id: string; // unique
  title: string;
  duration_minutes: number; // 30-35 only
  workout_type: WorkoutType;
  muscle_groups: MuscleGroup[];
  thumbnail_url: string; // maxresdefault from YouTube
  channel_published_at: string; // for sorting by newest
  created_at: string;
  updated_at?: string;
}

export interface WorkoutLog {
  id: string; // uuid
  video_id: string; // foreign key
  completed_at: string; // timestamp
  workout_type: string;
  muscle_groups: string[];
  duration_minutes: number;
}

export interface MuscleGroupStatus {
  workout_type: string;
  last_worked: string | null;
  days_ago: number;
  ready: boolean;
}

