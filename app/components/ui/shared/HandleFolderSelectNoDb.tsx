"use client";

import { VideoSkeleton } from "@/app/ui/skeletons";
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
  fileDetails,
  setFileDetails,
}: {
  fileDetails: VideoInfoFromDbWithUrl[];
  setFileDetails: Dispatch<SetStateAction<VideoInfoFromDbWithUrl[]>>;
}) {
  const [fileCountDiscrepancy, setFileCountDiscrepancy] = useState(0);
  const [fileCount, setFileCount] = useState(0);

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
        const pickedVideos = await amendType(details);
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
