import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://aiwkusjjzolabsnzpxot.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpd2t1c2pqem9sYWJzbnpweG90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODc4MDA1NTcsImV4cCI6MjAwMzM3NjU1N30.PscGQEtOKvFg3M2_N0N8jOfhpZ2K2vguy6pVhURFg68";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
