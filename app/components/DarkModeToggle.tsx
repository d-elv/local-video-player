"use client";

import { MoonStar, SunMedium } from "lucide-react";
import { useDarkMode } from "../contexts/DarkModeContext";

export function DarkModeToggle() {
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <button onClick={toggleDarkMode} className="w-full flex items-center">
      {darkMode ? <SunMedium /> : <MoonStar />}
    </button>
  );
}
