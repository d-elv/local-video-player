"use client";

import { formatDuration } from "@/app/utils/general/formatters";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";

type VideoInfoFromConvex = {
  _id: Id<"videos">;
  _creationTime: number;
  userId: Id<"users">;
  fileName: string;
  thumbnail: string;
  progress: number;
  duration: number;
  videoUrl?: string;
};

export default function SavedVideos() {
  const videos = useQuery(api.videos.getVideos);

  function sortVideosOnDisplay(a: VideoInfoFromConvex, b: VideoInfoFromConvex) {
    return a.fileName.localeCompare(b.fileName);
  }

  if (!videos) {
    return <p className="mt-2 animate-pulse">Loading videos...</p>;
  }

  return (
    <>
      <h1 className="text-2xl">History</h1>
      {videos.length > 0 ? (
        <ul>
          {videos
            .sort(sortVideosOnDisplay)
            .map((file: VideoInfoFromConvex, index: number) => (
              <li
                className="mt-2 bg-sky-300 rounded-lg flex items-center truncate justify-start hover:bg-sky-400 transition-all"
                key={index}
              >
                {file.thumbnail ? (
                  <img
                    alt={`Thumbnail of video titled ${file.fileName}`}
                    src={file.thumbnail}
                    className="w-[102px] min-w-[102px] h-[72px] object-cover rounded-tl-lg rounded-bl-lg"
                  />
                ) : null}
                <div>
                  <p className="text-black truncate ml-2 mr-1 lg:ml-4 font-semibold">
                    {file.fileName}
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
        <p className="mt-2 animate-pulse">Saved Videos will appear here...</p>
      )}
    </>
  );
}
