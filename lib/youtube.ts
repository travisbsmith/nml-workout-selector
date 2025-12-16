interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  duration: string; // ISO 8601: PT30M15S
}

export async function fetchChannelVideos(
  channelId: string,
  maxResults: number = 50
): Promise<YouTubeVideo[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  
  if (!apiKey) {
    throw new Error("YOUTUBE_API_KEY is not set");
  }

  // Step 1: Search for videos
  const searchUrl = new URL("https://www.googleapis.com/youtube/v3/search");
  searchUrl.searchParams.set("part", "snippet");
  searchUrl.searchParams.set("channelId", channelId);
  searchUrl.searchParams.set("type", "video");
  searchUrl.searchParams.set("order", "date");
  searchUrl.searchParams.set("maxResults", String(maxResults));
  searchUrl.searchParams.set("key", apiKey);

  const searchRes = await fetch(searchUrl);
  if (!searchRes.ok) {
    const error = await searchRes.json();
    throw new Error(`YouTube search failed: ${JSON.stringify(error)}`);
  }

  const searchData = await searchRes.json();
  const videoIds = searchData.items.map((item: any) => item.id.videoId);

  if (videoIds.length === 0) {
    return [];
  }

  // Step 2: Get video details (including duration)
  const videosUrl = new URL("https://www.googleapis.com/youtube/v3/videos");
  videosUrl.searchParams.set("part", "contentDetails,snippet");
  videosUrl.searchParams.set("id", videoIds.join(","));
  videosUrl.searchParams.set("key", apiKey);

  const videosRes = await fetch(videosUrl);
  if (!videosRes.ok) {
    const error = await videosRes.json();
    throw new Error(`YouTube videos fetch failed: ${JSON.stringify(error)}`);
  }

  const videosData = await videosRes.json();

  return videosData.items.map((item: any) => ({
    id: item.id,
    title: item.snippet.title,
    thumbnail:
      item.snippet.thumbnails.maxresdefault?.url ||
      item.snippet.thumbnails.high.url,
    publishedAt: item.snippet.publishedAt,
    duration: item.contentDetails.duration,
  }));
}

// Parse ISO 8601 duration to minutes
export function parseDuration(iso8601: string): number {
  const match = iso8601.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;

  const hours = parseInt(match[1] || "0");
  const minutes = parseInt(match[2] || "0");
  const seconds = parseInt(match[3] || "0");

  return hours * 60 + minutes + (seconds >= 30 ? 1 : 0); // Round up if >= 30s
}

// Filter for 30-35 minute videos
export function filterByDuration(videos: YouTubeVideo[]) {
  return videos.filter((video) => {
    const minutes = parseDuration(video.duration);
    return minutes >= 30 && minutes <= 35;
  });
}

