import dotenv from 'dotenv'
dotenv.config()

const CONFIG = {
  ENV: 'production',
  SUPABASE_URL: process.env.SUPABASE_URL!,
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
  SUPABASE_SERVICE_ROLE: process.env.SUPABASE_SERVICE_ROLE!,
  OPEN_GRAPH_API_KEY: process.env.OPEN_GRAPH_API_KEY!,
  FACEBOOK_ACCESS_TOKEN: process.env.FACEBOOK_ACCESS_TOKEN!,
  FACEBOOK_PIXEL_ID: process.env.FACEBOOK_PIXEL_ID!,
  KLAVYIVO_API_KEY: process.env.KLAVYIVO_API_KEY!,
};

export default CONFIG
