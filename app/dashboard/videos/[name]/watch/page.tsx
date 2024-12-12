"use client";

import { notFound, usePathname, useSearchParams } from "next/navigation";
import Player from "next-video/player";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { TailSpin } from "react-loader-spinner";

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

    return () => clearInterval(intervalId); // Cleanup
  }, [supabase, videoName]);

  useEffect(() => {
    // For setting the playback location of the video loaded.
    if (videoDbInfo && videoRef.current) {
      const video = videoRef.current;

      const handleLoadedMetadata = () => {
        video.currentTime = videoDbInfo!.progress;
        // video.pause();
      };

      if (video.readyState >= 1) {
        video.currentTime = videoDbInfo.progress;
        // video.pause();
      } else {
        video.addEventListener("loadedmetadata", handleLoadedMetadata);
      }

      return () => {
        video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      };
    }
  }, [videoDbInfo]);

  return (
    <main>
      {!loading && videoUrl && videoDbInfo ? (
        <Player style={{ display: "grid", width: "100%" }} ref={videoRef}>
          <source src={videoUrl} type="video/mp4" />
        </Player>
      ) : (
        <div>
          <h1 className="text-2xl text-primary-foreground">Loading Video...</h1>
          <div className="absolute top-[25%] left-1/2">
            <TailSpin
              visible={true}
              height="120"
              width="120"
              color="#4fa94d"
              ariaLabel="tail-spin-loading"
              radius="1"
            />
          </div>
        </div>
      )}
    </main>
  );
}
