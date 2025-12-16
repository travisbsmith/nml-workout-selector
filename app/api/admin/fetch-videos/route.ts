import { NextResponse } from "next/server";
import {
  fetchAllChannelVideos,
  filterByDuration,
  parseDuration,
} from "@/lib/youtube";
import { createClient } from "@/lib/supabase/server";

const NML_CHANNEL_ID = "UCIiI9tAbgvSPPL_50gefFtw";

export const maxDuration = 60; // Allow up to 60 seconds for this route

export async function GET(request: Request) {
  try {
    console.log("Starting to fetch ALL videos from channel...");

    // Fetch ALL videos from the channel
    const allVideos = await fetchAllChannelVideos(NML_CHANNEL_ID);
    console.log(`Total videos on channel: ${allVideos.length}`);

    // Filter for 30-35 minute workouts
    const filtered = filterByDuration(allVideos);
    console.log(`Videos in 30-35 min range: ${filtered.length}`);

    const supabase = await createClient();

    let insertedCount = 0;
    let skippedCount = 0;

    // Insert new videos (ignore duplicates)
    for (const video of filtered) {
      const { error } = await supabase.from("videos").upsert(
        {
          youtube_id: video.id,
          title: video.title,
          duration_minutes: parseDuration(video.duration),
          thumbnail_url: video.thumbnail,
          channel_published_at: video.publishedAt,
          workout_type: "full_body", // Default - needs manual tagging
          muscle_groups: ["cardio"], // Default - needs manual tagging
        },
        { onConflict: "youtube_id", ignoreDuplicates: true }
      );

      if (!error) {
        insertedCount++;
      } else {
        skippedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      totalOnChannel: allVideos.length,
      matching30to35min: filtered.length,
      inserted: insertedCount,
      skipped: skippedCount,
    });
  } catch (error: any) {
    console.error("Fetch error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch videos" },
      { status: 500 }
    );
  }
}
