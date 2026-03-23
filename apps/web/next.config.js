/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@artist/ui", "@artist/fan-map", "@artist/seo-engine", "@artist/database"],
};

module.exports = nextConfig;
