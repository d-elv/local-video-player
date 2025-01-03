"use client";

import { notFound, usePathname, useSearchParams } from "next/navigation";
import Player from "next-video/player";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createClient } from "@/app/utils/supabase/client";

// import { Metadata } from "next";

// export const metadata: Metadata = {
//   title: "Watch",
// };

type videoInfoFromDb = {
  id: string;
  user_id: string;
  file_name: string;
  thumbnail: string;
  progress: number;
  duration: number;
};

export default function Watch() {
  const supabase = createClient();
  const searchParams = useSearchParams();
  const videoUrl = searchParams.get("videoUrl");
  const progress = searchParams.get("progress");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoDbInfo, setVideoDbInfo] = useState<videoInfoFromDb>();
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const videoName = pathname.split("/")[3];

  if (!videoUrl) {
    notFound();
  }

  useLayoutEffect(() => {
    async function fetchVideoInfo() {
      const { data, error } = await supabase
        .from("videos")
        .select()
        .eq("id", videoName);
      if (data && data.length > 0) {
        setVideoDbInfo(data[0]);
        setLoading(false);
      } else {
        console.error("Error fetching video data from db: ", error);
      }
    }

    fetchVideoInfo();
  }, [supabase, videoName]);

  useEffect(() => {
    async function updateProgress() {
      if (videoRef.current !== null) {
        const { data, error } = await supabase
          .from("videos")
          .update({ progress: videoRef.current.currentTime })
          .eq("id", videoName)
          .select();
        if (data || error) {
        }
      }
    }

    const intervalId = setInterval(updateProgress, 5000);

    return () => clearInterval(intervalId);
  }, [supabase, videoName]);

  useEffect(() => {
    // For setting the playback location of the video loaded.
    // if (videoDbInfo && videoRef.current) {
    //   const video = videoRef.current;
    //   const handleLoadedMetadata = () => {
    //     video.currentTime = videoDbInfo!.progress;
    //   };
    //   if (video.readyState >= 1) {
    //     video.currentTime = progress;
    //   } else {
    //     video.addEventListener("loadedmetadata", handleLoadedMetadata);
    //   }
    //   return () => {
    //     video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    //   };
    // }
  }, [videoRef]);

  return (
    <main>
      {!loading && videoUrl && videoDbInfo ? (
        <>
          <Player
            style={{ display: "grid", width: "100%" }}
            ref={videoRef}
            currentTime={Number(progress)}
          >
            <source src={videoUrl} type="video/mp4" />
          </Player>
        </>
      ) : (
        <div>
          <h1 className="text-2xl text-primary-foreground">Loading Video...</h1>
          <div className="absolute top-[25%] left-1/2">
            <svg
              aria-hidden="true"
              className="w-40 h-40 text-gray-700 animate-spin dark:text-gray-600 fill-sky-400 dark:fill-teal-400"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}
    </main>
  );
}
