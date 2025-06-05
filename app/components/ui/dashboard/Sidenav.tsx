import { CassetteTape, FilmIcon, HouseIcon, PowerIcon } from "lucide-react";
import Link, { LinkProps } from "next/link";
import { SignOutButton } from "@clerk/nextjs";
import { ThemeSwitch } from "@/app/components/ui/shared/DarkModeToggle";

export default async function SideNav() {
  function NavText({ children }: { children: React.ReactNode }) {
    return <p className="pl-2">{children}</p>;
  }

  function NavButton({
    href,
    children,
  }: LinkProps & { children: React.ReactNode }) {
    return (
      <Link
        href={href}
        className="flex justify-center w-full h-full md:justify-start md:h-10 hover:bg-accent hover:rounded-tl-md md:hover:rounded-tr-md md:hover:rounded-tl-md transition-colors"
      >
        <div className="flex rounded-md items-center text-primary-foreground md:p-2 md:w-full">
          {children}
        </div>
      </Link>
    );
  }

  return (
    <div className="flex h-16 flex-shrink-0 md:h-svh md:flex-col md:py-4 md:px-2 md:w-44">
      <Link
        className="flex w-28 md:w-full md:h-20 rounded-lg bg-blue-200"
        href="/dashboard"
      >
        <div className="bg-logo-cyan grow md:rounded-tl-md md:rounded-bl-md"></div>
        <div className="bg-logo-magenta grow"></div>
        <div className="bg-logo-yellow grow"></div>
        <div className="bg-black grow rounded-tr-md md:rounded-br-md"></div>
      </Link>
      <div className="flex w-full h-full justify-around rounded-tl-md rounded-tr-md ml-2 mr-2 bg-secondary text-background md:rounded-md md:ml-0 md:mt-2 md:mb-2 md:items-start md:justify-start md:flex-col">
        <NavButton href="/dashboard">
          <HouseIcon />
          <NavText>Home</NavText>
        </NavButton>
        <NavButton href="/history">
          <FilmIcon />
          <NavText>History</NavText>
        </NavButton>
        <NavButton href="/dashboard/demo">
          <CassetteTape />
          <NavText>Demo</NavText>
        </NavButton>

        <div className="flex items-center justify-center w-full h-full text-primary-foreground md:justify-start md:h-10 hover:bg-accent hover:rounded-tr-md md:hover:rounded-tl-none md:hover:rounded-tr-none md:hover:rounded-bl-md md:hover:rounded-br-md md:mt-auto transition-colors">
          <ThemeSwitch />
        </div>
      </div>
      <SignOutButton redirectUrl="/login">
        <button className="p-2 flex h-full w-28 md:w-full items-center justify-center text-sm font-medium rounded-tl-md md:rounded-md bg-gray-50 md:gap-2  md:text-base md:h-[48px] hover:bg-destructive md:flex-none md:justify-start md:p-2 md:px-3 transition-colors">
          <PowerIcon className="w-6 text-black" />
          <p className="text-sm hidden md:text-base md:block text-black">
            Sign Out
          </p>
        </button>
      </SignOutButton>
    </div>
  );
}
