"use server";

export type VideoInfo = {
  name: string;
  thumbnail: string;
  duration: number;
  videoUrl: string;
};

export type VideoInfoFromDb = {
  id: string;
  user_id: string;
  file_name: string;
  thumbnail: string;
  progress: number;
  duration: number;
};
