"use client";

import { createClient } from "@/app/utils/supabase/client";
import { showDirectoryPicker } from "file-system-access";
import { Dispatch, SetStateAction, useState } from "react";

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

type VideoInfoFromDb = Omit<VideoInfoFromDbWithUrl, "videoUrl">;

async function fetchVideosInDb() {
  const supabase = createClient();
  const { data } = await supabase.from("videos").select();
  return data;
}

async function upsertToDb(videoDetails: VideoInfo[]) {
  const supabase = createClient();

  const videosInDb = await fetchVideosInDb();
  const videosToDisplay: VideoInfoFromDbWithUrl[] = [];

  const { data } = await supabase
    .from("videos")
    .upsert(
      videoDetails.map((detail) => {
        if (videosInDb !== null) {
          const matchingVideo: VideoInfoFromDbWithUrl = videosInDb.find(
            (video: VideoInfoFromDb) => video.id === detail.name
          );

          if (!matchingVideo) {
            // Inserts into db as new entry
            const videoToPush = {
              id: detail.name,
              user_id: "a",
              file_name: detail.name,
              thumbnail: detail.thumbnail,
              progress: 0,
              duration: detail.duration,
              videoUrl: detail.videoUrl,
            };
            videosToDisplay.push(videoToPush);
            return {
              id: detail.name,
              file_name: detail.name,
              thumbnail: detail.thumbnail,
              progress: 0,
              duration: detail.duration,
            };
          } else {
            matchingVideo.videoUrl = detail.videoUrl;
            videosToDisplay.push(matchingVideo);
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
      // Captures thumbnail at 1 second
      if (video.duration > 120) {
        video.currentTime = 60;
      } else {
        video.currentTime = 1;
      }
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
  const [fileCountDiscrepancy, setFileCountDiscrepancy] = useState(0);

  async function handleShowPicker() {
    async function showPicker() {
      try {
        const handle = await showDirectoryPicker();
        const details: VideoInfo[] = [];
        let fileCount = 0;

        async function getFiles(handle: FileSystemDirectoryHandle) {
          const filesToProcess = [];
          for await (const entry of handle.values()) {
            if (entry.kind === "file") {
              const file = await entry.getFile();
              if (file.name !== ".DS_Store") {
                fileCount++;
              }
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
        const filesToList = pickedVideos.length;

        if (filesToList < fileCount) {
          setFileCountDiscrepancy(fileCount - filesToList);
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
    </>
  );
}
