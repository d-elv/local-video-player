"use client";

import { formatDuration } from "@/lib/formatters";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useFileDetails } from "../contexts/FileDetailsContext";
import { showDirectoryPicker } from "file-system-access";
import { useEffect } from "react";

type VideoInfo = {
  name: string;
  thumbnail: string | null;
  duration: number | null;
  videoUrl: string;
};

type VideoInfoFromDb = {
  id: string;
  user_id: string;
  file_name: string;
  thumbnail: string;
  progress: number;
  duration: number;
};

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

async function fetchVideosInDb() {
  const supabase = createClient();
  const { data } = await supabase.from("videos").select();
  return data;
}

async function upsertToDb(videoDetails: VideoInfo[]) {
  const supabase = createClient();

  const videosInDb = await fetchVideosInDb();

  const { data } = await supabase
    .from("videos")
    .upsert(
      videoDetails.map((detail) => {
        if (videosInDb !== null) {
          const matchingVideos = videosInDb.filter(
            (video: VideoInfoFromDb) => video.id === detail.name
          );
          if (matchingVideos.length === 0) {
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
            const matchingVideo: VideoInfoFromDb = matchingVideos[0];
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
}

export default function Dashboard() {
  const { fileDetails, setFileDetails } = useFileDetails();

  useEffect(() => {
    function iPhoneDetector() {
      if (window.navigator.userAgent.includes("iPhone")) {
        alert("We have detected you are on an iPhone");
        alert("Please expect this app not to function correctly");
      }
    }
    iPhoneDetector();
  }, []);

  const handleFolderSelect = async () => {
    const showPicker = async () => {
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

        setFileDetails(details);
        upsertToDb(details);
      } catch (error) {
        console.error(error);
        alert("This device does not support directory picking");
      }
    };
    showPicker();
  };
  return (
    <main>
      <button
        className="w-full rounded-md bg-sky-700 text-blue-100 text-xl p-4"
        onClick={handleFolderSelect}
      >
        Scan a folder with the media you want to watch
      </button>

      {fileDetails.length > 0 ? (
        <ul>
          {fileDetails.map((file, index) => (
            <li className="mt-2 bg-sky-300 rounded-lg" key={index}>
              <Link
                href={{
                  pathname: `/dashboard/videos/${file.name}/watch`,
                  query: { videoUrl: file.videoUrl },
                }}
                className="h-full flex items-center justify-start hover:bg-sky-400 rounded-lg transition-all"
              >
                {file.thumbnail ? (
                  <img
                    alt={`Thumbnail of video titled ${file.name}`}
                    src={file.thumbnail}
                    className="w-[102px] h-[72px] object-cover rounded-tl-lg rounded-bl-lg"
                  />
                ) : null}
                <p className="text-black truncate ml-2 lg:ml-4">{file.name}</p>
                {file.duration ? (
                  <p className="text-black ml-auto mr-2 max-w-full lg:mr-4">
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
