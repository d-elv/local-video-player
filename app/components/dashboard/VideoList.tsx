import { VideoInfoFromConvex } from "@/app/types";
import { VideoListItem } from "./VideoListItem";

const sortVideosOnDisplay = (a: VideoInfoFromConvex, b: VideoInfoFromConvex) =>
  a.fileName.localeCompare(b.fileName);

interface VideoListProps {
  files: VideoInfoFromConvex[];
}
export function VideoList({ files }: VideoListProps) {
  if (files.length === 0) {
    return <p className="mt-2">Selected files will appear here</p>;
  }

  return (
    <ul>
      {files.sort(sortVideosOnDisplay).map((file) => (
        <VideoListItem key={file.fileName} file={file} />
      ))}
    </ul>
  );
}
