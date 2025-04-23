import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get videos for the current user

export const getVideos = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      return [];
    }

    const videos = await ctx.db
      .query("videos")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();

    return videos || [];
  },
});

// Save or insert video metadata

export const insertVideo = mutation({
  args: {
    fileName: v.string(),
    customId: v.string(),
    thumbnail: v.string(),
    duration: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Check if video already exists - if not. Insert it
    const existingVideo = await ctx.db
      .query("videos")
      .withIndex("by_userId_and_fileName", (q) =>
        q.eq("userId", user._id).eq("fileName", args.fileName)
      )
      .first();

    if (existingVideo) {
      return existingVideo;
    }
    const videoId = await ctx.db.insert("videos", {
      userId: user._id,
      customId: args.fileName + "_" + user.email,
      fileName: args.fileName,
      thumbnail: args.thumbnail,
      progress: 0,
      duration: args.duration,
    });

    return await ctx.db.get(videoId);
  },
});

export const updateVideoProgress = mutation({
  args: {
    fileName: v.string(),
    progress: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const video = await ctx.db
      .query("videos")
      .withIndex("by_userId_and_fileName", (q) =>
        q.eq("userId", user._id).eq("fileName", args.fileName)
      )
      .first();
    if (!video) {
      throw new Error("Video not found");
    }

    return ctx.db.patch(video._id, {
      progress: args.progress,
    });
  },
});
