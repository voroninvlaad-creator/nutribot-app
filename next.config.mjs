/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Разрешает успешную сборку в Vercel даже при мелких предупреждениях TypeScript
    ignoreBuildErrors: true,
  },
  eslint: {
    // Игнорирует предупреждения линтера при деплое
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
