/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/login",
        permanent: true,
      },
      {
        source: "/dashboard",
        destination: "/login",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
