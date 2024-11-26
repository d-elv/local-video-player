import { supabase } from "../utils/supabase/supabase";

export type VideoInfo = {
  name: string;
  thumbnail: string;
  duration: number;
  videoUrl: string;
};

export const saveVideosToDatabase = async (videos: VideoInfo) => {
  try {
    const { data, error } = await supabase.from("videos").insert(videos);
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error saving to database:", error);
    throw error;
  }
};
