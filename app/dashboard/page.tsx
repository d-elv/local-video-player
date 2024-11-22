"use client";

import { formatDuration } from "@/lib/formatters";
import Link from "next/link";
import { useState } from "react";

type VideoInfo = {
  name: string;
  thumbnail: string | null;
  duration: number | null;
  videoUrl: string;
};

const processFile = async (
  file: File
): Promise<{
  name: string;
  thumbnail: string | null;
  duration: number | null;
  videoUrl: string;
}> => {
  if (file.type.startsWith("video/")) {
    const video = document.createElement("video");
    video.src = URL.createObjectURL(file);
    return new Promise((resolve) => {
      video.onloadedmetadata = () => {
        // Capture thumbnail at 1 second
        video.currentTime = 1;
      };

      video.onseeked = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

        const thumbnail = canvas.toDataURL("image/png");

        resolve({
          name: file.name,
          thumbnail,
          duration: video.duration,
          videoUrl: video.src,
        });
      };
    });
  }

  return {
    name: file.name,
    thumbnail: null,
    duration: null,
    videoUrl: file.name,
  };
};

export default function Dashboard() {
  const [fileDetails, setFileDetails] = useState<VideoInfo[]>([]);

  const handleFolderSelect = async () => {
    if ("showDirectoryPicker" in window) {
      try {
        const directoryHandle = await window.showDirectoryPicker();
        const details: {
          name: string;
          thumbnail: string | null;
          duration: number | null;
          videoUrl: string;
        }[] = [];

        for await (const entry of directoryHandle.values()) {
          if (entry.kind === "file") {
            const file = await entry.getFile();
            if (!file.type.startsWith("video/")) continue;
            const detail = await processFile(file);
            details.push(detail);
          } else if (entry.kind === "directory") {
          }
        }
        setFileDetails(details);
      } catch (error) {
        console.error("Error while accessing the directory:", error);
      }
    } else {
      // TODO: Add Focus and show option for input dialog multiple file select
      alert("Your browser does not support the File System Access API.");
    }
  };
  return (
    <main>
      <button
        className="w-full rounded-md bg-sky-700 text-blue-100 text-xl p-4"
        onClick={handleFolderSelect}
      >
        Scan a folder with the media you want to watch
      </button>
      {/* TO ADD: Radio Button options of selecting files in stead of folders */}

      {fileDetails.length > 0 ? (
        <ul>
          {fileDetails.map((file, index) => (
            <li className="mt-2 bg-sky-300 rounded-lg" key={index}>
              <Link
                href={{
                  pathname: `/dashboard/videos/${file.name}/watch`,
                  query: { videoUrl: file.videoUrl },
                }}
                className="w-full h-full flex items-center justify-start hover:bg-sky-400 rounded-lg transition-all"
              >
                {file.thumbnail ? (
                  <img
                    alt="Video Thumbnail"
                    src={file.thumbnail}
                    className="w-[102px] h-[72px] object-cover rounded-tl-lg rounded-bl-lg"
                  />
                ) : null}
                <p className="text-black truncate ml-2 lg:ml-4">{file.name}</p>
                {file.duration ? (
                  <p className="text-black ml-auto mr-2 lg:mr-4">
                    {formatDuration(file.duration)}
                  </p>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2">Selected files will appear here</p>
      )}
    </main>
  );
}
