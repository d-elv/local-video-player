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
      className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
    >
      <PowerIcon className="w-6 text-black" />
      <div className="hidden md:block text-black">Sign Out</div>
    </button>
  );
}
