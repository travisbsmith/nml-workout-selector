# Quick Start Guide

Get your NML Workout Selector up and running in 15 minutes!

## 🚀 Quick Setup

### 1. Get Your API Keys (5 min)

**Supabase:**
- Sign up at [supabase.com](https://supabase.com)
- Create project → Settings → API → Copy URL and anon key

**YouTube API:**
- Go to [Google Cloud Console](https://console.cloud.google.com)
- Create project → Enable "YouTube Data API v3" → Create API key

### 2. Configure Environment (2 min)

```bash
cd /Users/travissmith/nml-workout-selector

# Create .env.local file
cat > .env.local << EOF
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
YOUTUBE_API_KEY=your_youtube_key_here
EOF
```

Edit `.env.local` with your actual keys.

### 3. Set Up Database (3 min)

1. Go to Supabase → SQL Editor
2. Copy contents of `database/schema.sql`
3. Paste and run

### 4. Run Locally (1 min)

```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### 5. Fetch Initial Videos (2 min)

1. Go to [http://localhost:3000/admin](http://localhost:3000/admin)
2. Click "Fetch New Videos"
3. Go to Supabase → Table Editor → `videos`
4. Tag videos with `workout_type` and `muscle_groups`

### 6. Deploy to GitHub & Vercel (5 min)

**GitHub:**
- Create repo at [github.com/new](https://github.com/new)
- See `GITHUB_SETUP.md` for commands

**Vercel:**
- Go to [vercel.com](https://vercel.com)
- Import GitHub repo
- Add environment variables
- Deploy!

## ✅ You're Done!

Your app is now live! See `SETUP_GUIDE.md` for detailed instructions.

