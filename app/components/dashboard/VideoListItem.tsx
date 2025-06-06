import { VideoInfoFromConvex } from "@/app/types";
import { formatDuration } from "@/app/utils/formatters";
import Link from "next/link";
import { VideoThumbnail } from "./VideoThumbnail";

function VideoDuration({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-white ml-auto mr-2 max-w-full lg:mr-4 text-sm pl-1 pr-1 pt-0.5 pb-0.5 bg-slate-700 rounded-sm">
      {children}
    </p>
  );
}

function FileName({ children }: { children: React.ReactNode }) {
  return <p className="text-black truncate ml-2 mr-1 lg:ml-4">{children}</p>;
}

interface VideoListItemProps {
  file: VideoInfoFromConvex;
}

export function VideoListItem({ file }: VideoListItemProps) {
  const progressBarWidth = Math.round((file.progress / file.duration) * 100);

  return (
    <li className="mt-2 bg-sky-300 rounded-lg">
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
        {file.thumbnail && (
          <VideoThumbnail
            thumbnail={file.thumbnail}
            fileName={file.fileName}
            progressBarWidth={progressBarWidth}
          />
        )}
        <FileName>{file.fileName}</FileName>
        <VideoDuration>{formatDuration(file.duration)}</VideoDuration>
      </Link>
    </li>
  );
}
