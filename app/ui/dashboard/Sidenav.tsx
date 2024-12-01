import { FilmIcon, HouseIcon, PowerIcon } from "lucide-react";
import Link from "next/link";

import SignOutButton from "./SignOutButton";

export default async function SideNav() {
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
              <p className="pl-2">Home</p>
            </div>
          </Link>
          <Link href="/dashboard/saved-videos" className="w-full h-full">
            <div className="flex items-center hover:bg-sky-100 w-full p-2 rounded-md">
              <FilmIcon />
              <p className="pl-2">Saved Videos</p>
            </div>
          </Link>
        </div>
        <SignOutButton />
      </div>
    </div>
  );
}
