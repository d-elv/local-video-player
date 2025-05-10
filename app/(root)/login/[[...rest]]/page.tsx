"use client";

import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <div className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] flex flex-col justify-center items-center">
      <SignIn fallbackRedirectUrl={"/dashboard"} />
    </div>
  );
}
