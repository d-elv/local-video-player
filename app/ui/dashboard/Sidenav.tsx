import { FilmIcon, HouseIcon } from "lucide-react";
import Link from "next/link";
import SignOutButton from "./SignOutButton";
import { ThemeSwitch } from "@/app/components/DarkModeToggle";

export default async function SideNav() {
  return (
    <div className="flex h-16 md:h-full md:flex-col md:py-4 md:px-2 md:w-48">
      <Link
        className="flex w-28 md:w-full md:h-20 rounded-lg bg-blue-200"
        href="/dashboard"
      >
        <div className="bg-[#00FFFF] grow md:rounded-tl-md md:rounded-bl-md"></div>
        <div className="bg-[#FF00FF] grow"></div>
        <div className="bg-[#FFFF00] grow"></div>
        <div className="bg-[#000000] grow rounded-tr-md md:rounded-br-md"></div>
      </Link>
      <div className="flex w-full h-full items-center justify-around rounded-tl-md rounded-tr-md ml-2 mr-2 bg-gray-50 text-black md:rounded-md md:ml-0 md:mt-2 md:mb-2 md:items-start md:justify-start md:flex-col ">
        <Link
          href="/dashboard"
          className="flex justify-center items-center w-full h-full md:justify-start md:h-10 hover:bg-sky-100"
        >
          <div className="flex rounded-md md:p-2">
            <HouseIcon />
            <p className="pl-2">Home</p>
          </div>
        </Link>
        <Link
          href="/dashboard/saved-videos"
          className="flex justify-center items-center w-full h-full md:justify-start md:h-10 hover:bg-sky-100"
        >
          <div className="flex rounded-md md:p-2">
            <FilmIcon />
            <p className="pl-2">Saved Videos</p>
          </div>
        </Link>
        <div className="flex justify-center items-center w-full h-full md:justify-start md:h-10 hover:bg-sky-100  md:mt-auto">
          <ThemeSwitch />
        </div>
      </div>
      <SignOutButton />
    </div>
  );
}
