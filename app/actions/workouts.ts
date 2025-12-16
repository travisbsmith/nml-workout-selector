"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getWorkoutSuggestions() {
  const supabase = await createClient();

  // Get muscle group status
  const { data: statusData, error: statusError } = await supabase.rpc(
    "get_muscle_group_status"
  );

  if (statusError) {
    console.error("Error fetching muscle group status:", statusError);
    throw statusError;
  }

  // Get eligible workout types
  const eligibleTypes =
    statusData
      ?.filter((s: any) => s.ready)
      .map((s: any) => s.workout_type) || [];

  if (eligibleTypes.length === 0) {
    // Fallback: relax to 2 days
    return getWorkoutSuggestions_relaxed();
  }

  // Get recent video IDs
  const { data: recentIds, error: recentError } = await supabase.rpc(
    "get_recent_video_ids",
    { days: 42 }
  );

  if (recentError) {
    console.error("Error fetching recent video IDs:", recentError);
  }

  const recentVideoIds = recentIds?.map((r: any) => r.video_id) || [];

  // Get eligible videos
  let query = supabase
    .from("videos")
    .select("*")
    .in("workout_type", eligibleTypes)
    .order("channel_published_at", { ascending: false })
    .limit(20);

  if (recentVideoIds.length > 0) {
    query = query.not("id", "in", `(${recentVideoIds.join(",")})`);
  }

  const { data: videos, error } = await query;

  if (error) throw error;
  if (!videos || videos.length === 0) {
    return getWorkoutSuggestions_relaxed();
  }

  // Randomly select 3
  const shuffled = videos.sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, Math.min(3, shuffled.length));

  return {
    workouts: selected,
    muscleStatus: statusData,
    relaxed: false,
  };
}

async function getWorkoutSuggestions_relaxed() {
  const supabase = await createClient();

  // Relax to 2 days rest
  const { data: statusData } = await supabase.rpc("get_muscle_group_status");

  const eligibleTypes =
    statusData
      ?.filter((s: any) => s.days_ago >= 2)
      .map((s: any) => s.workout_type) || [];

  if (eligibleTypes.length === 0) {
    // Last resort: show all types
    eligibleTypes.push("lower_body", "full_body", "hiit", "strength");
  }

  const { data: recentIds } = await supabase.rpc("get_recent_video_ids", {
    days: 42,
  });
  const recentVideoIds = recentIds?.map((r: any) => r.video_id) || [];

  let query = supabase
    .from("videos")
    .select("*")
    .in("workout_type", eligibleTypes)
    .order("channel_published_at", { ascending: false })
    .limit(20);

  if (recentVideoIds.length > 0) {
    query = query.not("id", "in", `(${recentVideoIds.join(",")})`);
  }

  const { data: videos, error } = await query;

  if (error) throw error;

  const shuffled = (videos || []).sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, Math.min(3, shuffled.length));

  return {
    workouts: selected,
    muscleStatus: statusData,
    relaxed: true,
  };
}

export async function completeWorkout(videoId: string) {
  const supabase = await createClient();

  // Get video details
  const { data: video, error: videoError } = await supabase
    .from("videos")
    .select("*")
    .eq("id", videoId)
    .single();

  if (videoError || !video) {
    throw new Error("Video not found");
  }

  // Insert into workout log
  const { error } = await supabase.from("workout_log").insert({
    video_id: videoId,
    workout_type: video.workout_type,
    muscle_groups: video.muscle_groups,
    duration_minutes: video.duration_minutes,
  });

  if (error) {
    console.error("Error completing workout:", error);
    throw error;
  }

  // Revalidate home page to show updated status
  revalidatePath("/");

  return { success: true };
}

export async function getWorkoutHistory(limit: number = 10) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("workout_log")
    .select(
      `
      id,
      completed_at,
      workout_type,
      duration_minutes,
      videos (
        title,
        youtube_id,
        thumbnail_url
      )
    `
    )
    .order("completed_at", { ascending: false })
    .limit(limit);

  if (error) throw error;

  return data;
}
