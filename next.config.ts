import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1", "172.24.0.1"],
  async redirects() {
    return [
      {
        source: "/",
        has: [{ type: "cookie", key: "portfolio-locale", value: "fa" }],
        destination: "/fa",
        permanent: false,
      },
      { source: "/", destination: "/en", permanent: false },
    ];
  },
};

export default nextConfig;
