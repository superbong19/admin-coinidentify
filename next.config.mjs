/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {},
  images: {
    domains: [
      "d1lmydz6vu8inb.cloudfront.net",
      "coin-identify-virginia.s3.us-east-1.amazonaws.com",
      "coin-identify-frank-furt.s3.eu-central-1.amazonaws.com",
      "coin-identify-singapore.s3.ap-southeast-1.amazonaws.com",
    ],
  },
}

export default nextConfig
