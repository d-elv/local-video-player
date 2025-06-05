"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Player from "next-video/player";
import { useEffect, useRef } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function WatchClient() {
  const searchParams = useSearchParams();
  const videoUrl = searchParams.get("videoUrl");
  const progress = searchParams.get("progress");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const pathname = usePathname();
  const videoName = decodeURI(pathname.split("/")[3]);
  const user = useQuery(api.users.getMe);
  const updateVideoProgress = useMutation(api.videos.updateVideoProgress);

  if (!videoUrl) {
    return (
      <h1 className="text-destructive text-3xl text-center">
        Video Not Found. Please return to the homepage
      </h1>
    );
  }

  useEffect(() => {
    async function updateProgress() {
      if (!user) {
        return;
      }

      if (videoRef.current !== null) {
        updateVideoProgress({
          fileName: videoName,
          progress: videoRef.current.currentTime,
        });
      }
    }
    const intervalId = setInterval(updateProgress, 5000);
    return () => clearInterval(intervalId);
  }, [videoName]);

  return (
    <Player
      style={{ display: "grid", width: "100%" }}
      ref={videoRef}
      currentTime={Number(progress)}
    >
      <source src={videoUrl} type="video/mp4" />
    </Player>
  );
}
