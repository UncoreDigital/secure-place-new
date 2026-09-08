import type { NextConfig } from "next";

// Supabase Storage serves every uploaded image, so next/image has to be told the
// host is allowed. The hostname is derived from the project URL rather than
// hardcoded, so dev and prod each allow their own project and nothing else.
// The path is pinned to the public object route: without it, this would let the
// image optimiser be pointed at any path on the host.
const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: supabaseHost
      ? [
          {
            protocol: "https" as const,
            hostname: supabaseHost,
            pathname: "/storage/v1/object/public/**",
          },
        ]
      : [],
  },

  // The Astro site's URLs are live and indexed. These land on day one of the
  // cutover; /certification, /about, /contact and /demo keep their paths and
  // need no entry here.
  async redirects() {
    return [
      { source: "/features", destination: "/solutions", permanent: true },
      { source: "/industriesweserve", destination: "/industries", permanent: true },
      { source: "/articles", destination: "/resources", permanent: true },
    ];
  },
};

export default nextConfig;
