/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  transpilePackages: ["@artist/ui", "@artist/fan-map", "@artist/database"],
};

module.exports = nextConfig;
