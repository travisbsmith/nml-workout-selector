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

  // Get eligible workout types (3+ days rest)
  const eligibleTypes =
    statusData
      ?.filter((s: any) => s.ready)
      .map((s: any) => s.workout_type) || [];

  // Get recent video IDs (to avoid repeats within 42 days)
  const { data: recentIds, error: recentError } = await supabase.rpc(
    "get_recent_video_ids",
    { days: 42 }
  );

  if (recentError) {
    console.error("Error fetching recent video IDs:", recentError);
  }

  const recentVideoIds = recentIds?.map((r: any) => r.video_id) || [];

  // Try to find videos matching eligible types
  if (eligibleTypes.length > 0) {
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

    if (!error && videos && videos.length > 0) {
      const shuffled = videos.sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, Math.min(3, shuffled.length));

      return {
        workouts: selected,
        muscleStatus: statusData,
        relaxed: false,
      };
    }
  }

  // Fallback: Get ANY videos (ignore rest period, but still avoid recent repeats)
  // This handles the case where all videos are tagged with one type
  let fallbackQuery = supabase
    .from("videos")
    .select("*")
    .order("channel_published_at", { ascending: false })
    .limit(20);

  if (recentVideoIds.length > 0) {
    fallbackQuery = fallbackQuery.not("id", "in", `(${recentVideoIds.join(",")})`);
  }

  const { data: fallbackVideos, error: fallbackError } = await fallbackQuery;

  if (fallbackError) throw fallbackError;

  // If still no videos (all were recently watched), get any videos
  let finalVideos = fallbackVideos;
  if (!finalVideos || finalVideos.length === 0) {
    const { data: anyVideos, error: anyError } = await supabase
      .from("videos")
      .select("*")
      .order("channel_published_at", { ascending: false })
      .limit(20);

    if (anyError) throw anyError;
    finalVideos = anyVideos;
  }

  const shuffled = (finalVideos || []).sort(() => Math.random() - 0.5);
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
