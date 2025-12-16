# NML Workout Selector

A mobile-first web app that intelligently selects 30-35 minute workout videos from the Nourish Move Love YouTube channel, ensuring variety and proper muscle group recovery.

## Features

- ✅ 30-35 minute videos only
- ✅ No repeats within 42 days
- ✅ 3-day rest between same muscle groups
- ✅ Direct YouTube links (opens native app)
- ✅ Mobile-optimized (44px tap targets)
- ✅ <2 second load time

## Tech Stack

- **Framework**: Next.js 14 (App Router with Server Actions)
- **Database**: Supabase (PostgreSQL)
- **API**: YouTube Data API v3
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## Getting Started

### Prerequisites

1. **Supabase Account** (free tier)
   - Create a new project at [supabase.com](https://supabase.com)
   - Copy your project URL and anon key

2. **Google Cloud Account** (for YouTube API)
   - Go to [console.cloud.google.com](https://console.cloud.google.com)
   - Create a new project
   - Enable YouTube Data API v3
   - Create an API key

3. **Vercel Account** (for hosting)
   - Sign up at [vercel.com](https://vercel.com)

### Setup Steps

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.local.example .env.local
   ```
   Then edit `.env.local` with your keys:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   YOUTUBE_API_KEY=your_youtube_api_key
   ```

3. **Set up database**:
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Copy and run the SQL from `database/schema.sql`

4. **Run development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

## Initial Video Setup

1. Go to `/admin` in your app
2. Click "Fetch New Videos from YouTube"
3. Go to Supabase dashboard → `videos` table
4. Tag each video with:
   - `workout_type`: `lower_body`, `full_body`, `hiit`, or `strength`
   - `muscle_groups`: Array of muscle groups (e.g., `["legs", "glutes"]`)

## Deployment

### Step 1: Push to GitHub

See `GITHUB_SETUP.md` for detailed instructions, or:

```bash
# Create repo on GitHub first, then:
git remote add origin https://github.com/yourusername/nml-workout-selector.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Add environment variables:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `YOUTUBE_API_KEY`
   - Deploy!

3. **Set up custom domain** (optional):
   - In Vercel project settings, add your domain

## Project Structure

```
nml-workout-selector/
├── app/
│   ├── actions/
│   │   └── workouts.ts          # Server actions
│   ├── api/
│   │   └── admin/
│   │       └── fetch-videos/    # Admin API route
│   ├── admin/                   # Admin page
│   ├── workouts/                # Workout selection page
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                # Home page
│   └── loading.tsx              # Loading state
├── components/
│   ├── WorkoutCard.tsx         # Video card component
│   ├── MuscleStatusBadge.tsx   # Status indicator
│   └── LoadingSpinner.tsx      # Loading spinner
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # Client-side Supabase
│   │   └── server.ts           # Server-side Supabase
│   └── youtube.ts              # YouTube API helpers
├── database/
│   └── schema.sql              # Database schema
└── types/
    └── index.ts                # TypeScript types
```

## Weekly Maintenance

1. Go to `/admin` and fetch new videos
2. Tag new videos in Supabase with workout type and muscle groups
3. Check error logs in Vercel dashboard

## Troubleshooting

### YouTube API quota exceeded
- YouTube API has 10,000 units/day limit
- Each search = 100 units, each video fetch = 1 unit
- Reduce frequency of video fetching or apply for quota increase

### No workouts showing
- Check if videos are in database
- Verify videos are tagged with workout_type
- Check if all videos were recently completed (relax constraints)

### Images not loading
- Verify YouTube domains are in `next.config.ts`
- Check thumbnail URLs in database

## License

MIT
