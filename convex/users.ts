import { mutation, query } from "./_generated/server";

// Get the current user data from Convex
export const getMe = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    // Find user by their Clerk ID

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();
    return user;
  },
});

// Create or update user when they log in
export const createOrUpdateUser = mutation({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Get user info from the Clerk identity
    const clerkId = identity.subject;
    const email = identity.email!;

    // Look for existing user
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
      .first();

    if (existingUser) {
      // Update existing user
      return ctx.db.patch(existingUser._id, {
        email: email,
        lastSeenAt: Date.now(),
      });
    } else {
      // Create new user
      return ctx.db.insert("users", {
        clerkId,
        email,
        createdAt: Date.now(),
        lastSeenAt: Date.now(),
      });
    }
  },
});
