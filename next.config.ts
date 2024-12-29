import { withNextVideo } from "next-video/process";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    dirs: ["(root)"],
  },
};

export default withNextVideo(nextConfig);
