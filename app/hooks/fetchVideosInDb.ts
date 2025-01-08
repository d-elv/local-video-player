import { createClient } from "@/app/utils/supabase/client";

export async function fetchVideosInDb() {
  const supabase = createClient();
  const { data } = await supabase.from("videos").select();
  return data;
}
