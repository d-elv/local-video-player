import { FilmIcon, HouseIcon, PowerIcon } from "lucide-react";
import Link from "next/link";

export default function SideNav() {
  return (
    <div className="flex h-full md:flex-col px-3 py-4 md:px-2">
      <Link
        className="mb-2 flex h-20 items-center justify-center rounded-md bg-blue-600 p-4"
        href="/dashboard"
      >
        Logo
        <div className="w-32 text-black md:w-40"></div>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <div className="h-auto w-full grow rounded-md bg-gray-50 md:block text-black">
          <Link href="/dashboard" className="w-full h-full">
            <div className="flex items-center hover:bg-sky-100 w-full p-2 rounded-md">
              <HouseIcon />
              <p className="pl-2">Dashboard</p>
            </div>
          </Link>
          <Link href="/dashboard/videos" className="w-full h-full">
            <div className="flex items-center hover:bg-sky-100 w-full p-2 rounded-md">
              <FilmIcon />
              <p className="pl-2">Videos</p>
            </div>
          </Link>
        </div>
        <form>
          <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
            <PowerIcon className="w-6 text-black" />
            <div className="hidden md:block text-black">Sign Out</div>
          </button>
        </form>
      </div>
    </div>
  );
}
