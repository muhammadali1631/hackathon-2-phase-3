/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'your-backend-domain.com'],
  },
  env: {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_BETTER_AUTH_URL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
  },
};

module.exports = nextConfig;