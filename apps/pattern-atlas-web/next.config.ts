import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@atlas-patterns/content", "@atlas-patterns/schemas", "@atlas-patterns/ui", "@atlas-patterns/database"],
};

export default nextConfig;
