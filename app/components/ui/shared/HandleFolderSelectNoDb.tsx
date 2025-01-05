"use client";

import { createClient } from "@/app/utils/supabase/client";
import { showDirectoryPicker } from "file-system-access";
import { Dispatch, SetStateAction } from "react";

type VideoInfo = {
  name: string;
  thumbnail: string;
  duration: number;
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

async function amendType(videoDetails: VideoInfo[]) {
  const videosWithNewTypes: VideoInfoFromDbWithUrl[] = videoDetails.map(
    (video) => {
      return {
        id: video.name,
        user_id: "a",
        file_name: video.name,
        thumbnail: video.thumbnail,
        progress: 0,
        duration: video.duration,
        videoUrl: video.videoUrl,
      };
    }
  );
  return videosWithNewTypes;
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

export function HandleFolderSelectNoDb({
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
          thumbnail: string;
          duration: number;
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
        const pickedVideos = await amendType(details);
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