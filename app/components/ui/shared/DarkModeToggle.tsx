"use client";

import { MoonStar, SunMedium, SunMoon } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

export function ThemeSwitch() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  function ThemeSwitchButton({
    children,
    onClick,
  }: {
    children: React.ReactNode;
    onClick: () => void;
  }) {
    return (
      <button
        className="flex w-full justify-center items-center md:justify-start md:p-2"
        onClick={onClick}
      >
        {children}
      </button>
    );
  }
  function ThemeSwitchText({ children }: { children: React.ReactNode }) {
    return <p className="md:pl-2">{children}</p>;
  }

  if (!mounted)
    return (
      <div className="flex w-full justify-center md:justify-start md:p-2">
        <SunMoon />
        <p className="pl-2">Mode</p>
      </div>
    );

  if (resolvedTheme === "dark") {
    return (
      <ThemeSwitchButton onClick={() => setTheme("light")}>
        <MoonStar />
        <ThemeSwitchText>Dark Mode</ThemeSwitchText>
      </ThemeSwitchButton>
    );
  }

  if (resolvedTheme === "light") {
    return (
      <ThemeSwitchButton onClick={() => setTheme("dark")}>
        <SunMedium />
        <ThemeSwitchText>Light Mode</ThemeSwitchText>
      </ThemeSwitchButton>
    );
  }
}
