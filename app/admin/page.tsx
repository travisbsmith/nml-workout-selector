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
    <div className="min-h-screen pumping-gradient-radial texture-overlay p-8">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8">
          <p className="text-[#D4AF37] text-sm font-semibold tracking-[0.3em] uppercase mb-2">
            Control Center
          </p>
          <h1 
            className="text-4xl font-bold text-white uppercase tracking-tight"
            style={{ fontFamily: "var(--font-oswald)" }}
          >
            Admin <span className="text-[#DC2626]">Panel</span>
          </h1>
        </header>

        <div className="iron-card rounded-2xl p-6 space-y-6">
          <button
            onClick={fetchVideos}
            disabled={loading}
            className="
              w-full iron-button text-white rounded-xl 
              py-5 text-xl font-bold uppercase tracking-wider
              min-h-[60px] flex items-center justify-center gap-3
              disabled:opacity-50 disabled:cursor-not-allowed
            "
            style={{ fontFamily: "var(--font-oswald)" }}
          >
            {loading ? (
              <>
                <svg className="animate-spin w-6 h-6" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Fetching Videos...
              </>
            ) : (
              <>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"/>
                </svg>
                Sync YouTube Channel
              </>
            )}
          </button>

          {message && (
            <div
              className={`
                p-4 rounded-xl border
                ${
                  message.includes("Error")
                    ? "bg-red-900/20 border-red-500/30 text-red-400"
                    : message.includes("Successfully")
                    ? "bg-green-900/20 border-green-500/30 text-green-400"
                    : "bg-blue-900/20 border-blue-500/30 text-blue-400"
                }
              `}
            >
              {message}
            </div>
          )}

          {stats && (
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-[#1A1A1A] rounded-xl border border-[#52525B]/30">
                <div 
                  className="text-4xl font-bold text-white"
                  style={{ fontFamily: "var(--font-oswald)" }}
                >
                  {stats.totalOnChannel?.toLocaleString()}
                </div>
                <div className="text-xs text-[#71717A] uppercase tracking-wide mt-1">
                  On Channel
                </div>
              </div>
              <div className="text-center p-4 bg-[#1A1A1A] rounded-xl border border-[#D4AF37]/30">
                <div 
                  className="text-4xl font-bold text-[#D4AF37]"
                  style={{ fontFamily: "var(--font-oswald)" }}
                >
                  {stats.matching30to35min}
                </div>
                <div className="text-xs text-[#71717A] uppercase tracking-wide mt-1">
                  30-35 Min
                </div>
              </div>
              <div className="text-center p-4 bg-[#1A1A1A] rounded-xl border border-[#22C55E]/30">
                <div 
                  className="text-4xl font-bold text-[#22C55E]"
                  style={{ fontFamily: "var(--font-oswald)" }}
                >
                  {stats.inserted}
                </div>
                <div className="text-xs text-[#71717A] uppercase tracking-wide mt-1">
                  Saved
                </div>
              </div>
            </div>
          )}

          <div className="p-4 bg-[#1A1A1A] rounded-xl border border-[#52525B]/30">
            <h2 
              className="font-semibold mb-3 text-[#D4AF37] uppercase tracking-wide text-sm"
              style={{ fontFamily: "var(--font-oswald)" }}
            >
              Instructions
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-sm text-[#A3A3A3]">
              <li>Click the button above to fetch ALL videos from the NML channel</li>
              <li>Only videos with 30-35 minute duration are saved</li>
              <li>
                Go to{" "}
                <a 
                  href="https://supabase.com/dashboard/project/kltqxqxbfzczlupxstsx/editor" 
                  target="_blank" 
                  className="text-[#D4AF37] hover:text-[#F5D76E] underline"
                >
                  Supabase Table Editor
                </a>
              </li>
              <li>Tag each video with the correct workout_type and muscle_groups</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
