import dotenv from 'dotenv'
dotenv.config()

const CONFIG = {
  NODE_ENV: process.env.NODE_ENV || 'production',
  IS_DEV: process.env.NODE_ENV === 'development',
  SUPABASE_URL: process.env.SUPABASE_URL!,
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
  SUPABASE_SERVICE_ROLE: process.env.SUPABASE_SERVICE_ROLE!,
  OPEN_GRAPH_API_KEY: process.env.OPEN_GRAPH_API_KEY!,
  FACEBOOK_ACCESS_TOKEN: process.env.FACEBOOK_ACCESS_TOKEN!,
  FACEBOOK_PIXEL_ID: process.env.FACEBOOK_PIXEL_ID!,
  SEGMENT_WRITE_KEY: process.env.SEGMENT_WRITE_KEY!,
  BRIGHT_DATA_PROXY_PASSWORD: process.env.BRIGHT_DATA_PROXY_PASSWORD!
};

export default CONFIG
