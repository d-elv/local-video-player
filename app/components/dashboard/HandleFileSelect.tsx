"use client";

import { VideoSkeleton } from "@/app/ui/skeletons";
import { Dispatch, SetStateAction } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { VideoInfoFromConvex, VideoInfo } from "@/app/types";
import { Toaster } from "sonner";
import { useFilePicker } from "@/app/hooks/useFilePicker";

export function HandleFileSelect({
  fileDetails,
  setFileDetails,
}: {
  fileDetails: VideoInfoFromConvex[];
  setFileDetails: Dispatch<SetStateAction<VideoInfoFromConvex[]>>;
}) {
  const insertVideo = useMutation(api.videos.insertVideo);
  const user = useQuery(api.users.getMe);

  const { handleShowPicker, fileCount, fileCountDiscrepancy } = useFilePicker(
    insertToConvex,
    setFileDetails
  );

  async function insertToConvex(videoDetails: VideoInfo[]) {
    const results: VideoInfoFromConvex[] = [];

    for (const video of videoDetails) {
      const result = await insertVideo({
        fileName: video.name,
        customId: video.name + "_" + user?.email,
        thumbnail: video.thumbnail,
        duration: video.duration,
      });

      if (result) {
        results.push({
          ...result,
          videoUrl: video.videoUrl,
        });
      }
    }
    return results;
  }

  function FileCountDiscrepancyText({ count }: { count: number }) {
    if (count === 0) return null;
    return (
      <p className="mt-2 text-sm text-red-600">
        {count} file{count > 1 ? "s" : ""} {count === 1 ? "was" : "were"}{" "}
        scanned but not able to be processed. Please confirm video files are
        H264 MP4s
      </p>
    );
  }

  return (
    <>
      <button
        className="w-full rounded-md bg-sky-700 text-blue-100 text-xl p-4"
        onClick={handleShowPicker}
      >
        Scan a folder with the media you want to watch
      </button>
      <FileCountDiscrepancyText count={fileCountDiscrepancy} />
      {fileCount > 0 && fileDetails.length === 0
        ? Array.from({ length: Math.min(fileCount, 3) }, (_, index) => (
            <div key={index} className="mt-2">
              <VideoSkeleton />
            </div>
          ))
        : ""}
      <Toaster />
    </>
  );
}
