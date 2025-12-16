-- NML Workout Selector Database Schema
-- Run this in Supabase SQL Editor

-- Videos table
CREATE TABLE IF NOT EXISTS videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  youtube_id VARCHAR(20) UNIQUE NOT NULL,
  title TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  workout_type VARCHAR(20) NOT NULL,
  muscle_groups TEXT[] NOT NULL,
  thumbnail_url TEXT NOT NULL,
  channel_published_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT valid_duration CHECK (duration_minutes BETWEEN 30 AND 35),
  CONSTRAINT valid_workout_type CHECK (workout_type IN ('lower_body', 'full_body', 'hiit', 'strength')),
  CONSTRAINT non_empty_muscle_groups CHECK (array_length(muscle_groups, 1) > 0)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_videos_workout_type ON videos(workout_type);
CREATE INDEX IF NOT EXISTS idx_videos_duration ON videos(duration_minutes);
CREATE INDEX IF NOT EXISTS idx_videos_published ON videos(channel_published_at DESC);
CREATE INDEX IF NOT EXISTS idx_videos_muscle_groups ON videos USING GIN(muscle_groups);

-- Auto-update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_videos_updated_at ON videos;
CREATE TRIGGER update_videos_updated_at BEFORE UPDATE ON videos
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Workout log table
CREATE TABLE IF NOT EXISTS workout_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id UUID NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  completed_at TIMESTAMP DEFAULT NOW(),
  workout_type VARCHAR(20) NOT NULL,
  muscle_groups TEXT[] NOT NULL,
  duration_minutes INTEGER NOT NULL
);

-- Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_workout_log_completed ON workout_log(completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_workout_log_video ON workout_log(video_id);
CREATE INDEX IF NOT EXISTS idx_workout_log_type ON workout_log(workout_type);
CREATE INDEX IF NOT EXISTS idx_workout_log_completed_type ON workout_log(completed_at DESC, workout_type);

-- Prevent duplicate logs within 1 hour (accidental double-taps)
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_workout_per_hour ON workout_log(video_id, date_trunc('hour', completed_at));

-- Get muscle group readiness status
CREATE OR REPLACE FUNCTION get_muscle_group_status()
RETURNS TABLE (
  workout_type VARCHAR,
  last_worked TIMESTAMP,
  days_ago INTEGER,
  ready BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  WITH last_workouts AS (
    SELECT 
      wl.workout_type,
      MAX(wl.completed_at) as last_worked
    FROM workout_log wl
    GROUP BY wl.workout_type
  )
  SELECT 
    t.type as workout_type,
    COALESCE(lw.last_worked, '1970-01-01'::TIMESTAMP) as last_worked,
    COALESCE(DATE_PART('day', NOW() - lw.last_worked)::INTEGER, 999) as days_ago,
    COALESCE(DATE_PART('day', NOW() - lw.last_worked) >= 3, TRUE) as ready
  FROM (
    VALUES 
      ('lower_body'::VARCHAR),
      ('full_body'::VARCHAR),
      ('hiit'::VARCHAR),
      ('strength'::VARCHAR)
  ) AS t(type)
  LEFT JOIN last_workouts lw ON lw.workout_type = t.type;
END;
$$ LANGUAGE plpgsql;

-- Get video IDs completed in last N days
CREATE OR REPLACE FUNCTION get_recent_video_ids(days INTEGER DEFAULT 42)
RETURNS TABLE (video_id UUID) AS $$
BEGIN
  RETURN QUERY
  SELECT wl.video_id
  FROM workout_log wl
  WHERE wl.completed_at > NOW() - INTERVAL '1 day' * days;
END;
$$ LANGUAGE plpgsql;

-- Row Level Security (RLS)
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_log ENABLE ROW LEVEL SECURITY;

-- Allow public read on videos
DROP POLICY IF EXISTS "Public videos read" ON videos;
CREATE POLICY "Public videos read" ON videos FOR SELECT USING (true);

-- Allow public read/write on workout_log (single household use)
DROP POLICY IF EXISTS "Public workout_log all" ON workout_log;
CREATE POLICY "Public workout_log all" ON workout_log FOR ALL USING (true);

