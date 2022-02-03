import dotenv from 'dotenv'
dotenv.config()

const CONFIG = {
  SUPABASE_URL: process.env.SUPABASE_URL!,
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
  SUPABASE_SERVICE_ROLE: process.env.SUPABASE_SERVICE_ROLE!,
  OPEN_GRAPH_API_KEY: process.env.OPEN_GRAPH_API_KEY!,
};

export default CONFIG
