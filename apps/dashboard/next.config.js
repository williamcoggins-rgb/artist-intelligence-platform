/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@artist/ui", "@artist/fan-map", "@artist/database"],
};

module.exports = nextConfig;
