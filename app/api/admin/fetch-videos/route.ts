import { NextResponse } from "next/server";
import { fetchChannelVideos, filterByDuration, parseDuration } from "@/lib/youtube";
import { createClient } from "@/lib/supabase/server";

const NML_CHANNEL_ID = "UC-MK8kLOUmUZGjKGzVlBaOg";

export async function GET(request: Request) {
  // In production, add authentication here
  // const authHeader = request.headers.get("authorization");
  // if (authHeader !== `Bearer ${process.env.ADMIN_PASSWORD}`) {
  //   return new Response("Unauthorized", { status: 401 });
  // }

  try {
    const videos = await fetchChannelVideos(NML_CHANNEL_ID, 50);
    const filtered = filterByDuration(videos);

    const supabase = await createClient();

    let count = 0;
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
        { onConflict: "youtube_id" }
      );

      if (!error) {
        count++;
      }
    }

    return NextResponse.json({ success: true, count });
  } catch (error: any) {
    console.error("Cron error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch videos" },
      { status: 500 }
    );
  }
}
