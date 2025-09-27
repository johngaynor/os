import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/social/persons/person",
        destination: "/social/persons",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
