"use client";

import { notFound, usePathname, useSearchParams } from "next/navigation";
import Player from "next-video/player";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createClient } from "@/utils/supabase/client";

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
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoDbInfo, setVideoDbInfo] = useState<videoInfoFromDb>();
  const pathname = usePathname();
  const videoName = pathname.split("/")[3];

  useLayoutEffect(() => {
    async function fetchVideoInfo() {
      const { data } = await supabase
        .from("videos")
        .select()
        .eq("id", videoName);
      if (data !== null) {
        setVideoDbInfo(data[0]);
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

    return () => clearInterval(intervalId); // Cleanup
  }, [supabase, videoName]);

  useEffect(() => {
    // For setting the playback location of the video loaded.
    const video = videoRef.current;
    if (video) {
      const handleLoadedMetadata = () => {
        // This should be updated to equal "Progress" from db.

        video.currentTime = videoDbInfo!.progress;
      };
      video.addEventListener("loadedmetadata", handleLoadedMetadata);
      return () => {
        video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      };
    }
  }, [videoDbInfo]);

  if (!videoUrl) {
    notFound();
  }

  return (
    <main>
      {videoUrl ? (
        <Player src={videoUrl} ref={videoRef} />
      ) : (
        <h1 className="text-3xl">Link brok</h1>
      )}
    </main>
  );
}
