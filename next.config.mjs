/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  experimental: {
    // Default Next.js untuk Server Action cuma 1MB - dinaikkan supaya
    // upload foto (yang sudah dikompres di browser, tapi tetap dikasih
    // jaring pengaman) tidak gagal/lambat kalau ternyata masih agak besar.
    serverActions: {
      bodySizeLimit: "8mb",
    },
  },
};

export default nextConfig;
