import { cn } from "@/app/utils/cn";

export function VideoThumbnail({
  thumbnail,
  fileName,
  progressBarWidth,
}: {
  thumbnail: string;
  fileName: string;
  progressBarWidth: number;
}) {
  function ProgressBar({ width }: { width: number }) {
    return (
      <div
        className="absolute bottom-0 rounded-md h-0.5 bg-red-600"
        style={{ width: `${width}%` }}
      ></div>
    );
  }
  return (
    <div className="flex flex-col min-w-[102px] relative">
      <img
        alt={`${fileName} video thumbnail`}
        src={thumbnail}
        className={cn("min-w-[102px] h-[72px] object-cover rounded-tl-lg", {
          "rounded-bl-lg": progressBarWidth === 0,
        })}
      />
      <ProgressBar width={progressBarWidth} />
    </div>
  );
}
