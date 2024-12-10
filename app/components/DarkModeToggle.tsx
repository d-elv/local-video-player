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
      <div className="flex p-2 w-full">
        <SunMoon />
        <p className="pl-2"> </p>
      </div>
    );

  if (resolvedTheme === "dark") {
    return (
      <button className="flex p-2 w-full" onClick={() => setTheme("light")}>
        <SunMedium />
        <p className="pl-2">Dark Mode</p>
      </button>
    );
  }

  if (resolvedTheme === "light") {
    return (
      <button className="flex p-2 w-full" onClick={() => setTheme("dark")}>
        <MoonStar />
        <p className="pl-2">Light Mode</p>
      </button>
    );
  }
}
