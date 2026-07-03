/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Mengabaikan error ESLint saat proses build di Vercel
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Mengabaikan error TypeScript saat proses build di Vercel
    ignoreBuildErrors: true,
  },
};

export default nextConfig;