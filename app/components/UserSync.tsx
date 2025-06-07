"use client";

import { useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/nextjs";

export function UserSync() {
  const createOrUpdateUser = useMutation(api.users.createOrUpdateUser);
  const { isLoaded, isSignedIn, userId } = useAuth();

  useEffect(() => {
    if (isLoaded && isSignedIn && userId) {
      createOrUpdateUser()
        .then(() => {})
        .catch((error) => console.error("Failed to sync user:", error));
    }
  }, [isLoaded, isSignedIn, userId, createOrUpdateUser]);

  if (!isLoaded) {
    return null;
  }

  return null;
}
