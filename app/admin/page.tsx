"use client";

import { useState } from "react";

export default function AdminPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [stats, setStats] = useState<{
    totalOnChannel?: number;
    matching30to35min?: number;
    inserted?: number;
  } | null>(null);

  const fetchVideos = async () => {
    setLoading(true);
    setMessage("Fetching ALL videos from the channel... This may take a minute.");
    setStats(null);
    try {
      const res = await fetch("/api/admin/fetch-videos");
      const data = await res.json();
      if (data.error) {
        setMessage(`Error: ${data.error}`);
      } else {
        setMessage("Successfully fetched and saved videos!");
        setStats({
          totalOnChannel: data.totalOnChannel,
          matching30to35min: data.matching30to35min,
          inserted: data.inserted,
        });
      }
    } catch (error) {
      setMessage(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7] p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
          <button
            onClick={fetchVideos}
            disabled={loading}
            className="bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 disabled:opacity-50 min-h-[44px] w-full"
          >
            {loading ? "Fetching all videos... (this takes ~1 min)" : "Fetch ALL Videos from YouTube Channel"}
          </button>

          {message && (
            <p
              className={`p-4 rounded ${
                message.includes("Error")
                  ? "bg-red-100 text-red-800"
                  : message.includes("Successfully")
                  ? "bg-green-100 text-green-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {message}
            </p>
          )}

          {stats && (
            <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-800">
                  {stats.totalOnChannel}
                </div>
                <div className="text-sm text-gray-500">Total on Channel</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {stats.matching30to35min}
                </div>
                <div className="text-sm text-gray-500">30-35 min Videos</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {stats.inserted}
                </div>
                <div className="text-sm text-gray-500">Saved to DB</div>
              </div>
            </div>
          )}

          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <h2 className="font-semibold mb-2">Instructions:</h2>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Click the button above to fetch ALL videos from the NML channel</li>
              <li>Only videos with 30-35 minute duration are saved</li>
              <li>Go to <a href="https://supabase.com/dashboard/project/kltqxqxbfzczlupxstsx/editor" target="_blank" className="text-blue-600 underline">Supabase Table Editor</a></li>
              <li>Tag each video with the correct workout_type and muscle_groups</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
