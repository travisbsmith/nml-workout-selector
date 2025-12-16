"use client";

import { useState } from "react";
import { fetchChannelVideos, filterByDuration, parseDuration } from "@/lib/youtube";

export default function AdminPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchVideos = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/fetch-videos");
      const data = await res.json();
      if (data.error) {
        setMessage(`Error: ${data.error}`);
      } else {
        setMessage(`Fetched ${data.count} videos. Please tag them in Supabase.`);
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
            className="bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 disabled:opacity-50 min-h-[44px]"
          >
            {loading ? "Fetching..." : "Fetch New Videos from YouTube"}
          </button>
          {message && (
            <p className={`p-4 rounded ${message.includes("Error") ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>
              {message}
            </p>
          )}
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <h2 className="font-semibold mb-2">Instructions:</h2>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Click "Fetch New Videos" to get videos from NML channel</li>
              <li>Go to Supabase dashboard → videos table</li>
              <li>Tag each video with workout_type and muscle_groups</li>
              <li>Only videos with 30-35 minute duration are fetched</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

