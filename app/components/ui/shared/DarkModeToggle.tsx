"use client";

import { MoonStar, SunMedium, SunMoon } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

export function ThemeSwitch() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted)
    return (
      <div className="flex w-full justify-center md:justify-start md:p-2">
        <SunMoon />
        <p className="pl-2">Mode</p>
      </div>
    );

  if (resolvedTheme === "dark") {
    return (
      <button
        className="flex w-full justify-center md:justify-start md:p-2"
        onClick={() => setTheme("light")}
      >
        <SunMedium />
        <p className="pl-2">Dark Mode</p>
      </button>
    );
  }

  if (resolvedTheme === "light") {
    return (
      <button
        className="flex w-full justify-center md:justify-start md:p-2"
        onClick={() => setTheme("dark")}
      >
        <MoonStar />
        <p className="pl-2">Light Mode</p>
      </button>
    );
  }
}
