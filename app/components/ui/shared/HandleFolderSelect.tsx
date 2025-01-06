"use client";

import { createClient } from "@/app/utils/supabase/client";
import { showDirectoryPicker } from "file-system-access";
import { Dispatch, SetStateAction } from "react";

type VideoInfo = {
  name: string;
  thumbnail: string | null;
  duration: number | null;
  videoUrl: string;
};

type VideoInfoFromDbWithUrl = {
  id: string;
  user_id: string;
  file_name: string;
  thumbnail: string;
  progress: number;
  duration: number;
  videoUrl: string;
};

type VideoInfoFromDb = Omit<VideoInfoFromDbWithUrl, "videoUrl">;

async function fetchVideosInDb() {
  const supabase = createClient();
  const { data } = await supabase.from("videos").select();
  return data;
}

async function upsertToDb(videoDetails: VideoInfo[]) {
  const supabase = createClient();

  const videosInDb = await fetchVideosInDb();
  const matchingVideosFromDb: VideoInfoFromDbWithUrl[] = [];

  const { data } = await supabase
    .from("videos")
    .upsert(
      videoDetails.map((detail) => {
        if (videosInDb !== null) {
          let matchingVideo: VideoInfoFromDbWithUrl = videosInDb.find(
            (video: VideoInfoFromDb) => video.id === detail.name
          );
          matchingVideo.videoUrl = detail.videoUrl;
          matchingVideosFromDb.push(matchingVideo);
          if (!matchingVideo) {
            // Inserts into db as new entry
            return {
              id: detail.name,
              file_name: detail.name,
              thumbnail: detail.thumbnail,
              progress: 0,
              duration: detail.duration,
            };
          } else {
            // Upserts to db without overwriting progress
            return {
              id: detail.name,
              file_name: detail.name,
              thumbnail: detail.thumbnail,
              progress: matchingVideo.progress,
              duration: detail.duration,
            };
          }
        }
      })
    )
    .select();

  if (data) {
  }
  return matchingVideosFromDb;
}

async function processFile(file: File): Promise<{
  name: string;
  thumbnail: string | null;
  duration: number | null;
  videoUrl: string;
}> {
  const video = document.createElement("video");
  video.src = URL.createObjectURL(file);
  return new Promise((resolve) => {
    video.onloadedmetadata = () => {
      // Captures thumbnail at 1 second
      video.currentTime = 1;
    };

    video.onseeked = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
      const thumbnail = canvas.toDataURL("image/webp", 0.5);

      resolve({
        name: file.name,
        thumbnail,
        duration: video.duration,
        videoUrl: video.src,
      });
    };
    video.onerror = () => {
      alert("Video rejected " + file.name);
    };
  });
}

export function HandleFolderSelect({
  setFileDetails,
}: {
  setFileDetails: Dispatch<SetStateAction<VideoInfoFromDbWithUrl[]>>;
}) {
  async function handleShowPicker() {
    async function showPicker() {
      try {
        const handle = await showDirectoryPicker();
        const details: {
          name: string;
          thumbnail: string | null;
          duration: number | null;
          videoUrl: string;
        }[] = [];

        async function getFiles(handle: FileSystemDirectoryHandle) {
          const filesToProcess = [];
          for await (const entry of handle.values()) {
            if (entry.kind === "file") {
              const file = await entry.getFile();
              if (!file.type.startsWith("video/")) continue;
              filesToProcess.push(file);
            }
          }
          return filesToProcess;
        }
        const filesToProcess = await getFiles(handle);

        await Promise.all(
          filesToProcess.map(async (file) => {
            details.push(await processFile(file));
          })
        );
        const pickedVideos = await upsertToDb(details);
        setFileDetails(pickedVideos);
      } catch (error) {
        console.error(error);
        alert("This device may not support directory picking");
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
    </>
  );
}
