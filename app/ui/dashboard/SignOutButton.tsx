"use client";

import { createClient } from "@/utils/supabase/client";
import { PowerIcon } from "lucide-react";
import { redirect } from "next/navigation";

export default function SignOutButton() {
  const supabase = createClient();

  async function handleSignOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log("Error signing out: ", error.message);
    } else {
      redirect("/login");
    }
  }
  return (
    <button
      onClick={handleSignOut}
      className="p-2 flex h-full w-28 md:w-full items-center justify-center text-sm font-medium rounded-tl-md md:rounded-md bg-gray-50 md:gap-2  md:text-base md:h-[48px] hover:bg-destructive md:flex-none md:justify-start md:p-2 md:px-3 transition-colors"
    >
      <PowerIcon className="w-6 text-black" />
      <p className="text-sm hidden md:text-base md:block text-black">
        Sign Out
      </p>
    </button>
  );
}
