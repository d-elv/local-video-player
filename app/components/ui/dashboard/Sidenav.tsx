import { FilmIcon, HouseIcon } from "lucide-react";
import Link from "next/link";
import SignOutButton from "./SignOutButton";
import { ThemeSwitch } from "@/app/components/ui/shared/DarkModeToggle";

export default async function SideNav() {
  return (
    <div className="flex h-16 flex-shrink-0 md:h-full md:flex-col md:py-4 md:px-2 md:w-44">
      <Link
        className="flex w-28 md:w-full md:h-20 rounded-lg bg-blue-200"
        href="/dashboard"
      >
        <div className="bg-[#00FFFF] grow md:rounded-tl-md md:rounded-bl-md"></div>
        <div className="bg-[#FF00FF] grow"></div>
        <div className="bg-[#FFFF00] grow"></div>
        <div className="bg-[#000000] grow rounded-tr-md md:rounded-br-md"></div>
      </Link>
      <div className="flex w-full h-full justify-around rounded-tl-md rounded-tr-md ml-2 mr-2 bg-secondary text-background md:rounded-md md:ml-0 md:mt-2 md:mb-2 md:items-start md:justify-start md:flex-col">
        <Link
          href="/dashboard"
          className="flex justify-center w-full h-full md:justify-start md:h-10 hover:bg-accent hover:rounded-tl-md md:hover:rounded-tr-md md:hover:rounded-tl-md transition-colors"
        >
          <div className="flex rounded-md items-center text-primary-foreground md:p-2 md:w-full">
            <HouseIcon />
            <p className="pl-2">Home</p>
          </div>
        </Link>
        <Link
          href="/dashboard/saved-videos"
          className="flex justify-center w-full h-full md:h-10 hover:bg-accent transition-colors"
        >
          <div className="flex rounded-md justify-center items-center md:justify-start  text-primary-foreground md:p-2 md:w-full">
            <FilmIcon />
            <p className="pl-2">History</p>
          </div>
        </Link>
        <div className="flex items-center justify-center w-full h-full text-primary-foreground md:justify-start md:h-10 hover:bg-accent hover:rounded-tr-md md:hover:rounded-tl-none md:hover:rounded-tr-none md:hover:rounded-bl-md md:hover:rounded-br-md md:mt-auto transition-colors">
          <ThemeSwitch />
        </div>
      </div>
      <SignOutButton />
    </div>
  );
}
