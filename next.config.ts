import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import { withContentlayer } from "next-contentlayer2";

const nextConfig: NextConfig = {
  /* config options here */
  pageExtensions: ["md", "mdx", "ts", "tsx"],
  reactStrictMode: true,
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
});

export default withContentlayer(withMDX(nextConfig));
