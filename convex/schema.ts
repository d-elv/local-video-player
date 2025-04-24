import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    createdAt: v.number(),
    lastSeenAt: v.number(),
  })
    .index("by_clerkId", ["clerkId"])
    .index("by_email", ["email"]),

  videos: defineTable({
    userId: v.id("users"),
    customId: v.string(),
    fileName: v.string(),
    thumbnail: v.string(),
    progress: v.number(),
    duration: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_and_fileName", ["userId", "fileName"]),
});
