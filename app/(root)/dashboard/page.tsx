"use client";

import { formatDuration } from "@/app/utils/formatters";
import Link from "next/link";
import { useFileDetails } from "../../contexts/FileDetailsContext";
import { HandleFolderSelect } from "@/app/components/ui/shared/HandleFolderSelect";
import { cn } from "@/app/utils/cn";
import { VideoInfoFromConvex } from "@/app/types";
import useDetectDevice from "@/app/hooks/useDetectDevice";

export default function Dashboard() {
  const { fileDetails, setFileDetails } = useFileDetails();
  useDetectDevice();

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
          {fileDetails.sort(sortVideosOnDisplay).map((file) => {
            const progressBarWidth = Math.round(
              (file.progress / file.duration) * 100
            );
            return (
              <li className="mt-2 bg-sky-300 rounded-lg" key={file.fileName}>
                <Link
                  href={{
                    pathname: `/dashboard/watch/${file.fileName}`,
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
