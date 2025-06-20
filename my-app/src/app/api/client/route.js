// import { NextResponse } from 'next/server';
// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();

// export async function GET() {
//   const clients = await prisma.client.findMany({
//     select: { client_id: true, client_name: true }
//   });
//   return NextResponse.json(clients, { status: 200 });
// }

// import { NextResponse } from 'next/server';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// export async function GET() {
//   try {
//     const clients = await prisma.client.findMany({
//       select: { client_id: true, client_name: true }
//     });
//     return NextResponse.json(clients, { status: 200 });
//   } catch (error) {
//     console.error('Database error:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch clients' }, 
//       { status: 500 }
//     );
//   } finally {
//     await prisma.$disconnect();
//   }
// }



/////


import { NextResponse } from 'next/server';

export async function GET() {
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


//final