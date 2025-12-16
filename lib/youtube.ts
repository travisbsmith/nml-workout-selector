interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  duration: string; // ISO 8601: PT30M15S
}

/**
 * Fetch ALL videos from a channel using pagination
 */
export async function fetchAllChannelVideos(
  channelId: string
): Promise<YouTubeVideo[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    throw new Error("YOUTUBE_API_KEY is not set");
  }

  const allVideoIds: string[] = [];
  let nextPageToken: string | undefined = undefined;

  // Step 1: Paginate through all search results to get video IDs
  do {
    const searchUrl = new URL("https://www.googleapis.com/youtube/v3/search");
    searchUrl.searchParams.set("part", "id");
    searchUrl.searchParams.set("channelId", channelId);
    searchUrl.searchParams.set("type", "video");
    searchUrl.searchParams.set("order", "date");
    searchUrl.searchParams.set("maxResults", "50");
    searchUrl.searchParams.set("key", apiKey);
    if (nextPageToken) {
      searchUrl.searchParams.set("pageToken", nextPageToken);
    }

    const searchRes = await fetch(searchUrl);
    if (!searchRes.ok) {
      const error = await searchRes.json();
      throw new Error(`YouTube search failed: ${JSON.stringify(error)}`);
    }

    const searchData = await searchRes.json();
    const videoIds = searchData.items
      .filter((item: any) => item.id?.videoId)
      .map((item: any) => item.id.videoId);

    allVideoIds.push(...videoIds);
    nextPageToken = searchData.nextPageToken;

    console.log(`Fetched ${allVideoIds.length} video IDs so far...`);
  } while (nextPageToken);

  console.log(`Total video IDs found: ${allVideoIds.length}`);

  if (allVideoIds.length === 0) {
    return [];
  }

  // Step 2: Get video details in batches of 50 (API limit)
  const allVideos: YouTubeVideo[] = [];
  const batchSize = 50;

  for (let i = 0; i < allVideoIds.length; i += batchSize) {
    const batch = allVideoIds.slice(i, i + batchSize);

    const videosUrl = new URL("https://www.googleapis.com/youtube/v3/videos");
    videosUrl.searchParams.set("part", "contentDetails,snippet");
    videosUrl.searchParams.set("id", batch.join(","));
    videosUrl.searchParams.set("key", apiKey);

    const videosRes = await fetch(videosUrl);
    if (!videosRes.ok) {
      const error = await videosRes.json();
      throw new Error(`YouTube videos fetch failed: ${JSON.stringify(error)}`);
    }

    const videosData = await videosRes.json();

    const videos = videosData.items
      .filter((item: any) => item.contentDetails?.duration)
      .map((item: any) => ({
        id: item.id,
        title: item.snippet.title,
        thumbnail:
          item.snippet.thumbnails?.maxresdefault?.url ||
          item.snippet.thumbnails?.high?.url ||
          item.snippet.thumbnails?.medium?.url ||
          "",
        publishedAt: item.snippet.publishedAt,
        duration: item.contentDetails.duration,
      }));

    allVideos.push(...videos);
    console.log(`Fetched details for ${allVideos.length} videos...`);
  }

  return allVideos;
}

/**
 * Fetch a limited number of videos (for testing)
 */
export async function fetchChannelVideos(
  channelId: string,
  maxResults: number = 50
): Promise<YouTubeVideo[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    throw new Error("YOUTUBE_API_KEY is not set");
  }

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
  const videoIds = searchData.items
    .filter((item: any) => item.id?.videoId)
    .map((item: any) => item.id.videoId);

  if (videoIds.length === 0) {
    return [];
  }

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

  return videosData.items
    .filter((item: any) => item.contentDetails?.duration)
    .map((item: any) => ({
      id: item.id,
      title: item.snippet.title,
      thumbnail:
        item.snippet.thumbnails?.maxresdefault?.url ||
        item.snippet.thumbnails?.high?.url ||
        item.snippet.thumbnails?.medium?.url ||
        "",
      publishedAt: item.snippet.publishedAt,
      duration: item.contentDetails.duration,
    }));
}

// Parse ISO 8601 duration to minutes
export function parseDuration(iso8601: string | undefined | null): number {
  if (!iso8601) return 0;

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
