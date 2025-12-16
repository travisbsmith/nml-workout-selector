# Environment Variables Setup

Create a `.env.local` file in the root directory with the following variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# YouTube API Key
YOUTUBE_API_KEY=your_youtube_api_key

# Optional: Admin password for protected routes
ADMIN_PASSWORD=your_admin_password
```

## How to Get These Values

### 1. Supabase Setup

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to Project Settings → API
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Go to SQL Editor and run the SQL from `database/schema.sql`

### 2. YouTube API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (or select existing)
3. Enable **YouTube Data API v3**:
   - Go to "APIs & Services" → "Library"
   - Search for "YouTube Data API v3"
   - Click "Enable"
4. Create an API Key:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API Key"
   - Copy the key → `YOUTUBE_API_KEY`
   - (Optional) Restrict the key to YouTube Data API v3 for security

### 3. Admin Password (Optional)

Set a password for admin routes. This is optional but recommended for production.

