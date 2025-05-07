"use client";

import { useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/nextjs";

export function UserSync() {
  const createOrUpdateUser = useMutation(api.users.createOrUpdateUser);
  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      createOrUpdateUser()
        .then(() => console.log("User synced to Convex"))
        .catch((error) => console.error("Failed to sync user:", error));
    }
  }, [isLoaded, isSignedIn, createOrUpdateUser]);

  return null;
}
