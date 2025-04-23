"use client";

import { formatDuration } from "@/app/utils/general/formatters";
import Link from "next/link";
import { useFileDetails } from "../../contexts/FileDetailsContext";
import { useEffect } from "react";
import { HandleFolderSelect } from "@/app/components/ui/shared/HandleFolderSelect";
import { cn } from "@/app/utils/general/cn";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

type VideoInfoFromConvex = {
  _id: Id<"videos">;
  _creationTime: number;
  userId: Id<"users">;
  fileName: string;
  thumbnail: string;
  progress: number;
  duration: number;
  videoUrl?: string;
};

export default function Dashboard() {
  const { fileDetails, setFileDetails } = useFileDetails();

  const createOrUpdateUser = useMutation(api.users.createOrUpdateUser);
  useEffect(() => {
    createOrUpdateUser();
  }, [createOrUpdateUser]);

  useEffect(() => {
    function iPhoneDetector() {
      if (window.navigator.userAgent.includes("iPhone")) {
        alert("We have detected you may be on an iPhone");
        alert("Please expect this app not to function correctly");
      }
    }
    iPhoneDetector();
  }, []);

  function sortVideosOnDisplay(a: VideoInfoFromConvex, b: VideoInfoFromConvex) {
    return a.fileName.localeCompare(b.fileName);
  }

  return (
    <main>
      <HandleFolderSelect
        fileDetails={fileDetails}
        setFileDetails={setFileDetails}
      />

      {fileDetails.length > 0 ? (
        <ul>
          {fileDetails.sort(sortVideosOnDisplay).map((file, index) => {
            const progressBarWidth = Math.round(
              (file.progress / file.duration) * 100
            );
            return (
              <li className="mt-2 bg-sky-300 rounded-lg" key={index}>
                <Link
                  href={{
                    pathname: `/dashboard/videos/${file.fileName}/watch`,
                    query: {
                      videoUrl: file.videoUrl,
                      progress: file.progress,
                    },
                  }}
                  className="h-full flex items-center justify-start hover:bg-sky-400 rounded-lg transition-all"
                >
                  {file.thumbnail ? (
                    <div className="flex flex-col min-w-[102px] relative">
                      <img
                        alt={`Thumbnail of video titled ${file.fileName}`}
                        src={file.thumbnail}
                        className={cn(
                          "min-w-[102px] h-[72px] object-cover rounded-tl-lg",
                          {
                            "rounded-bl-lg": progressBarWidth === 0,
                          }
                        )}
                      />
                      <div
                        className="absolute bottom-0 rounded-md h-0.5 bg-red-600"
                        style={{ width: `${progressBarWidth}%` }}
                      ></div>
                    </div>
                  ) : null}
                  <p className="text-black truncate ml-2 mr-1 lg:ml-4">
                    {file.fileName}
                  </p>
                  {file.duration ? (
                    <p className="text-white ml-auto mr-2 max-w-full lg:mr-4 text-sm pl-1 pr-1 pt-0.5 pb-0.5 bg-slate-700 rounded-sm">
                      {formatDuration(file.duration)}
                    </p>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="mt-2">Selected files will appear here</p>
      )}
    </main>
  );
}
