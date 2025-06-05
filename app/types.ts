import { Id } from "@/convex/_generated/dataModel";

export type VideoInfoFromConvex = {
  _id: Id<"videos">;
  _creationTime: number;
  userId: Id<"users">;
  fileName: string;
  thumbnail: string;
  progress: number;
  duration: number;
  videoUrl?: string;
};
