export function VideoSkeleton() {
  return (
    <div
      className={
        "relative overflow-hidden rounded-xl animate-pulse bg-gray-500 shadow-sm flex items-center justify-start mb-2"
      }
    >
      <div className="w-[102px] h-[72px] object-cover rounded-tl-lg rounded-bl-lg bg-gray-600"></div>
      <div className="w-full h-[24px] ml-2 mr-2 rounded-md bg-gray-600"></div>
      <div className="ml-auto mr-2 max-w-full lg:mr-4 w-[35px] h-[20px] pl-1 pr-1 pt-0.5 pb-0.5 bg-slate-700 rounded-sm"></div>
    </div>
  );
}
