import { FilmIcon, HouseIcon, PowerIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../../public/logo-640x360.png";
import SignOutButton from "./SignOutButton";
import { DarkModeToggle } from "@/app/components/DarkModeToggle";

export default async function SideNav() {
  return (
    <div className="flex h-full md:flex-col px-3 py-4 md:px-2 w-48">
      <Link
        className="mb-2 h-20 rounded-lg bg-blue-200 relative"
        href="/dashboard"
      >
        <Image
          src={Logo}
          alt="Beth's Logo"
          className="object-cover rounded-md h-20"
        />
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
          <div className="w-full hover:bg-sky-100 p-2 block self-end">
            <DarkModeToggle />
          </div>
        </div>
        <SignOutButton />
      </div>
    </div>
  );
}
