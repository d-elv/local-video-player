"use client";

import { formatDuration } from "@/app/utils/general/formatters";
import { createClient } from "@/app/utils/supabase/client";
import { useEffect, useState } from "react";

type VideoInfoFromDb = {
  id: string;
  user_id: string;
  file_name: string;
  thumbnail: string;
  progress: number;
  duration: number;
};

export default function SavedVideos() {
  const [videosFromDb, setVideosFromDb] = useState<VideoInfoFromDb[]>([]);
  useEffect(() => {
    async function fetchVideosInDb() {
      const supabase = createClient();
      const { data } = await supabase.from("videos").select();
      if (data !== null) {
        setVideosFromDb(data);
      }
    }
    fetchVideosInDb();
  }, []);

  return (
    <>
      <h1 className="text-2xl">Saved Videos</h1>
      {videosFromDb.length > 0 ? (
        <ul>
          {videosFromDb.map((file, index) => (
            <li
              className="mt-2 bg-sky-300 rounded-lg w-full h-full flex items-center justify-start hover:bg-sky-400 transition-all"
              key={index}
            >
              {file.thumbnail ? (
                <img
                  alt={`Thumbnail of video titled ${file.file_name}`}
                  src={file.thumbnail}
                  className="w-[102px] h-[72px] object-cover rounded-tl-lg rounded-bl-lg"
                />
              ) : null}
              <div>
                <p className="text-black truncate ml-2 lg:ml-4 font-semibold">
                  {file.id}
                </p>
                {file.duration ? (
                  <p className="text-black ml-2 lg:mr-4 text-sm">
                    Duration: {formatDuration(file.duration)}
                  </p>
                ) : null}
                <p className="text-black ml-2 lg:mr-4 text-sm">
                  Progress: {formatDuration(file.progress)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2">Saved Videos will appear here</p>
      )}
    </>
  );
}
