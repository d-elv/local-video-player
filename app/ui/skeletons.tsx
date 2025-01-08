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
      {/* <div className="flex p-4">
        <div className="h-5 w-5 rounded-md bg-gray-400" />
        <div className="ml-2 h-6 w-16 rounded-md bg-gray-200 text-sm font-medium" />
      </div>
      <div className="flex items-center justify-center truncate rounded-xl bg-white px-4 py-8">
        <div className="h-7 w-20 rounded-md bg-gray-400" />
      </div> */}
    </div>
  );
}
