# Complete Setup Guide

This guide will walk you through setting up the NML Workout Selector from scratch.

## Step 1: Prerequisites

Make sure you have:
- Node.js 18+ installed
- A GitHub account
- A Supabase account (free tier)
- A Google Cloud account (for YouTube API)
- A Vercel account (for hosting)

## Step 2: Local Development Setup

### 2.1 Install Dependencies

```bash
cd /Users/travissmith/nml-workout-selector
npm install
```

### 2.2 Set Up Environment Variables

1. Copy the example file:
   ```bash
   cp ENV_SETUP.md .env.local
   ```

2. Follow the instructions in `ENV_SETUP.md` to get your API keys

3. Edit `.env.local` with your actual values

### 2.3 Set Up Database

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Open `database/schema.sql`
4. Copy and paste the entire SQL into the editor
5. Click **Run** to execute

### 2.4 Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 3: Initial Video Setup

1. Go to `http://localhost:3000/admin`
2. Click "Fetch New Videos from YouTube"
3. Go to Supabase dashboard → **Table Editor** → `videos` table
4. For each video, update:
   - `workout_type`: `lower_body`, `full_body`, `hiit`, or `strength`
   - `muscle_groups`: Array like `["legs", "glutes"]` or `["cardio"]`

## Step 4: GitHub Setup

### 4.1 Create GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it `nml-workout-selector` (or your preferred name)
3. **Don't** initialize with README, .gitignore, or license (we already have these)

### 4.2 Push Your Code

```bash
cd /Users/travissmith/nml-workout-selector

# Add all files
git add .

# Make initial commit
git commit -m "Initial commit: NML Workout Selector"

# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/nml-workout-selector.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 5: Vercel Deployment

### 5.1 Connect Repository

1. Go to [vercel.com](https://vercel.com)
2. Sign in with your GitHub account
3. Click **"New Project"**
4. Import your `nml-workout-selector` repository
5. Vercel will auto-detect Next.js settings

### 5.2 Add Environment Variables

In the Vercel project settings:

1. Go to **Settings** → **Environment Variables**
2. Add each variable from your `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `YOUTUBE_API_KEY`
   - `ADMIN_PASSWORD` (optional)

### 5.3 Deploy

1. Click **Deploy**
2. Wait for deployment to complete
3. Your app will be live at `https://your-project.vercel.app`

### 5.4 Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions

## Step 6: Post-Deployment

### 6.1 Test Your App

1. Visit your live URL
2. Test the workout selection flow
3. Verify YouTube links open correctly
4. Test marking workouts as complete

### 6.2 Set Up Weekly Video Fetching (Optional)

You can set up a cron job to automatically fetch new videos:

1. In Vercel, go to **Settings** → **Cron Jobs**
2. Add a new cron job:
   - **Schedule**: `0 0 * * 0` (weekly on Sunday)
   - **Path**: `/api/admin/fetch-videos`
   - **Secret**: Set `CRON_SECRET` in environment variables

Or use a service like [cron-job.org](https://cron-job.org) to ping your endpoint weekly.

## Troubleshooting

### Videos not showing
- Check if videos are in Supabase `videos` table
- Verify videos are tagged with `workout_type` and `muscle_groups`
- Check browser console for errors

### YouTube API errors
- Verify API key is correct
- Check if YouTube Data API v3 is enabled
- Verify API quota hasn't been exceeded (10,000 units/day)

### Database errors
- Verify Supabase URL and keys are correct
- Check if schema was run successfully
- Verify RLS policies are set correctly

### Build errors
- Run `npm run build` locally to see errors
- Check TypeScript errors: `npx tsc --noEmit`
- Verify all environment variables are set in Vercel

## Next Steps

- Tag initial batch of videos in Supabase
- Test on mobile device (add to home screen)
- Set up weekly video fetching
- Customize colors/branding if desired

