// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   eslint: {
//     ignoreDuringBuilds: true,
//   },
//   typescript: {
//     ignoreBuildErrors: true,
//   },
// };

// export default nextConfig;


////////////////////////


// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   eslint: {
//     ignoreDuringBuilds: true,
//   },
//   typescript: {
//     ignoreBuildErrors: true,
//   },
//   experimental: {
//     serverComponentsExternalPackages: ['@prisma/client'],
//   },
//   webpack: (config, { isServer }) => {
//     if (isServer) {
//       config.externals.push('@prisma/client');
//     }
//     return config;
//   },
// };

// export default nextConfig;



import { NextResponse } from 'next/server';

export async function GET() {
  // Return empty array during build to prevent errors
  if (process.env.NODE_ENV === 'production' && !process.env.VERCEL_ENV) {
    return NextResponse.json([], { status: 200 });
  }

  try {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    
    const clients = await prisma.client.findMany({
      select: { client_id: true, client_name: true }
    });
    
    await prisma.$disconnect();
    return NextResponse.json(clients, { status: 200 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json([], { status: 200 });
  }
}