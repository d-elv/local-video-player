"use client";

import { fetchCurrentUser } from "@/app/hooks/fetchCurrentUser";
import { fetchVideosInDb } from "@/app/hooks/fetchVideosInDb";
import { VideoSkeleton } from "@/app/ui/skeletons";
import { createClient } from "@/app/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { showDirectoryPicker } from "file-system-access";
import { Dispatch, SetStateAction, useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

type VideoInfo = {
  name: string;
  thumbnail: string;
  duration: number;
  videoUrl: string;
};

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

async function upsertToDb(videoDetails: VideoInfo[]) {
  const supabase = createClient();
  const videosInDb = await fetchVideosInDb();
  const user: User | null = await fetchCurrentUser();

  const videosToDisplay: VideoInfoFromConvex[] = videoDetails.map((detail) => {
    const matchingVideo = videosInDb?.find(
      (video: VideoInfoFromConvex) => video.fileName === detail.name
    );

    if (!matchingVideo) {
      return {
        id: detail.name + "_" + user?.email,
        user_id: user?.id,
        fileName: detail.name,
        thumbnail: detail.thumbnail,
        progress: 0,
        duration: detail.duration,
        videoUrl: detail.videoUrl,
      };
    } else {
      return {
        ...matchingVideo,
        videoUrl: detail.videoUrl,
      };
    }
  });

  await supabase
    .from("videos")
    .upsert(videosToDisplay.map(({ videoUrl, ...dbFields }) => dbFields));

  return videosToDisplay;
}

async function processFile(file: File): Promise<{
  name: string;
  thumbnail: string;
  duration: number;
  videoUrl: string;
}> {
  const video = document.createElement("video");
  video.src = URL.createObjectURL(file);
  return new Promise((resolve) => {
    video.onloadedmetadata = () => {
      // Captures thumbnail
      if (video.duration > 120) {
        video.currentTime = 60;
      } else {
        video.currentTime = 1;
      }
    };

    video.onseeked = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = video.videoWidth * 0.1;
      canvas.height = video.videoHeight * 0.1;

      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
      let thumbnail = canvas.toDataURL("image/png", 0.1);

      resolve({
        name: file.name,
        thumbnail,
        duration: video.duration,
        videoUrl: video.src,
      });
    };
    video.addEventListener("error", function (event) {
      alert(
        `An error has occurred on file ${file.name.substring(
          0,
          -4
        )}... - Please check the console for details`
      );
      console.log(event.error);
    });
  });
}

export function HandleFolderSelect({
  fileDetails,
  setFileDetails,
}: {
  fileDetails: VideoInfoFromConvex[];
  setFileDetails: Dispatch<SetStateAction<VideoInfoFromConvex[]>>;
}) {
  const [fileCountDiscrepancy, setFileCountDiscrepancy] = useState(0);
  const [fileCount, setFileCount] = useState(0);

  const insertVideo = useMutation(api.videos.insertVideo);
  const user = useQuery(api.users.getMe);

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

  async function handleShowPicker() {
    async function showPicker() {
      try {
        const handle = await showDirectoryPicker();
        const details: VideoInfo[] = [];
        let fileCountLocal = 0;

        async function getFiles(handle: FileSystemDirectoryHandle) {
          setFileDetails([]);
          setFileCount(0);
          setFileCountDiscrepancy(0);
          const filesToProcess = [];

          for await (const entry of handle.values()) {
            if (entry.kind === "file") {
              const file = await entry.getFile();
              if (file.name !== ".DS_Store") {
                fileCountLocal++;
              }
              if (!file.type.startsWith("video/")) continue;
              filesToProcess.push(file);
            }
          }
          return filesToProcess;
        }
        const filesToProcess = await getFiles(handle);
        setFileCount(fileCountLocal);

        await Promise.all(
          filesToProcess.map(async (file) => {
            details.push(await processFile(file));
          })
        );
        const pickedVideos = await insertToConvex(details);
        const filesToList = pickedVideos.length;

        if (filesToList < fileCountLocal) {
          setFileCountDiscrepancy(fileCountLocal - filesToList);
        }

        setFileDetails(pickedVideos);
      } catch (error) {
        console.error(error);
        alert(
          "An error has occurred. Please raise an issue report with Dan Elvey"
        );
      }
    }
    showPicker();
  }
  return (
    <>
      <button
        className="w-full rounded-md bg-sky-700 text-blue-100 text-xl p-4"
        onClick={handleShowPicker}
      >
        Scan a folder with the media you want to watch
      </button>
      <p className="mt-2 text-sm text-red-600">
        {fileCountDiscrepancy > 0
          ? fileCountDiscrepancy === 1
            ? `${fileCountDiscrepancy} file was scanned but not able to be processed. Please confirm video files are H264 MP4s`
            : `${fileCountDiscrepancy} files were scanned but not able to be processed. Please confirm video files are H264 MP4s`
          : ""}
      </p>
      {fileCount > 0 && fileDetails.length === 0
        ? Array.from({ length: Math.min(fileCount, 3) }, (_, index) => (
            <div key={index}>
              <VideoSkeleton />
            </div>
          ))
        : ""}
    </>
  );
}
