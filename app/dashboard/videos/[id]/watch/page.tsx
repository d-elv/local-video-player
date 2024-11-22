"use client";

import { notFound, useSearchParams } from "next/navigation";
import Player from "next-video/player";
import { useEffect, useRef } from "react";

// import { Metadata } from "next";

// export const metadata: Metadata = {
//   title: "Edit invoice",
// };

export default function Watch() {
  const searchParams = useSearchParams();

  const videoUrl = searchParams.get("videoUrl");
  const videoRef = useRef<HTMLVideoElement>(null);
  console.log(videoUrl);

  useEffect(() => {
    // For setting the playback location of the video loaded.
    const video = videoRef.current;

    if (video) {
      const handleLoadedMetadata = () => {
        // This should be updated to equal "Progress" from db.
        video.currentTime = 3;
      };

      video.addEventListener("loadedmetadata", handleLoadedMetadata);

      return () => {
        video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      };
    }
  }, [videoUrl]);

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
